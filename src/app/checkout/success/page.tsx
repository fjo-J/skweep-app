"use client";

import Link from "next/link";
import { use, useEffect } from "react";
import {
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  Receipt,
} from "lucide-react";

import { SkweepLogo } from "@/components/skweep-logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { promotePendingToActive } from "@/lib/plan";

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = use(searchParams);

  // 決済完了直後に、保留プランを確定状態 (Pro) に昇格させる
  useEffect(() => {
    promotePendingToActive(session_id);
  }, [session_id]);

  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <SkweepLogo />
            <span className="text-lg font-semibold tracking-tight">Skweep</span>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-20 text-center">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            ご加入ありがとうございます！
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Skweep Pro へのお申し込みが完了しました。
            <br />
            すべてのダッシュボード・保存機能・共有 URL・PDF 出力をご利用いただけます。
          </p>

          <div className="mt-10 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/workspace"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              <LayoutDashboard className="h-4 w-4" />
              マイ・ワークスペースへ
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/upload"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              新しい解析を開始
            </Link>
          </div>

          {session_id ? (
            <p className="mt-10 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-[11px] text-muted-foreground">
              <Receipt className="h-3 w-3" />
              注文 ID:
              <span className="font-mono">{session_id}</span>
            </p>
          ) : null}

          <p className="mt-8 max-w-md text-xs leading-relaxed text-muted-foreground">
            領収書はご請求用メールアドレスに自動送信されます。サブスクリプションの解約・カード情報の変更は、マイ・ワークスペースから行えます。
          </p>
        </div>
      </main>
    </div>
  );
}
