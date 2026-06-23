"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Check,
  Factory,
  LayoutDashboard,
  LineChart,
  Loader2,
  Lock,
  Megaphone,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { SkweepLogo } from "@/components/skweep-logo";
import { PricingButton } from "@/components/pricing-button";
import { cn } from "@/lib/utils";
import {
  getCurrentAnalysis,
  type StoredCurrentAnalysis,
} from "@/lib/analysis-store";
import { isPro } from "@/lib/plan";

const ANALYZE_STEPS = [
  "ファイルを読み込み中",
  "列名と型を解析中",
  "業務カテゴリを推定中",
  "KPI 候補を生成中",
  "ダッシュボードを構成中",
];

type CandidateMetaBase = {
  icon: typeof TrendingUp;
  title: string;
  desc: string;
  metrics: string[];
  hasPreview: boolean;
};

const CANDIDATE_META: Record<string, CandidateMetaBase> = {
  sales: {
    icon: TrendingUp,
    title: "営業パイプライン",
    desc: "リード数・受注率・商談ステージのボトルネックを可視化",
    metrics: ["商談ステージ別件数", "受注率トレンド", "担当者別パイプライン"],
    hasPreview: true,
  },
  marketing: {
    icon: Megaphone,
    title: "マーケティング",
    desc: "チャネル流入・CVR・ROAS から効く施策と止めるべき施策を判定",
    metrics: ["チャネル別流入", "CVR 推移", "キャンペーン別 ROAS"],
    hasPreview: true,
  },
  executive: {
    icon: Briefcase,
    title: "経営サマリー",
    desc: "売上・利益・成長率の経営 KPI を 1 枚に集約",
    metrics: ["売上 YoY", "粗利益率", "事業セグメント比"],
    hasPreview: true,
  },
  ops: {
    icon: Factory,
    title: "現場オペレーション",
    desc: "稼働率・タスク進捗・ボトルネックを現場ビューで把握",
    metrics: ["稼働率", "ステータス別タスク数", "リードタイム"],
    hasPreview: true,
  },
  production: {
    icon: LineChart,
    title: "生産管理ボード",
    desc: "工程ごとの予実差・リードタイムを月次でトラッキング",
    metrics: ["工程別予実", "リードタイム", "歩留り推移"],
    hasPreview: true,
  },
};

const FALLBACK_ORDER = [
  "sales",
  "marketing",
  "executive",
  "ops",
  "production",
] as const;
const FALLBACK_MATCH: Record<string, number> = {
  sales: 96,
  marketing: 84,
  executive: 79,
  ops: 73,
  production: 68,
};

/** トップマッチがこれ未満なら「明確なカテゴリ判定なし」とみなしてフォールバック */
const MATCH_THRESHOLD = 78;

type DisplayCandidate = {
  slug: string;
  match: number;
  reasoning?: string;
  /** このセッションで無料閲覧できる候補かどうか (動的) */
  free: boolean;
} & CandidateMetaBase;

type BuildResult = {
  candidates: DisplayCandidate[];
  /** トップマッチが閾値を下回り、フォールバック (営業サンプル) で表示している場合 true */
  fallback: boolean;
};

function buildDisplay(
  analysis: StoredCurrentAnalysis | null,
  pro: boolean
): BuildResult {
  if (!analysis) {
    // 直接アクセス時はサンプル表示 (Pro なら全解放、未契約なら sales 無料)
    return {
      candidates: FALLBACK_ORDER.map((slug) => ({
        slug,
        ...CANDIDATE_META[slug],
        match: FALLBACK_MATCH[slug],
        free: pro || slug === "sales",
      })),
      fallback: false,
    };
  }

  const apiCandidates = analysis.output.candidates
    .map((c) => {
      const meta = CANDIDATE_META[c.slug];
      if (!meta) return null;
      return {
        slug: c.slug,
        meta,
        match: c.match,
        reasoning: c.reasoning,
        kpis: c.kpis,
      };
    })
    .filter(
      (c): c is NonNullable<typeof c> => c !== null
    );

  if (apiCandidates.length === 0) {
    // API レスポンスが解釈できなかった場合もフォールバック
    return {
      candidates: FALLBACK_ORDER.map((slug) => ({
        slug,
        ...CANDIDATE_META[slug],
        match: FALLBACK_MATCH[slug],
        free: pro || slug === "sales",
      })),
      fallback: true,
    };
  }

  const topMatch = apiCandidates[0].match;
  const fallback = topMatch < MATCH_THRESHOLD;

  // 非Pro:
  //   フォールバック時 → sales を無料 / それ以外 → トップマッチを無料
  // Pro: 全カード解放
  const freeSlug = fallback ? "sales" : apiCandidates[0].slug;

  // フォールバック時は sales を先頭に並べ替え
  const ordered = fallback
    ? [...apiCandidates].sort((a, b) => {
        if (a.slug === "sales") return -1;
        if (b.slug === "sales") return 1;
        return b.match - a.match;
      })
    : apiCandidates;

  return {
    candidates: ordered.map((c) => ({
      slug: c.slug,
      ...c.meta,
      metrics:
        c.kpis && c.kpis.length > 0 ? c.kpis : c.meta.metrics,
      match: c.match,
      reasoning: c.reasoning,
      free: pro ? true : c.slug === freeSlug,
    })),
    fallback,
  };
}

