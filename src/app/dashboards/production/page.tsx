"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Crown,
  Download,
  Factory,
  Gauge,
  Lock,
  Share2,
  Timer,
  TrendingUp,
  Wrench,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SkweepLogo } from "@/components/skweep-logo";
import { PricingButton } from "@/components/pricing-button";
import { SaveToWorkspaceButton } from "@/components/save-to-workspace-button";
import { ProPreviewBanner } from "@/components/pro-preview-banner";
import { cn } from "@/lib/utils";

const planActual = [
  { process: "投入", 予定: 1200, 実績: 1180 },
  { process: "成形", 予定: 1180, 実績: 1142 },
  { process: "切削", 予定: 1140, 実績: 1098 },
  { process: "塗装", 予定: 1090, 実績: 1024 },
  { process: "組立", 予定: 1020, 実績: 982 },
  { process: "検査", 予定: 980, 実績: 956 },
  { process: "梱包", 予定: 950, 実績: 942 },
];

const yieldTrend = [
  { month: "1月", yield: 93.2 },
  { month: "2月", yield: 94.1 },
  { month: "3月", yield: 92.8 },
  { month: "4月", yield: 94.7 },
  { month: "5月", yield: 95.4 },
  { month: "6月", yield: 95.8 },
  { month: "7月", yield: 94.2 },
  { month: "8月", yield: 95.1 },
  { month: "9月", yield: 96.2 },
  { month: "10月", yield: 95.8 },
  { month: "11月", yield: 96.4 },
  { month: "12月", yield: 95.9 },
];
const YIELD_TARGET = 95;

const bottleneck = [
  { process: "塗装", 処理時間: 6.2, 待ち時間: 4.8 },
  { process: "検査", 処理時間: 3.4, 待ち時間: 5.6 },
  { process: "組立", 処理時間: 5.7, 待ち時間: 3.2 },
  { process: "切削", 処理時間: 4.2, 待ち時間: 2.8 },
  { process: "成形", 処理時間: 3.1, 待ち時間: 2.4 },
  { process: "梱包", 処理時間: 1.8, 待ち時間: 1.2 },
];

const yieldBreakdown = [
  { process: "投入", 良品: 99.4, 軽微不良: 0.5, 重大不良: 0.1 },
  { process: "成形", 良品: 96.8, 軽微不良: 2.6, 重大不良: 0.6 },
  { process: "切削", 良品: 95.2, 軽微不良: 3.8, 重大不良: 1.0 },
  { process: "塗装", 良品: 92.1, 軽微不良: 5.4, 重大不良: 2.5 },
  { process: "組立", 良品: 96.4, 軽微不良: 2.8, 重大不良: 0.8 },
  { process: "検査", 良品: 97.5, 軽微不良: 2.1, 重大不良: 0.4 },
  { process: "梱包", 良品: 99.1, 軽微不良: 0.8, 重大不良: 0.1 },
];

