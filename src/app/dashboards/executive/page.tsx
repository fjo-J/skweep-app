"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  Crown,
  Download,
  Lock,
  PieChart as PieIcon,
  Share2,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { buttonVariants } from "@/components/ui/button";
import { SkweepLogo } from "@/components/skweep-logo";
import { PricingButton } from "@/components/pricing-button";
import { cn } from "@/lib/utils";

const monthlyData = [
  { month: "1月", 売上: 42, 前年: 36, yoy: 16 },
  { month: "2月", 売上: 48, 前年: 41, yoy: 17 },
  { month: "3月", 売上: 57, 前年: 49, yoy: 16 },
  { month: "4月", 売上: 51, 前年: 47, yoy: 9 },
  { month: "5月", 売上: 63, 前年: 52, yoy: 21 },
  { month: "6月", 売上: 70, 前年: 56, yoy: 25 },
  { month: "7月", 売上: 66, 前年: 60, yoy: 10 },
  { month: "8月", 売上: 78, 前年: 64, yoy: 22 },
  { month: "9月", 売上: 81, 前年: 71, yoy: 14 },
  { month: "10月", 売上: 88, 前年: 74, yoy: 19 },
  { month: "11月", 売上: 92, 前年: 79, yoy: 16 },
  { month: "12月", 売上: 104, 前年: 88, yoy: 18 },
];

const segments = [
  { name: "BtoB SaaS", value: 412, color: "#6366f1" },
  { name: "プロフェッショナル", value: 248, color: "#8b5cf6" },
  { name: "教育・研修", value: 162, color: "#0ea5e9" },
  { name: "海外事業", value: 121, color: "#22d3ee" },
  { name: "その他", value: 57, color: "#94a3b8" },
];

const departments = [
  { name: "セールス事業部", revenue: 412, cost: 274, profit: 138, margin: 33.5 },
  { name: "カスタマーサクセス", revenue: 248, cost: 162, profit: 86, margin: 34.7 },
  { name: "プロダクト", revenue: 162, cost: 118, profit: 44, margin: 27.2 },
  { name: "マーケティング", revenue: 121, cost: 92, profit: 29, margin: 24.0 },
  { name: "コーポレート", revenue: 57, cost: 51, profit: 6, margin: 10.5 },
  { name: "海外", revenue: 121, cost: 96, profit: 25, margin: 20.7 },
];

