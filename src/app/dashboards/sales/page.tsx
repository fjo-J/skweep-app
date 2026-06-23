"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Crown,
  Download,
  Lock,
  Share2,
  TrendingUp,
  Users,
  Target,
  Wallet,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { buttonVariants } from "@/components/ui/button";
import { SkweepLogo } from "@/components/skweep-logo";
import { PricingButton } from "@/components/pricing-button";
import { SaveToWorkspaceButton } from "@/components/save-to-workspace-button";
import { ProUpgradeCta } from "@/components/pro-upgrade-cta";
import { cn } from "@/lib/utils";

const stageData = [
  { stage: "リード", count: 184 },
  { stage: "アポ獲得", count: 96 },
  { stage: "商談中", count: 58 },
  { stage: "提案", count: 32 },
  { stage: "クロージング", count: 19 },
  { stage: "受注", count: 11 },
];

const STAGE_COLORS = [
  "#bae6fd",
  "#7dd3fc",
  "#60a5fa",
  "#6366f1",
  "#7c3aed",
  "#0f172a",
];

const monthlyData = [
  { month: "1月", 受注: 7, 失注: 4 },
  { month: "2月", 受注: 9, 失注: 5 },
  { month: "3月", 受注: 12, 失注: 6 },
  { month: "4月", 受注: 10, 失注: 5 },
  { month: "5月", 受注: 14, 失注: 7 },
  { month: "6月", 受注: 17, 失注: 6 },
  { month: "7月", 受注: 15, 失注: 8 },
  { month: "8月", 受注: 19, 失注: 7 },
];

const reps = [
  { name: "田中", deals: 14, amount: "¥18.2M", win: 0.46 },
  { name: "佐藤", deals: 11, amount: "¥14.5M", win: 0.41 },
  { name: "鈴木", deals: 9, amount: "¥11.0M", win: 0.38 },
  { name: "高橋", deals: 7, amount: "¥8.7M", win: 0.32 },
  { name: "伊藤", deals: 6, amount: "¥7.1M", win: 0.28 },
];

export default function SalesDashboardPage() {
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

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-10">
          {/* Title row */}
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background">
                  <TrendingUp className="h-4 w-4" />
                </span>
                <h1 className="text-2xl font-bold tracking-tight">
                  営業パイプライン
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                  無料で閲覧中
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                AI が自動生成したサンプルダッシュボードです。Pro なら保存・共有 URL・PDF 出力が可能。
              </p>
            </div>
            <div className="flex items-center gap-2">
              <SaveToWorkspaceButton dashboardSlug="sales" />
              <LockedAction label="共有 URL" icon={<Share2 className="h-3.5 w-3.5" />} />
              <LockedAction label="PDF 出力" icon={<Download className="h-3.5 w-3.5" />} />
            </div>
          </div>

          {/* KPI cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi
              icon={<Users className="h-4 w-4" />}
              label="アクティブリード数"
              value="184"
              delta="+12.4%"
              positive
            />
            <Kpi
              icon={<Target className="h-4 w-4" />}
              label="受注率"
              value="38.2%"
              delta="+2.1pt"
              positive
            />
            <Kpi
              icon={<Wallet className="h-4 w-4" />}
              label="平均商談額"
              value="¥1.28M"
              delta="+5.7%"
              positive
            />
            <Kpi
              icon={<TrendingUp className="h-4 w-4" />}
              label="パイプライン総額"
              value="¥74.5M"
              delta="−3.0%"
              positive={false}
            />
          </div>

          {/* Charts */}
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <ChartCard title="ステージ別商談数" desc="現在パイプラインに乗っている案件" className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={stageData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis dataKey="stage" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} contentStyle={tooltipStyle} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {stageData.map((_, i) => (
                      <Cell key={i} fill={STAGE_COLORS[i % STAGE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="今月の進捗" desc="目標達成度">
              <div className="flex h-[280px] flex-col justify-center">
                <Progress label="受注件数" value={17} max={22} unit="件" />
                <Progress label="商談数" value={58} max={70} unit="件" />
                <Progress label="売上金額" value={2180} max={3000} unit="万円" />
              </div>
            </ChartCard>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <ChartCard title="月次の受注 / 失注推移" desc="直近 8 ヶ月" className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={monthlyData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="受注"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    dot={{ r: 4, strokeWidth: 0, fill: "#6366f1" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="失注"
                    stroke="#f87171"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 3, strokeWidth: 0, fill: "#f87171" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="担当者別ランキング" desc="受注件数 TOP5">
              <ul className="divide-y divide-border">
                {reps.map((r, i) => (
                  <li key={r.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-mono">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.deals} 件 ・ {r.amount}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-semibold">
                      {Math.round(r.win * 100)}%
                    </span>
                  </li>
                ))}
              </ul>
            </ChartCard>
          </div>

          {/* Upgrade CTA (Pro 契約済みなら非表示) */}
          <ProUpgradeCta
            title="残り 4 種類のダッシュボードと、保存 / 共有 / PDF を解放"
            description="Pro プランは月額 ¥1,500・年額 ¥15,000。いつでもキャンセル可能。"
            context="保存・共有 URL・PDF 出力と、残り 4 種類のダッシュボードがアンロックされます。"
          />
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

function Progress({
  label,
  value,
  max,
  unit,
}: {
  label: string;
  value: number;
  max: number;
  unit: string;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-mono text-xs text-muted-foreground">
          <span className="text-foreground font-semibold">{value.toLocaleString()}</span>{" "}
          / {max.toLocaleString()} {unit}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 transition-[width] duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
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
