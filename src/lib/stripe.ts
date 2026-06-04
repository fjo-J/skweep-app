import Stripe from "stripe";

/**
 * サーバーサイド専用の Stripe クライアント。
 * NEVER import this from a Client Component or `"use client"` ファイル。
 */
let _client: Stripe | null = null;
export function getStripe(): Stripe {
  if (_client) return _client;
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error(
      "STRIPE_SECRET_KEY が未設定です。.env.local または Vercel の環境変数で設定してください。"
    );
  }
  _client = new Stripe(secret, {
    // API バージョンを明示的に固定する場合は下記を有効化
    // apiVersion: "2024-12-18.acacia",
  });
  return _client;
}

/** プラン種別 → Price ID 解決 */
export type Plan = "monthly" | "annual";
export function getPriceIdForPlan(plan: Plan): string {
  const id =
    plan === "annual"
      ? process.env.STRIPE_PRICE_ANNUAL
      : process.env.STRIPE_PRICE_MONTHLY;
  if (!id) {
    throw new Error(
      `STRIPE_PRICE_${plan === "annual" ? "ANNUAL" : "MONTHLY"} が未設定です。`
    );
  }
  return id;
}
