"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Crown,
  Download,
  Factory,
  Lock,
  Share2,
  Timer,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SkweepLogo } from "@/components/skweep-logo";
import { PricingButton } from "@/components/pricing-button";
import { cn } from "@/lib/utils";

const STATUS_COLORS = {
  完了: "#10b981",
  対応中: "#6366f1",
  未着手: "#94a3b8",
  遅延: "#f97316",
} as const;

const statusByTeam = [
  { team: "サポート", 完了: 58, 対応中: 22, 未着手: 12, 遅延: 6 },
  { team: "オンボーディング", 完了: 41, 対応中: 18, 未着手: 9, 遅延: 3 },
  { team: "テクニカル", 完了: 34, 対応中: 26, 未着手: 14, 遅延: 8 },
  { team: "営業支援", 完了: 47, 対応中: 14, 未着手: 7, 遅延: 2 },
  { team: "コーポレート", 完了: 28, 対応中: 9, 未着手: 4, 遅延: 1 },
];

const dailyCompletion = [
  { day: "5/22", 完了: 78, 新規: 82 },
  { day: "5/23", 完了: 85, 新規: 79 },
  { day: "5/24", 完了: 72, 新規: 88 },
  { day: "5/25", 完了: 91, 新規: 84 },
  { day: "5/26", 完了: 88, 新規: 92 },
  { day: "5/27", 完了: 96, 新規: 89 },
  { day: "5/28", 完了: 102, 新規: 95 },
  { day: "5/29", 完了: 98, 新規: 101 },
  { day: "5/30", 完了: 110, 新規: 97 },
  { day: "5/31", 完了: 104, 新規: 108 },
  { day: "6/01", 完了: 118, 新規: 105 },
  { day: "6/02", 完了: 124, 新規: 112 },
  { day: "6/03", 完了: 131, 新規: 119 },
  { day: "6/04", 完了: 128, 新規: 124 },
];

const memberUtilization = [
  { name: "田中", utilization: 92, role: "リード" },
  { name: "佐藤", utilization: 88, role: "メンバー" },
  { name: "鈴木", utilization: 81, role: "メンバー" },
  { name: "高橋", utilization: 76, role: "メンバー" },
  { name: "伊藤", utilization: 71, role: "メンバー" },
  { name: "渡辺", utilization: 64, role: "新人" },
  { name: "山本", utilization: 58, role: "メンバー" },
  { name: "中村", utilization: 47, role: "新人" },
];

const slaAlerts = [
  { team: "テクニカル", ticket: "#3421", remaining: "残り 1h 12m", level: "high" },
  { team: "サポート", ticket: "#3398", remaining: "残り 3h 04m", level: "medium" },
  { team: "オンボーディング", ticket: "#3402", remaining: "残り 5h 22m", level: "medium" },
  { team: "サポート", ticket: "#3415", remaining: "残り 7h 41m", level: "low" },
];

