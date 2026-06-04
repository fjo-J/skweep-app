import { NextResponse } from "next/server";
import { z } from "zod";

import { getStripe, getPriceIdForPlan } from "@/lib/stripe";

export const runtime = "nodejs";

const Body = z
  .object({
    plan: z.enum(["monthly", "annual"]),
    email: z.string().email().optional(),
    /** 顧客側で識別したい情報を任意で渡せる (氏名・会社名等) */
    metadata: z
      .record(z.string(), z.string().max(500))
      .optional(),
  })
  .strict();

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { error: "INVALID_JSON" },
      { status: 400 }
    );
  }

  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_INPUT", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  const { plan, email, metadata } = parsed.data;

  try {
    const stripe = getStripe();
    const priceId = getPriceIdForPlan(plan);
    const origin = new URL(request.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      locale: "ja",
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      metadata: {
        plan,
        ...(metadata ?? {}),
      },
      subscription_data: {
        metadata: {
          plan,
          ...(metadata ?? {}),
        },
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "STRIPE_NO_URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "STRIPE_ERROR", message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      error: "METHOD_NOT_ALLOWED",
      message: "POST してください。Body: { plan: 'monthly' | 'annual', email?: string }",
    },
    { status: 405 }
  );
}