export default function DashboardsPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [analysis, setAnalysis] = useState<StoredCurrentAnalysis | null>(null);
  const [pro, setPro] = useState(false);

  useEffect(() => {
    setAnalysis(getCurrentAnalysis());
    setPro(isPro());

    const totalMs = 2500;
    const interval = totalMs / ANALYZE_STEPS.length;
    const t = setInterval(() => {
      setStep((s) => {
        if (s >= ANALYZE_STEPS.length - 1) {
          clearInterval(t);
          setTimeout(() => setDone(true), 250);
          return s;
        }
        return s + 1;
      });
    }, interval);

    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-12rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-sky-200/50 via-indigo-200/30 to-transparent blur-3xl" />
      </div>

      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <SkweepLogo />
            <span className="text-lg font-semibold tracking-tight">Skweep</span>
          </Link>
          <Link
            href="/upload"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            別のファイルを選ぶ
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-16">
          {!done ? (
            <AnalyzingPanel step={step} filename={analysis?.filename ?? null} />
          ) : (
            <ResultsPanel analysis={analysis} pro={pro} />
          )}
        </div>
      </main>
    </div>
  );
}

function AnalyzingPanel({
  step,
  filename,
}: {
  step: number;
  filename: string | null;
}) {
  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-500 text-white shadow-md">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
        AI がデータを解析しています…
      </h1>
      {filename ? (
        <p className="mt-2 text-sm text-muted-foreground">
          対象: <span className="font-medium text-foreground">{filename}</span>
        </p>
      ) : null}

      <ul className="mt-10 space-y-3 text-left">
        {ANALYZE_STEPS.map((label, i) => {
          const state =
            i < step ? "done" : i === step ? "active" : "pending";
          return (
            <li
              key={label}
              className={cn(
                "flex items-center gap-3 rounded-xl border bg-background px-4 py-3 transition",
                state === "done" && "border-emerald-200 bg-emerald-50/50",
                state === "active" && "border-foreground/30 shadow-sm",
                state === "pending" && "border-border opacity-60"
              )}
            >
              <span
                className={cn(
                  "inline-flex h-7 w-7 items-center justify-center rounded-full",
                  state === "done" && "bg-emerald-500 text-white",
                  state === "active" && "bg-foreground text-background",
                  state === "pending" && "bg-muted text-muted-foreground"
                )}
              >
                {state === "done" ? (
                  <Check className="h-4 w-4" />
                ) : state === "active" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <span className="text-xs font-mono">{i + 1}</span>
                )}
              </span>
              <span
                className={cn(
                  "text-sm",
                  state === "active" && "font-medium",
                  state === "done" && "text-muted-foreground line-through"
                )}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ResultsPanel({
  analysis,
  pro,
}: {
  analysis: StoredCurrentAnalysis | null;
  pro: boolean;
}) {
  const { candidates, fallback } = useMemo(
    () => buildDisplay(analysis, pro),
    [analysis, pro]
  );
  const filename = analysis?.filename ?? null;
  const category = analysis?.output.category ?? null;
  const totalRowCount = analysis?.totalRowCount ?? null;
  const freeCandidate = candidates.find((c) => c.free);

  return (
    <div>
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          STEP 3 / 3 ・ ダッシュボード候補
        </span>
        <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
          {fallback ? (
            <>
              該当する{" "}
              <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                明確なカテゴリ
              </span>
              {" "}は見つかりませんでした
            </>
          ) : (
            <>
              AI は{" "}
              <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                {category ? `「${category}」カテゴリ` : "業務カテゴリ"}
              </span>
              {" "}と判定しました
            </>
          )}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {filename ? (
            <>
              <span className="font-medium text-foreground">{filename}</span>
              {totalRowCount !== null && totalRowCount > 0 ? (
                <span>
                  {" "}
                  (約 {totalRowCount.toLocaleString()} 行)
                </span>
              ) : null}
              {" "}の列構造・統計から最適なビューを推定しています。
            </>
          ) : (
            <>列構造・統計から最適なビューを推定しています。</>
          )}
          {" "}
          {pro ? (
            <>
              <span className="font-medium text-foreground">Pro プラン</span>{" "}
              のためすべてのダッシュボードを閲覧できます。
            </>
          ) : (
            <>
              無料版では{" "}
              <span className="font-medium text-foreground">
                {freeCandidate?.title ?? "営業パイプライン"}
              </span>{" "}
              を閲覧できます。
            </>
          )}
        </p>
      </div>

      {fallback ? <FallbackBanner /> : null}

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {candidates.map((c) => (
          <CandidateCard key={c.slug} candidate={c} pro={pro} />
        ))}
      </div>

      {pro ? null : (
        <div className="mt-14 rounded-2xl border border-border bg-muted/30 p-6 sm:p-7">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-background">
              <LayoutDashboard className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">
                すべてのダッシュボードをアンロックしますか？
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Pro プランで保存・共有 URL・PDF 出力もまとめて利用できます。
              </p>
            </div>
          </div>
          <PricingButton size="sm" plan="annual">
            料金プランを見る
            <ArrowRight className="h-4 w-4" />
          </PricingButton>
        </div>
        </div>
      )}
    </div>
  );
}

function FallbackBanner() {
  return (
    <div className="mx-auto mt-8 flex max-w-3xl items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
      <div className="space-y-1">
        <p className="font-semibold">
          現時点で対応している 5 カテゴリと明確に一致するパターンが見つかりませんでした
        </p>
        <p className="text-amber-900/80">
          サンプルとして
          <span className="mx-1 font-medium">営業パイプライン</span>
          を表示します。あなたのファイルに「商談」「売上」「キャンペーン」「タスク」「工程」などの列名が含まれていると、より精度の高いカテゴリ判定が可能です。
        </p>
      </div>
    </div>
  );
}

function CandidateCard({
  candidate,
  pro,
}: {
  candidate: DisplayCandidate;
  pro: boolean;
}) {
  const Icon = candidate.icon;

  const inner = (
    <>
      {!candidate.free && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-background/40 backdrop-blur-[1px]" />
      )}

      <div className="relative flex items-center justify-between">
        <div
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-lg",
            candidate.free
              ? "bg-foreground text-background"
              : "bg-muted text-foreground"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        {pro ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-2.5 py-1 text-xs font-medium text-white">
            <Sparkles className="h-3 w-3" />
            Pro 解放済み
          </span>
        ) : candidate.free ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
            無料で閲覧
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border">
            <Lock className="h-3 w-3" />
            Pro
          </span>
        )}
      </div>

      <h3 className="relative mt-5 text-base font-semibold">
        {candidate.title}
      </h3>
      <p className="relative mt-1 text-sm leading-relaxed text-muted-foreground">
        {candidate.desc}
      </p>

      <ul className="relative mt-5 space-y-1.5 text-xs text-muted-foreground">
        {candidate.metrics.slice(0, 3).map((m) => (
          <li key={m} className="flex items-center gap-1.5">
            <Check className="h-3 w-3 text-emerald-600" />
            {m}
          </li>
        ))}
      </ul>

      <div className="relative mt-5 flex items-center justify-between border-t border-border pt-4 text-xs">
        <span className="text-muted-foreground">マッチ度</span>
        <span className="font-mono font-semibold">{candidate.match}%</span>
      </div>

      <div className="relative mt-4">
        {candidate.free ? (
          <span
            className={cn(buttonVariants({ size: "sm", className: "w-full" }))}
          >
            閲覧する
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        ) : (
          <PricingButton
            size="sm"
            variant="outline"
            className="w-full"
            context={`${candidate.title} は Pro 限定です。アップグレードしてすべてのダッシュボードをご利用ください。`}
          >
            <Lock className="h-3.5 w-3.5" />
            Pro でアンロック
          </PricingButton>
        )}
        {!candidate.free && candidate.hasPreview ? (
          <Link
            href={`/dashboards/${candidate.slug}`}
            className="relative mt-2 inline-flex w-full items-center justify-center gap-1 text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            プレビューを見る
            <ArrowRight className="h-3 w-3" />
          </Link>
        ) : null}
      </div>
    </>
  );

  const cardClass = cn(
    "relative flex h-full flex-col rounded-2xl border bg-background p-6 transition",
    candidate.free
      ? "border-foreground/20 hover:-translate-y-0.5 hover:shadow-md"
      : "border-border"
  );

  if (candidate.free) {
    return (
      <Link href={`/dashboards/${candidate.slug}`} className={cardClass}>
        {inner}
      </Link>
    );
  }
  return <div className={cardClass}>{inner}</div>;
}