export default function ProductionDashboardPage() {
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
                  <Factory className="h-4 w-4" />
                </span>
                <h1 className="text-2xl font-bold tracking-tight">
                  生産管理ボード
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-200">
                  <Lock className="h-3 w-3" />
                  Pro 限定プレビュー
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                工程別の予実差・歩留り・リードタイムを月次でトラッキング。ボトルネック工程を即座に特定します。
              </p>
            </div>
            <div className="flex items-center gap-2">
              <SaveToWorkspaceButton dashboardSlug="production" />
              <LockedAction label="共有 URL" icon={<Share2 className="h-3.5 w-3.5" />} />
              <LockedAction label="PDF 出力" icon={<Download className="h-3.5 w-3.5" />} />
            </div>
          </div>

          {/* KPI cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi
              icon={<Gauge className="h-4 w-4" />}
              label="計画達成率"
              value="96.2%"
              delta="+1.8pt"
              positive
            />
            <Kpi
              icon={<TrendingUp className="h-4 w-4" />}
              label="平均歩留り"
              value="95.4%"
              delta="+0.6pt"
              positive
            />
            <Kpi
              icon={<Timer className="h-4 w-4" />}
              label="平均リードタイム"
              value="22.4h"
              delta="−1.8h"
              positive
            />
            <Kpi
              icon={<AlertTriangle className="h-4 w-4" />}
              label="不良率"
              value="3.8%"
              delta="+0.4pt"
              positive={false}
            />
          </div>

          {/* Charts row 1 */}
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <ChartCard
              title="工程別 予実比較"
              desc="単位: 個 ・ 達成率に応じてバーの色が変化"
              className="lg:col-span-2"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={planActual}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                  barGap={4}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis dataKey="process" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="予定" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="実績" radius={[4, 4, 0, 0]}>
                    {planActual.map((d) => {
                      const rate = (d.実績 / d.予定) * 100;
                      const color =
                        rate >= 98
                          ? "#10b981"
                          : rate >= 95
                            ? "#6366f1"
                            : rate >= 92
                              ? "#f59e0b"
                              : "#ef4444";
                      return <Cell key={d.process} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                <Legend2 color="#10b981" label="達成 98%+" />
                <Legend2 color="#6366f1" label="95-98%" />
                <Legend2 color="#f59e0b" label="92-95%" />
                <Legend2 color="#ef4444" label="未達 <92%" />
              </div>
            </ChartCard>

            <ChartCard
              title="月次 歩留り推移"
              desc={`目標 ${YIELD_TARGET}% ライン・赤マーカーは未達月`}
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={yieldTrend}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                    domain={[90, 100]}
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    unit="%"
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v) => `${Number(v).toFixed(1)}%`}
                  />
                  <ReferenceLine
                    y={YIELD_TARGET}
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    label={{
                      value: `目標 ${YIELD_TARGET}%`,
                      position: "insideTopRight",
                      fill: "#64748b",
                      fontSize: 11,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="yield"
                    name="歩留り (%)"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    dot={(props) => {
                      const { cx, cy, payload, index } = props as {
                        cx?: number;
                        cy?: number;
                        payload?: { yield: number };
                        index?: number;
                      };
                      const isBad =
                        payload && payload.yield < YIELD_TARGET;
                      const r = isBad ? 6 : 4;
                      const fill = isBad ? "#ef4444" : "#6366f1";
                      return (
                        <circle
                          key={`yield-dot-${index ?? 0}`}
                          cx={cx}
                          cy={cy}
                          r={r}
                          fill={fill}
                          stroke="white"
                          strokeWidth={1.5}
                        />
                      );
                    }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Charts row 2 */}
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <ChartCard
              title="ボトルネック分析"
              desc="工程ごとの「処理時間」vs「待ち時間」(h)・待ち時間が長い工程ほど要改善"
            >
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={[...bottleneck].sort(
                    (a, b) =>
                      b.処理時間 + b.待ち時間 - (a.処理時間 + a.待ち時間)
                  )}
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
                    unit="h"
                  />
                  <YAxis
                    type="category"
                    dataKey="process"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={70}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v) => `${Number(v).toFixed(1)}h`}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar
                    dataKey="処理時間"
                    stackId="time"
                    fill="#6366f1"
                  />
                  <Bar
                    dataKey="待ち時間"
                    stackId="time"
                    fill="#fb923c"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">塗装</span>{" "}
                工程のリードタイムが最大 (11.0h)。<span className="font-semibold text-foreground">検査</span>{" "}
                は待ち時間 (5.6h) が処理時間より長く、上流からの滞留が示唆されます。
              </p>
            </ChartCard>

            <ChartCard
              title="工程別 歩留り内訳"
              desc="良品 / 軽微不良 / 重大不良 の構成比"
            >
              <ul className="space-y-4">
                {yieldBreakdown.map((row) => (
                  <li key={row.process}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{row.process}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        歩留り{" "}
                        <span
                          className={cn(
                            "font-semibold",
                            row.良品 >= 95
                              ? "text-emerald-600"
                              : row.良品 >= 92
                                ? "text-amber-600"
                                : "text-red-600"
                          )}
                        >
                          {row.良品.toFixed(1)}%
                        </span>
                      </span>
                    </div>
                    <div
                      className="mt-1.5 flex h-2.5 w-full overflow-hidden rounded-full bg-muted"
                      title={`${row.process}: 良品 ${row.良品}% / 軽微 ${row.軽微不良}% / 重大 ${row.重大不良}%`}
                    >
                      <span
                        className="h-full bg-emerald-500"
                        style={{ width: `${row.良品}%` }}
                      />
                      <span
                        className="h-full bg-amber-400"
                        style={{ width: `${row.軽微不良}%` }}
                      />
                      <span
                        className="h-full bg-red-500"
                        style={{ width: `${row.重大不良}%` }}
                      />
                    </div>
                    <div className="mt-1 flex justify-end gap-3 text-[11px] text-muted-foreground">
                      <span>軽微 {row.軽微不良.toFixed(1)}%</span>
                      <span className="text-red-600">
                        重大 {row.重大不良.toFixed(1)}%
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4 text-[11px] text-muted-foreground">
                <Legend2 color="#10b981" label="良品" />
                <Legend2 color="#facc15" label="軽微不良" />
                <Legend2 color="#ef4444" label="重大不良" />
              </div>
            </ChartCard>
          </div>

          {/* Insight callout */}
          <div className="mt-5 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Wrench className="h-4 w-4" />
              </span>
              <div className="space-y-1 text-sm leading-relaxed text-indigo-900">
                <p className="font-semibold">AI からの改善提案</p>
                <p>
                  <span className="font-medium">塗装</span> 工程の重大不良率 (2.5%) が他工程と比べて顕著に高く、平均歩留り 95.4% を押し下げる主要因です。塗装ブースの温湿度制御と前処理の改善で、月間 +0.8pt の歩留り改善が見込めます。
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
                    歩留り改善の意思決定を、データで毎月。
                  </p>
                  <p className="mt-1 text-sm text-background/70">
                    Pro なら工程ログをアップロードするたびに、ボトルネックと改善提案が自動更新されます。
                  </p>
                </div>
              </div>
              <PricingButton
                plan="annual"
                variant="secondary"
                size="lg"
                context="生産管理ボードをはじめ、全 4 種のダッシュボードと AI 改善提案が利用できます。"
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

function Legend2({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        aria-hidden
        className="inline-block h-2.5 w-2.5 rounded-sm"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
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
