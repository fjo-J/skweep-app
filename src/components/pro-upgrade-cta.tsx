"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Crown } from "lucide-react";

import { PricingButton } from "@/components/pricing-button";
import { isPro } from "@/lib/plan";

type Props = {
  /** 大見出し */
  title: string;
  /** 小見出し */
  description: string;
  /** 初期プランプリセット */
  plan?: "monthly" | "annual";
  /** PricingButton の context (モーダル上部の文脈ラベル) */
  context?: string;
};

/**
 * 各ダッシュボードページ末尾の「Pro にアップグレード」帯。
 * Pro 契約済みの場合は何も表示しない。
 */
export function ProUpgradeCta({
  title,
  description,
  plan = "annual",
  context,
}: Props) {
  const [pro, setPro] = useState<boolean | null>(null);

  useEffect(() => {
    setPro(isPro());
  }, []);

  // SSR と初期描画で同じ HTML を返してから、useEffect 後に Pro なら消す
  if (pro) return null;

  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-foreground bg-foreground text-background">
      <div className="flex flex-col items-start justify-between gap-5 p-7 sm:flex-row sm:items-center sm:p-8">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 text-white">
            <Crown className="h-5 w-5" />
          </span>
          <div>
            <p className="text-base font-semibold">{title}</p>
            <p className="mt-1 text-sm text-background/70">{description}</p>
          </div>
        </div>
        <PricingButton
          plan={plan}
          variant="secondary"
          size="lg"
          context={context}
        >
          Pro にアップグレード
          <ArrowUpRight className="h-4 w-4" />
        </PricingButton>
      </div>
    </div>
  );
}
