"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck, Loader2, Lock } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { PricingButton } from "@/components/pricing-button";
import { cn } from "@/lib/utils";
import {
  getCurrentAnalysis,
  saveAnalysis,
} from "@/lib/analysis-store";
import { isPro } from "@/lib/plan";

type Props = {
  /** どのダッシュボードから保存されたか (workspace 一覧で表示) */
  dashboardSlug: string;
  /** ボタンの size (shadcn) */
  size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
  /** ボタンの variant */
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  className?: string;
};

export function SaveToWorkspaceButton({
  dashboardSlug,
  size = "sm",
  variant = "outline",
  className,
}: Props) {
  const [pro, setPro] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedJustNow, setSavedJustNow] = useState(false);

  useEffect(() => {
    setPro(isPro());
  }, []);

  // SSR/初期描画と完全に一致するため、判定確定までは Locked と同じ見た目を出す
  if (pro === null) {
    return (
      <span
        className={cn(
          buttonVariants({ size, variant, className: "text-xs" }),
          className
        )}
        aria-hidden
      >
        <Bookmark className="h-3 w-3" />
        保存
      </span>
    );
  }

  if (!pro) {
    return (
      <PricingButton
        plan="monthly"
        variant={variant}
        size={size}
        className={cn("text-xs", className)}
        context="「保存」は Pro 限定機能です。"
      >
        <Lock className="h-3 w-3" />
        <Bookmark className="h-3.5 w-3.5" />
        保存
      </PricingButton>
    );
  }

  const onClick = async () => {
    setSaving(true);
    try {
      const current = getCurrentAnalysis();
      if (!current) {
        alert(
          "保存できる解析結果がありません。先にアップロード画面でファイルを解析してください。"
        );
        return;
      }
      saveAnalysis(current, { dashboardSlug });
      setSavedJustNow(true);
      setTimeout(() => setSavedJustNow(false), 2400);
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className={cn(
        buttonVariants({ size, variant, className: "text-xs" }),
        "disabled:opacity-70",
        className
      )}
    >
      {saving ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          保存中…
        </>
      ) : savedJustNow ? (
        <>
          <BookmarkCheck className="h-3.5 w-3.5 text-emerald-600" />
          保存しました
        </>
      ) : (
        <>
          <Bookmark className="h-3.5 w-3.5" />
          保存
        </>
      )}
    </button>
  );
}