export default function OpsDashboardPage() {
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
                  現場オペレーション
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-200">
                  <Lock className="h-3 w-3" />
                  Pro 限定プレビュー
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                日次の稼働状況・タスク進捗・SLA を一目で把握。ボトルネックを早期発見します。
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
              icon={<Activity className="h-4 w-4" />}
              label="稼働率"
              value="78.4%"
              delta="+3.2pt"
              positive
            />
            <Kpi
              icon={<Timer className="h-4 w-4" />}
              label="平均対応時間"
              value="2h 42m"
              delta="−18m"
              positive
            />
            <Kpi
              icon={<AlertTriangle className="h-4 w-4" />}
              label="未対応タスク"
              value="46"
              delta="+8"
              positive={false}
            />
            <Kpi
              icon={<CheckCircle2 className="h-4 w-4" />}
              label="SLA 達成率"
              value="94.1%"
              delta="+1.4pt"
              positive
            />
          </div>

          {/* Charts row 1 */}
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <ChartCard
              title="チーム別タスクステータス"
              desc="積み上げ・件数"
              className="lg:col-span-2"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={statusByTeam}
                  layout="vertical"
                  margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                  barCategoryGap={14}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="team"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={100}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} iconSize={9} />
                  <Bar dataKey="完了" stackId="a" fill={STATUS_COLORS["完了"]} />
                  <Bar dataKey="対応中" stackId="a" fill={STATUS_COLORS["対応中"]} />
                  <Bar dataKey="未着手" stackId="a" fill={STATUS_COLORS["未着手"]} />
                  <Bar
                    dataKey="遅延"
                    stackId="a"
                    fill={STATUS_COLORS["遅延"]}
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="SLA リスクの高いタスク"
              desc="期限まで残り 8h 未満"
            >
              <ul className="divide-y divide-border">
                {slaAlerts.map((a) => (
                  <li
                    key={a.ticket}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <span
                      className={cn(
                        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        a.level === "high"
                          ? "bg-red-100 text-red-600"
                          : a.level === "medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-sky-100 text-sky-700"
                      )}
                    >
                      <Clock className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {a.ticket}{" "}
                        <span className="text-xs text-muted-foreground">
                          ・ {a.team}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {a.remaining}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        a.level === "high"
                          ? "bg-red-50 text-red-700"
                          : a.level === "medium"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-sky-50 text-sky-700"
                      )}
                    >
                      {a.level === "high"
                        ? "緊急"
                        : a.level === "medium"
                          ? "注意"
                          : "監視"}
                    </span>
                  </li>
                ))}
              </ul>
            </ChartCard>
          </div>

          {/* Charts row 2 */}
          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <ChartCard
              title="日次タスク完了数 (直近 14 日)"
              desc="完了 と 新規受付 の推移"
              className="lg:col-span-2"
            >
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart
                  data={dailyCompletion}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="opsCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="opsNew" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area
                    type="monotone"
                    dataKey="新規"
                    stroke="#94a3b8"
                    strokeWidth={1.5}
                    fill="url(#opsNew)"
                  />
                  <Area
                    type="monotone"
                    dataKey="完了"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fill="url(#opsCompleted)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="担当者別 稼働率" desc="今週">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={memberUtilization}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                  barSize={18}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                    unit="%"
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v) => `${Number(v)}%`}
                  />
                  <Bar dataKey="utilization" radius={[6, 6, 0, 0]}>
                    {memberUtilization.map((m) => (
                      <Cell
                        key={m.name}
                        fill={
                          m.utilization >= 85
                            ? "#10b981"
                            : m.utilization >= 70
                              ? "#6366f1"
                              : m.utilization >= 55
                                ? "#f59e0b"
                                : "#94a3b8"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Team mini summary */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "サポート", users: 12, util: 82, sla: 96, tone: "good" },
              { label: "テクニカル", users: 8, util: 91, sla: 88, tone: "warn" },
              { label: "オンボーディング", users: 6, util: 74, sla: 97, tone: "good" },
              { label: "営業支援", users: 5, util: 67, sla: 93, tone: "good" },
            ].map((t) => (
              <div
                key={t.label}
                className="rounded-xl border border-border bg-background p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{t.label}</span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    {t.users}
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      稼働率
                    </p>
                    <p className="text-lg font-bold">{t.util}%</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      SLA
                    </p>
                    <p
                      className={cn(
                        "text-lg font-bold",
                        t.tone === "warn" ? "text-amber-600" : "text-emerald-600"
                      )}
                    >
                      {t.sla}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
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
                    現場の数字を、毎朝自動でアップデート
                  </p>
                  <p className="mt-1 text-sm text-background/70">
                    Pro なら新規ファイルアップロードごとに、このダッシュボードが自動で再生成されます。
                  </p>
                </div>
              </div>
              <PricingButton
                plan="annual"
                variant="secondary"
                size="lg"
                context="現場オペレーションをはじめ、全 4 種のダッシュボードと自動更新が利用できます。"
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
        {delta} <span className="text-muted-foreground">前週比</span>
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
