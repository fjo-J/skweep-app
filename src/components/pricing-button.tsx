"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Crown,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Plan = "monthly" | "annual";

const PLANS: Record<
  Plan,
  { label: string; price: number; cycle: string; sub: string }
> = {
  monthly: {
    label: "月額プラン",
    price: 1500,
    cycle: "/ 月",
    sub: "いつでもキャンセル可能",
  },
  annual: {
    label: "年額プラン",
    price: 15000,
    cycle: "/ 年",
    sub: "月額換算 ¥1,250 / 月 ・ 2 ヶ月分お得",
  },
};

const FEATURES = [
  "全 4 種のダッシュボードへフルアクセス",
  "保存 & 再編集",
  "共有 URL の発行",
  "PDF 出力",
  "プロバイダ切替 (OpenAI / Claude / Gemini)",
  "優先サポート",
];

type ButtonVariantProps = Parameters<typeof buttonVariants>[0];

type Props = {
  plan?: Plan;
  variant?: ButtonVariantProps extends infer V
    ? V extends { variant?: infer X }
      ? X
      : never
    : never;
  size?: ButtonVariantProps extends infer V
    ? V extends { size?: infer X }
      ? X
      : never
    : never;
  className?: string;
  children: React.ReactNode;
  /** モーダル内の上部に表示される文脈ラベル (例: "営業パイプラインからアップグレード") */
  context?: string;
};

export function PricingButton({
  plan = "monthly",
  variant,
  size,
  className,
  children,
  context,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(buttonVariants({ variant, size }), className)}
      >
        {children}
      </button>
      <PricingDialog
        open={open}
        onOpenChange={setOpen}
        initialPlan={plan}
        context={context}
      />
    </>
  );
}

function PricingDialog({
  open,
  onOpenChange,
  initialPlan,
  context,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPlan: Plan;
  context?: string;
}) {
  const [selected, setSelected] = useState<Plan>(initialPlan);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 開閉ごとに状態を初期化（初期プランは props 同期）
  useEffect(() => {
    if (!open) return;
    setSelected(initialPlan);
    setSubmitting(false);
    setErrorMessage(null);
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("skweep:lead");
        if (raw) {
          const parsed = JSON.parse(raw) as {
            email?: string;
            fullName?: string;
            companyName?: string;
          };
          if (parsed?.email) setEmail(parsed.email);
        }
      } catch {
        // ignore
      }
    }
  }, [open, initialPlan]);

  const current = PLANS[selected];
  const priceFormatted = useMemo(
    () => `¥${current.price.toLocaleString()}`,
    [current]
  );

  const onSubmit = async () => {
    setSubmitting(true);
    setErrorMessage(null);

    // lead 情報を metadata として渡す (任意)
    let metadata: Record<string, string> | undefined;
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("skweep:lead");
        if (raw) {
          const parsed = JSON.parse(raw) as {
            fullName?: string;
            companyName?: string;
          };
          metadata = {};
          if (parsed.fullName) metadata.full_name = parsed.fullName;
          if (parsed.companyName) metadata.company_name = parsed.companyName;
        }
      } catch {
        // ignore
      }
    }

    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selected,
          email: email || undefined,
          metadata,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          message?: string;
          error?: string;
        } | null;
        throw new Error(
          data?.message ?? data?.error ?? `決済セッションの作成に失敗しました (${res.status})`
        );
      }

      const data = (await res.json()) as { url?: string };
      if (!data.url) throw new Error("決済 URL が取得できませんでした");

      // Stripe Checkout へ遷移
      window.location.href = data.url;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "予期しないエラーが発生しました";
      setErrorMessage(message);
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 sm:max-w-lg">
        {(
          <div className="flex flex-col">
            {/* Header */}
            <div className="rounded-t-xl bg-gradient-to-br from-sky-50 via-indigo-50 to-violet-50 p-6">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-500 text-white shadow-sm">
                  <Crown className="h-4 w-4" />
                </span>
                <DialogTitle className="text-base">
                  Skweep Pro にアップグレード
                </DialogTitle>
              </div>
              <DialogDescription className="mt-2">
                {context
                  ? context
                  : "保存・共有 URL・PDF 出力・全ダッシュボードがアンロックされます。"}
              </DialogDescription>
            </div>

            <div className="px-6 pt-5">
              {/* Plan toggle */}
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
                <PlanTab
                  active={selected === "monthly"}
                  onClick={() => setSelected("monthly")}
                  label="月額"
                  sub="¥1,500 / 月"
                />
                <PlanTab
                  active={selected === "annual"}
                  onClick={() => setSelected("annual")}
                  label="年額"
                  sub="¥15,000 / 年"
                  badge="2ヶ月分お得"
                />
              </div>

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight">
                  {priceFormatted}
                </span>
                <span className="text-sm text-muted-foreground">
                  {current.cycle}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{current.sub}</p>

              {/* Features */}
              <ul className="mt-5 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* Email */}
              <div className="mt-6 space-y-1.5">
                <label
                  htmlFor="checkout-email"
                  className="text-xs font-medium text-muted-foreground"
                >
                  ご請求用メールアドレス
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                />
              </div>

              {/* Test mode notice */}
              <p className="mt-5 flex items-start gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-900">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  決済は Stripe の安全な決済ページにリダイレクトします。テスト中はカード番号
                  <span className="mx-1 font-mono">4242 4242 4242 4242</span>
                  をご利用ください。
                </span>
              </p>

              {/* Error */}
              {errorMessage ? (
                <p className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                  {errorMessage}
                </p>
              ) : null}
            </div>

            {/* Footer */}
            <div className="mt-6 flex flex-col gap-2 rounded-b-xl border-t bg-muted/40 p-4 sm:flex-row-reverse sm:items-center">
              <button
                type="button"
                onClick={onSubmit}
                disabled={submitting || !email}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full disabled:opacity-70 sm:w-auto"
                )}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    決済ページに移動中…
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    決済ページへ進む
                  </>
                )}
              </button>
              <div className="flex flex-1 items-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                安全な決済 (Stripe) ・ いつでもキャンセル可
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PlanTab({
  active,
  onClick,
  label,
  sub,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  sub: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-col rounded-lg px-3 py-2.5 text-left transition",
        active
          ? "bg-background shadow-sm ring-1 ring-foreground/10"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <span className="flex items-center gap-2 text-sm font-semibold">
        {label}
        {badge ? (
          <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
            {badge}
          </span>
        ) : null}
      </span>
      <span className="text-[11px] text-muted-foreground">{sub}</span>
    </button>
  );
}

