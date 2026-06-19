"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  Briefcase,
  Calendar,
  Crown,
  CreditCard,
  ExternalLink,
  Factory,
  Layers,
  LineChart,
  Loader2,
  LogOut,
  Megaphone,
  Plus,
  Sparkles,
  Trash2,
  TrendingUp,
  Upload,
} from "lucide-react";

import { SkweepLogo } from "@/components/skweep-logo";
import { PricingButton } from "@/components/pricing-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  listSavedAnalyses,
  removeSavedAnalysis,
  type StoredSavedAnalysis,
} from "@/lib/analysis-store";
import {
  clearPlan,
  getPlan,
  nextRenewalDate,
  planLabel,
  type PlanState,
} from "@/lib/plan";

const DASHBOARD_META: Record<
  string,
  { title: string; icon: typeof TrendingUp; href: string }
> = {
  sales: {
    title: "営業パイプライン",
    icon: TrendingUp,
    href: "/dashboards/sales",
  },
  marketing: {
    title: "マーケティング",
    icon: Megaphone,
    href: "/dashboards/marketing",
  },
  executive: {
    title: "経営サマリー",
    icon: Briefcase,
    href: "/dashboards/executive",
  },
  ops: {
    title: "現場オペレーション",
    icon: Factory,
    href: "/dashboards/ops",
  },
  production: {
    title: "生産管理ボード",
    icon: LineChart,
    href: "/dashboards/production",
  },
};

