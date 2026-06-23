"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Lock } from "lucide-react";

import { PricingButton } from "@/components/pricing-button";
import { isPro } from "@/lib/plan";

/**
 * ダッシュボード詳細ページ (Pro 限定プレビュー) の上部に表示するバナー。
 * Pro 契約済みの場合は何も表示しない。
 */
export function ProPreviewBanner() {
  const [pro, setPro] = useState<boolean | null>(null);

  useEffect(() => {
    setPro(isPro());
  }, []);

  if (pro) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-6 py-3 sm:flex-row sm:items-center">
        <div className="flex items-start gap-2 text-sm text-amber-900">
          <Lock className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <span className="font-semibold">Pro 限定</span>{" "}
            のダッシュボードをプレビュー表示しています。保存・共有・PDF 出力・自動更新は Pro でアンロックされます。
          </span>
        </div>
        <PricingButton
          plan="annual"
          size="sm"
          className="shrink-0"
          context="プレビュー中のダッシュボードを継続利用するには Pro プランへのご加入が必要です。"
        >
          Pro にアップグレード
          <ArrowUpRight className="h-3.5 w-3.5" />
        </PricingButton>
      </div>
    </div>
  );
}
