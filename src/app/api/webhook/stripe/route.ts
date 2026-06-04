import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe Webhook 受信エンドポイント。
 *
 * 設定方法:
 *  1. Stripe Dashboard → Developers → Webhooks → Add endpoint
 *  2. URL: https://skweep.jp/api/webhook/stripe
 *  3. 受信イベント: checkout.session.completed,
 *                   customer.subscription.created,
 *                   customer.subscription.updated,
 *                   customer.subscription.deleted,
 *                   invoice.payment_failed
 *  4. 表示された Signing secret (whsec_xxx) を STRIPE_WEBHOOK_SECRET に設定
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    // 未設定なら 200 を返してログだけ残す (テスト中の挙動を許容)
    console.warn(
      "[stripe-webhook] STRIPE_WEBHOOK_SECRET が未設定のためイベントは検証されません"
    );
    return NextResponse.json({ received: true, verified: false });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "MISSING_SIGNATURE" },
      { status: 400 }
    );
  }

  const stripe = getStripe();
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown";
    console.error("[stripe-webhook] signature verification failed:", message);
    return NextResponse.json(
      { error: "INVALID_SIGNATURE", message },
      { status: 400 }
    );
  }

  // Phase 1: ログ出力のみ。
  // Phase 2 で DB 連携 (契約状態の永続化) を追加する想定。
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("[stripe-webhook] checkout.session.completed", {
        id: session.id,
        customer: session.customer,
        subscription: session.subscription,
        email: session.customer_details?.email,
        plan: session.metadata?.plan,
        amountTotal: session.amount_total,
      });
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      console.log(`[stripe-webhook] ${event.type}`, {
        id: sub.id,
        status: sub.status,
        customer: sub.customer,
        currentPeriodEnd: sub.items?.data?.[0]?.current_period_end,
      });
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      console.warn("[stripe-webhook] invoice.payment_failed", {
        id: invoice.id,
        customer: invoice.customer,
        amountDue: invoice.amount_due,
      });
      break;
    }
    default:
      console.log("[stripe-webhook] unhandled event", event.type);
  }

  return NextResponse.json({ received: true, verified: true });
}

export async function GET() {
  return NextResponse.json(
    {
      error: "METHOD_NOT_ALLOWED",
      message: "Stripe からの POST のみ受け付けます。",
    },
    { status: 405 }
  );
}