export default function ExecutiveDashboardPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <SkweepLogo />
            <span className="text-lg font-semibold tracking-tight">Skweep</span>
          </Link>
          <Link
            href="/dashboards"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            候補一覧へ戻る
          </Link>
        </div>
      </header>

      <ProPreviewBanner />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Title row */}
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background">
                  <Briefcase className="h-4 w-4" />
                </span>
                <h1 className="text-2xl font-bold tracking-tight">
                  経営サマリー
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-200">
                  <Lock className="h-3 w-3" />
                  Pro 限定プレビュー
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                売上・利益・成長率を 1 枚に集約。事業ポートフォリオと部門別 P/L の鳥瞰ビュー。
              </p>
            </div>
            <div className="flex items-center gap-2">
              <LockedAction label="保存" icon={<Crown className="h-3.5 w-3.5" />} />
              <LockedAction label="共有 URL" icon={<Share2 className="h-3.5 w-3.5" />} />
              <LockedAction label="PDF 出力" icon={<Download className="h-3.5 w-3.5" />} />
            </div>
          </div>

          {/* KPI cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi
              icon={<TrendingUp className="h-4 w-4" />}
              label="売上 YoY"
              value="+17.2%"
              delta="目標 +15%"
              positive
            />
            <Kpi
              icon={<PieIcon className="h-4 w-4" />}
              label="粗利益率"
              value="42.8%"
              delta="+1.6pt"
              positive
            />
            <Kpi
              icon={<Sparkles className="h-4 w-4" />}
              label="EBITDA"
              value="¥248M"
              delta="+12.4%"
              positive
            />
            <Kpi
              icon={<Wallet className="h-4 w-4" />}
              label="キャッシュ残高"
              value="¥1.42B"
              delta="−4.2%"
              positive={false}
            />
          </div>

          {/* Charts row 1 */}
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <ChartCard
              title="月次売上 vs 前年同月"
              desc="単位: 百万円 ・ 折れ線は YoY 成長率 (%)"
              className="lg:col-span-2"
            >
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart
                  data={monthlyData}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    unit="%"
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar yAxisId="left" dataKey="前年" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="left" dataKey="売上" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="yoy"
                    name="YoY (%)"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 4, strokeWidth: 0, fill: "#10b981" }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="事業セグメント別売上構成" desc="今期累計">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={segments}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {segments.map((s) => (
                      <Cell key={s.name} fill={s.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v) => `¥${Number(v)}M`}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 11 }}
                    iconSize={8}
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Department P/L */}
          <div className="mt-5 rounded-2xl border border-border bg-background p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">部門別 P/L</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  単位: 百万円 ・ 利益率 (Margin) で降順
                </p>
              </div>
              <span className="text-xs text-muted-foreground">直近四半期</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">部門</th>
                    <th className="py-2 px-4 text-right font-medium">売上</th>
                    <th className="py-2 px-4 text-right font-medium">コスト</th>
                    <th className="py-2 px-4 text-right font-medium">利益</th>
                    <th className="py-2 pl-4 text-right font-medium">利益率</th>
                  </tr>
                </thead>
                <tbody>
                  {[...departments]
                    .sort((a, b) => b.margin - a.margin)
                    .map((d) => (
                      <tr
                        key={d.name}
                        className="border-b border-border last:border-0"
                      >
                        <td className="py-3 pr-4 font-medium">{d.name}</td>
                        <td className="py-3 px-4 text-right font-mono">
                          ¥{d.revenue}M
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-muted-foreground">
                          ¥{d.cost}M
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold">
                          ¥{d.profit}M
                        </td>
                        <td className="py-3 pl-4 text-right">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-mono font-semibold",
                              d.margin >= 30
                                ? "bg-emerald-50 text-emerald-700"
                                : d.margin >= 20
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-red-50 text-red-700"
                            )}
                          >
                            {d.margin >= 25 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {d.margin.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upgrade CTA */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-foreground bg-foreground text-background">
            <div className="flex flex-col items-start justify-between gap-5 p-7 sm:flex-row sm:items-center sm:p-8">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 text-white">
                  <Crown className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-base font-semibold">
                    Pro で全ダッシュボードと保存・共有を解放
                  </p>
                  <p className="mt-1 text-sm text-background/70">
                    プレビューはここまで。Pro なら毎月新しいデータで自動更新できます。
                  </p>
                </div>
              </div>
              <PricingButton
                plan="annual"
                variant="secondary"
                size="lg"
                context="経営サマリーをはじめ、全 4 種のダッシュボードと保存・共有・PDF が利用できます。"
              >
                Pro にアップグレード
                <ArrowUpRight className="h-4 w-4" />
              </PricingButton>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ProPreviewBanner() {
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

const tooltipStyle: React.CSSProperties = {
  borderRadius: 8,
  border: "1px solid rgba(0,0,0,0.08)",
  fontSize: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
};

function Kpi({
  icon,
  label,
  value,
  delta,
  positive,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: string;
  positive: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-muted">
          {icon}
        </span>
        {label}
      </div>
      <div className="mt-3 text-2xl font-bold tracking-tight">{value}</div>
      <div
        className={cn(
          "mt-1 text-xs font-medium",
          positive ? "text-emerald-600" : "text-destructive"
        )}
      >
        {delta} <span className="text-muted-foreground">前期比</span>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  desc,
  className,
  children,
}: {
  title: string;
  desc?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-background p-5 sm:p-6",
        className
      )}
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        {desc ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function LockedAction({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <PricingButton
      plan="monthly"
      variant="outline"
      size="sm"
      className="text-xs"
      context={`「${label}」は Pro 限定機能です。`}
    >
      <Lock className="h-3 w-3" />
      {icon}
      {label}
    </PricingButton>
  );
}
