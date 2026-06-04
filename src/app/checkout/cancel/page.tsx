import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, XCircle } from "lucide-react";

import { SkweepLogo } from "@/components/skweep-logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "決済を中断しました | Skweep",
  description: "決済を中断しました。",
};

export default function CheckoutCancelPage() {
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
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <XCircle className="h-8 w-8" />
          </span>
          <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            決済を中断しました
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            カード情報は入力されていません。気が変わったらいつでも再開できます。
            <br />
            無料版の機能はそのままご利用いただけます。
          </p>

          <div className="mt-10 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/dashboards"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              <ArrowLeft className="h-4 w-4" />
              ダッシュボードに戻る
            </Link>
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              トップへ
            </Link>
          </div>

          <p className="mt-8 max-w-md text-xs leading-relaxed text-muted-foreground">
            ご質問・お困りごとがあれば info@geeno.net までお気軽にご連絡ください。
          </p>
        </div>
      </main>
    </div>
  );
}
