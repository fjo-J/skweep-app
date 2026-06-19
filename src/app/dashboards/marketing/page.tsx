"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Crown,
  Download,
  Goal,
  Lock,
  Megaphone,
  MousePointerClick,
  Share2,
  Target,
  TrendingDown,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SkweepLogo } from "@/components/skweep-logo";
import { PricingButton } from "@/components/pricing-button";
import { cn } from "@/lib/utils";

const channels = [
  { name: "オーガニック検索", value: 12400, color: "#6366f1" },
  { name: "リスティング広告", value: 8200, color: "#f43f5e" },
  { name: "ディスプレイ広告", value: 5100, color: "#fb923c" },
  { name: "SNS", value: 4200, color: "#0ea5e9" },
  { name: "メール", value: 2150, color: "#10b981" },
  { name: "リファラル", value: 1880, color: "#a78bfa" },
];

const monthlyCvr = [
  { month: "1月", cvr: 1.82, cpa: 6800 },
  { month: "2月", cvr: 1.91, cpa: 6500 },
  { month: "3月", cvr: 2.04, cpa: 6100 },
  { month: "4月", cvr: 1.96, cpa: 6300 },
  { month: "5月", cvr: 2.18, cpa: 5800 },
  { month: "6月", cvr: 2.32, cpa: 5400 },
  { month: "7月", cvr: 2.27, cpa: 5500 },
  { month: "8月", cvr: 2.41, cpa: 5200 },
  { month: "9月", cvr: 2.48, cpa: 5050 },
  { month: "10月", cvr: 2.55, cpa: 4980 },
  { month: "11月", cvr: 2.62, cpa: 4850 },
  { month: "12月", cvr: 2.71, cpa: 4750 },
];
const CVR_TARGET = 2.5;

const campaigns = [
  {
    name: "春の体験キャンペーン",
    cost: 1240000,
    revenue: 5208000,
    roas: 4.2,
    channel: "リスティング広告",
  },
  {
    name: "新生活応援パック",
    cost: 980000,
    revenue: 3724000,
    roas: 3.8,
    channel: "ディスプレイ広告",
  },
  {
    name: "リターゲ強化施策",
    cost: 620000,
    revenue: 2108000,
    roas: 3.4,
    channel: "SNS",
  },
  {
    name: "夏のクーポン施策",
    cost: 740000,
    revenue: 2294000,
    roas: 3.1,
    channel: "メール",
  },
  {
    name: "ブランド認知キャンペーン",
    cost: 1500000,
    revenue: 2850000,
    roas: 1.9,
    channel: "ディスプレイ広告",
  },
];

export default function MarketingDashboardPage() {
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
                  <Megaphone className="h-4 w-4" />
                </span>
                <h1 className="text-2xl font-bold tracking-tight">
                  マーケティング
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-200">
                  <Lock className="h-3 w-3" />
                  Pro 限定プレビュー
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                チャネル別流入・CVR・CPA・ROAS から、効いている施策と止めるべき施策を即時に判断。
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
              icon={<Users className="h-4 w-4" />}
              label="月間流入数"
              value="33,930"
              delta="+8.6%"
              positive
            />
            <Kpi
              icon={<Target className="h-4 w-4" />}
              label="CVR (今月)"
              value="2.71%"
              delta="+0.09pt"
              positive
            />
            <Kpi
              icon={<MousePointerClick className="h-4 w-4" />}
              label="CPA (今月)"
              value="¥4,750"
              delta="−¥100"
              positive
            />
            <Kpi
              icon={<Goal className="h-4 w-4" />}
              label="平均 ROAS"
              value="3.28x"
              delta="−0.2x"
              positive={false}
            />
          </div>

          {/* Charts row 1 */}
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <ChartCard
              title="チャネル別 流入数"
              desc="今月実績 ・ 単位: セッション"
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={channels}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {channels.map((c) => (
                      <Cell key={c.name} fill={c.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v) => Number(v).toLocaleString()}
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

            <ChartCard
              title="月次 CVR / CPA 推移"
              desc={`目標 CVR ${CVR_TARGET}% ・ CPA は右軸 (円)`}
              className="lg:col-span-2"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={monthlyCvr}
                  margin={{ top: 8, right: 16, left: -16, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                    yAxisId="left"
                    domain={[1.5, 3]}
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    unit="%"
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <ReferenceLine
                    yAxisId="left"
                    y={CVR_TARGET}
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    label={{
                      value: `目標 ${CVR_TARGET}%`,
                      position: "insideTopRight",
                      fill: "#64748b",
                      fontSize: 11,
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="cvr"
                    name="CVR (%)"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    dot={{ r: 4, strokeWidth: 0, fill: "#6366f1" }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="cpa"
                    name="CPA (円)"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 3, strokeWidth: 0, fill: "#f43f5e" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Campaigns ROAS */}
          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <ChartCard
              title="キャンペーン別 ROAS"
              desc="緑: 黒字 (ROAS > 2x) / 赤: 要見直し (ROAS < 2x)"
              className="lg:col-span-2"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[...campaigns].sort((a, b) => b.roas - a.roas)}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                  barCategoryGap={12}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    unit="x"
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={160}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v) => `${Number(v).toFixed(1)}x`}
                  />
                  <Bar dataKey="roas" radius={[0, 6, 6, 0]}>
                    {campaigns.map((c) => (
                      <Cell
                        key={c.name}
                        fill={
                          c.roas >= 4
                            ? "#10b981"
                            : c.roas >= 3
                              ? "#6366f1"
                              : c.roas >= 2
                                ? "#f59e0b"
                                : "#ef4444"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="キャンペーン明細" desc="費用 / 売上 / ROAS">
              <ul className="divide-y divide-border text-sm">
                {[...campaigns]
                  .sort((a, b) => b.roas - a.roas)
                  .map((c) => (
                    <li
                      key={c.name}
                      className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <span
                        className={cn(
                          "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-mono font-semibold",
                          c.roas >= 4
                            ? "bg-emerald-100 text-emerald-700"
                            : c.roas >= 3
                              ? "bg-indigo-100 text-indigo-700"
                              : c.roas >= 2
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                        )}
                      >
                        {c.roas.toFixed(1)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium" title={c.name}>
                          {c.name}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {c.channel}
                        </p>
                        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                          ¥{(c.cost / 10000).toFixed(0)}万 → ¥
                          {(c.revenue / 10000).toFixed(0)}万
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            </ChartCard>
          </div>

          {/* Insight */}
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-600 text-white">
                <TrendingDown className="h-4 w-4" />
              </span>
              <div className="space-y-1 text-sm leading-relaxed text-rose-900">
                <p className="font-semibold">AI からのアラート</p>
                <p>
                  <span className="font-medium">ブランド認知キャンペーン</span>{" "}
                  の ROAS が 1.9x と損益分岐点を下回っています。
                  クリエイティブ最適化または予算配分の見直しを推奨します。
                  対して <span className="font-medium">春の体験キャンペーン</span>{" "}
                  は ROAS 4.2x と高効率。予算増額の余地があります。
                </p>
              </div>
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
                    広告データを毎月アップロードするだけで、自動レポート化
                  </p>
                  <p className="mt-1 text-sm text-background/70">
                    Pro なら GA4 / 広告管理画面の CSV を取り込むたびに、このダッシュボードが自動更新されます。
                  </p>
                </div>
              </div>
              <PricingButton
                plan="annual"
                variant="secondary"
                size="lg"
                context="マーケティングをはじめ、全 5 種のダッシュボードと自動更新が利用できます。"
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
        {delta} <span className="text-muted-foreground">前月比</span>
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