export default function WorkspacePage() {
  const [ready, setReady] = useState(false);
  const [plan, setPlanState] = useState<PlanState | null>(null);
  const [saved, setSaved] = useState<StoredSavedAnalysis[]>([]);

  useEffect(() => {
    setPlanState(getPlan());
    setSaved(listSavedAnalyses());
    setReady(true);
  }, []);

  const removeOne = (id: string) => {
    if (!confirm("この保存済み解析を削除しますか？")) return;
    removeSavedAnalysis(id);
    setSaved(listSavedAnalyses());
  };

  const cancelPlan = () => {
    if (
      !confirm(
        "サブスクリプションを解約します。よろしいですか？\n\n(本番接続後は Stripe Customer Portal で正規の解約手続きを行います。現在のデモではローカルの契約状態のみ解除します。)"
      )
    ) {
      return;
    }
    clearPlan();
    setPlanState(null);
  };

  if (!ready) {
    return (
      <PageShell>
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            ワークスペースを読み込み中…
          </p>
        </div>
      </PageShell>
    );
  }

  if (!plan) {
    return (
      <PageShell>
        <NotProView />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-12">
          {/* Welcome */}
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-3 py-1 text-xs font-semibold text-white">
                <Crown className="h-3 w-3" />
                Pro 契約中
              </span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                マイ・ワークスペース
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                保存したダッシュボードと契約情報を管理できます。
              </p>
            </div>
            <Link
              href="/upload"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              <Upload className="h-4 w-4" />
              新しい解析を開始
            </Link>
          </div>

          {/* Plan info */}
          <PlanInfoCard plan={plan} onCancel={cancelPlan} />

          {/* Saved analyses */}
          <section className="mt-10">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  保存した解析
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  最大 50 件まで保存可能 (現在 {saved.length} 件)
                </p>
              </div>
            </div>

            {saved.length === 0 ? (
              <EmptySavedState />
            ) : (
              <ul className="mt-6 space-y-3">
                {saved.map((s) => (
                  <SavedAnalysisRow
                    key={s.id}
                    saved={s}
                    onRemove={() => removeOne(s.id)}
                  />
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <SkweepLogo />
            <span className="text-lg font-semibold tracking-tight">Skweep</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm text-muted-foreground">
            <Link href="/upload" className="hover:text-foreground">
              新規解析
            </Link>
            <Link href="/dashboards" className="hover:text-foreground">
              候補一覧
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}

function PlanInfoCard({
  plan,
  onCancel,
}: {
  plan: PlanState;
  onCancel: () => void;
}) {
  const renewal = useMemo(() => nextRenewalDate(plan), [plan]);
  const startedFmt = useMemo(
    () => new Date(plan.startedAt).toLocaleDateString("ja-JP"),
    [plan.startedAt]
  );
  const renewalFmt = useMemo(
    () => renewal.toLocaleDateString("ja-JP"),
    [renewal]
  );

  return (
    <div className="mt-10 grid gap-4 rounded-2xl border border-border bg-background p-6 sm:grid-cols-3 sm:p-7">
      <InfoRow icon={<Sparkles className="h-4 w-4" />} label="現在のプラン">
        <p className="text-sm font-semibold">{planLabel(plan.plan)}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {plan.plan === "annual"
            ? "年単位の自動更新"
            : "月単位の自動更新"}
        </p>
      </InfoRow>
      <InfoRow icon={<Calendar className="h-4 w-4" />} label="契約開始日">
        <p className="text-sm font-semibold">{startedFmt}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          次回更新: {renewalFmt}
        </p>
      </InfoRow>
      <div className="flex flex-col items-start gap-2 sm:items-end sm:justify-center">
        <button
          type="button"
          disabled
          className={cn(
            buttonVariants({ size: "sm", variant: "outline" }),
            "w-full cursor-not-allowed text-xs opacity-70 sm:w-auto"
          )}
          title="本番接続後に Stripe Customer Portal を開きます"
        >
          <CreditCard className="h-3.5 w-3.5" />
          カード情報を変更 (準備中)
          <ExternalLink className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={cn(
            buttonVariants({ size: "sm", variant: "outline" }),
            "w-full text-xs text-destructive hover:bg-destructive/5 sm:w-auto"
          )}
        >
          <LogOut className="h-3.5 w-3.5" />
          サブスクリプションを解約
        </button>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      {children}
    </div>
  );
}

function EmptySavedState() {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-border bg-muted/30 p-10 text-center">
      <Bookmark className="mx-auto h-8 w-8 text-muted-foreground" />
      <h3 className="mt-4 text-base font-semibold">
        まだ保存された解析はありません
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        ダッシュボード画面の「保存」ボタンを押すと、ここに表示されます。
      </p>
      <Link
        href="/upload"
        className={cn(buttonVariants({ size: "sm" }), "mt-5")}
      >
        <Plus className="h-3.5 w-3.5" />
        最初の解析を始める
      </Link>
    </div>
  );
}

function SavedAnalysisRow({
  saved,
  onRemove,
}: {
  saved: StoredSavedAnalysis;
  onRemove: () => void;
}) {
  const slug = saved.lastDashboardSlug;
  const meta = slug ? DASHBOARD_META[slug] : undefined;
  const Icon = meta?.icon ?? Layers;
  const href = meta?.href ?? "/dashboards";
  const savedAtFmt = useMemo(
    () =>
      new Date(saved.savedAt).toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [saved.savedAt]
  );

  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-5 sm:flex-row sm:items-center sm:gap-4">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold" title={saved.title}>
          {saved.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>
            カテゴリ:{" "}
            <span className="font-medium text-foreground">
              {meta?.title ?? saved.output.category ?? "—"}
            </span>
          </span>
          <span>保存: {savedAtFmt}</span>
          <span>
            {saved.totalRowCount.toLocaleString()} 行 ・{" "}
            {saved.output.candidates[0]?.match ?? "—"}%
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={href}
          className={cn(buttonVariants({ size: "sm", variant: "outline" }), "text-xs")}
        >
          開く
          <ArrowRight className="h-3 w-3" />
        </Link>
        <button
          type="button"
          onClick={onRemove}
          className={cn(
            buttonVariants({ size: "icon-sm", variant: "ghost" }),
            "text-muted-foreground hover:bg-destructive/5 hover:text-destructive"
          )}
          aria-label="削除"
          title="削除"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </li>
  );
}

function NotProView() {
  return (
    <main className="flex-1">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-20 text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-500 text-white shadow-md">
          <Crown className="h-8 w-8" />
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
          マイ・ワークスペース
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          解析結果の保存、複数ダッシュボードの管理、共有 URL、PDF 出力は
          <span className="mx-1 font-medium text-foreground">Pro プラン</span>
          でアンロックされます。
        </p>

        <ul className="mt-8 grid w-full max-w-md gap-3 text-left text-sm">
          {[
            "全 5 種類のダッシュボードへフルアクセス",
            "解析結果を最大 50 件まで保存・再閲覧",
            "共有 URL の発行と PDF 出力",
            "プロバイダ切替 (OpenAI / Claude / Gemini)",
          ].map((f) => (
            <li
              key={f}
              className="flex items-start gap-2 rounded-xl border border-border bg-background p-3"
            >
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <PricingButton plan="annual" size="lg">
            Pro にアップグレード
            <ArrowRight className="h-4 w-4" />
          </PricingButton>
          <Link
            href="/upload"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            まずは無料で試す
          </Link>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          すでに契約済みの方で表示が出ない場合、決済完了後の画面から
          <Link
            href="/checkout/success"
            className="mx-1 underline underline-offset-2 hover:text-foreground"
          >
            こちら
          </Link>
          を経由してください。
        </p>
      </div>
    </main>
  );
}
