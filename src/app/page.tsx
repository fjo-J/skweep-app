import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PricingButton } from "@/components/pricing-button";
import { cn } from "@/lib/utils";
import { COMPANY } from "@/lib/company";
import {
  ArrowRight,
  Upload,
  Sparkles,
  LayoutDashboard,
  Check,
  Lock,
  ShieldCheck,
  TrendingUp,
  Briefcase,
  Factory,
  LineChart,
} from "lucide-react";

const dashboardCandidates = [
  {
    icon: TrendingUp,
    title: "営業パイプライン",
    desc: "リード数 / 受注率 / 商談ステージを可視化。無料版でも閲覧可能。",
    free: true,
  },
  {
    icon: Briefcase,
    title: "経営サマリー",
    desc: "売上・利益・成長率の経営 KPI を 1 枚に集約。",
    free: false,
  },
  {
    icon: Factory,
    title: "現場オペレーション",
    desc: "稼働率・タスク進捗・ボトルネックを現場ビューで把握。",
    free: false,
  },
  {
    icon: LineChart,
    title: "生産管理ボード",
    desc: "工程ごとの予実差・リードタイムを月次でトラッキング。",
    free: false,
  },
];

const freeFeatures = [
  "Excel / CSV アップロード",
  "AI によるデータ解析",
  "業務カテゴリ自動判定",
  "KPI 候補の提案",
  "ダッシュボード候補表示",
  "営業パイプラインの閲覧",
];

const proFeatures = [
  "全ダッシュボードへのフルアクセス",
  "保存 & 再編集",
  "共有 URL の発行",
  "PDF 出力",
  "プロバイダ切替 (OpenAI / Claude / Gemini)",
  "優先サポート",
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-semibold tracking-tight">Skweep</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">
              機能
            </a>
            <a href="#dashboards" className="hover:text-foreground">
              ダッシュボード
            </a>
            <a href="#pricing" className="hover:text-foreground">
              料金
            </a>
          </nav>
          <Link href="/start" className={buttonVariants({ size: "sm" })}>
            無料で解析する
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-10rem] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-sky-200/60 via-indigo-200/40 to-transparent blur-3xl" />
        </div>
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              AI が KPI とダッシュボードを自動提案
            </span>
            <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              アップロードするだけ。
              <br />
              <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                データが意思決定に変わる。
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Skweep は Excel / CSV をアップロードするだけで、AI がデータ構造を理解し、
              営業・マーケティング・経営・現場の各ダッシュボードを自動生成します。
              <br className="hidden sm:block" />
              「集計に時間を奪われる毎日」を、今日で終わらせる。
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/start"
                className={buttonVariants({
                  size: "lg",
                  className: "w-full sm:w-auto",
                })}
              >
                無料で解析する
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
              <a
                href="#pricing"
                className={buttonVariants({
                  size: "lg",
                  variant: "outline",
                  className: "w-full sm:w-auto",
                })}
              >
                料金を見る
              </a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              クレジットカード不要・氏名 / 会社名 / メールアドレスのみで開始
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="features" className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              3 ステップで意思決定の地図ができる
            </h2>
            <p className="mt-4 text-muted-foreground">
              データ整形も BI ツールの学習も要りません。
              アップロードした瞬間から、AI が最適な切り口を提案します。
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Upload,
                step: "01",
                title: "アップロード",
                desc: "Excel・CSV をブラウザにドラッグするだけ。ファイル形式の前処理は不要です。",
              },
              {
                icon: Sparkles,
                step: "02",
                title: "AI が解析",
                desc: "列名・型・統計情報から業務カテゴリと KPI 候補を自動推定。Excel 全体は送信しません。",
              },
              {
                icon: LayoutDashboard,
                step: "03",
                title: "ダッシュボード生成",
                desc: "営業・経営・現場・生産の 4 種から最適なビューを提案。すぐに閲覧できます。",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="group relative rounded-2xl border border-border bg-background p-7 transition hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-foreground text-background">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    {s.step}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard candidates */}
      <section id="dashboards" className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              4 種類のダッシュボードから自動選択
            </h2>
            <p className="mt-4 text-muted-foreground">
              データの中身を AI が理解し、最適なビューを提案します。
              無料版では営業パイプラインを閲覧できます。
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {dashboardCandidates.map((d) => (
              <div
                key={d.title}
                className="relative flex flex-col rounded-2xl border border-border bg-background p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
                    <d.icon className="h-5 w-5" />
                  </div>
                  {d.free ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                      無料で閲覧
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border">
                      <Lock className="h-3 w-3" />
                      有料
                    </span>
                  )}
                </div>
                <h3 className="mt-5 text-base font-semibold">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {d.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plan comparison */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              まずは無料で。続けたくなったら Pro へ。
            </h2>
            <p className="mt-4 text-muted-foreground">
              無料版でも AI 解析からダッシュボード提案まで体験できます。
              本格運用に必要な保存・共有・PDF 出力は Pro でアンロック。
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-8">
              <h3 className="text-lg font-semibold">無料版</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                クレジットカード登録不要
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {freeFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/start"
                className={buttonVariants({
                  variant: "outline",
                  className: "mt-8 w-full",
                })}
              >
                無料で試す
              </Link>
            </div>

            <div className="relative rounded-2xl border border-foreground bg-foreground p-8 text-background shadow-xl">
              <div className="absolute -top-3 left-8 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-3 py-1 text-xs font-semibold text-white">
                <Sparkles className="h-3 w-3" /> Pro
              </div>
              <h3 className="text-lg font-semibold">Pro</h3>
              <p className="mt-1 text-sm text-background/70">
                すべての機能を制限なく利用
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <PricingButton
                variant="secondary"
                className="mt-8 w-full"
                plan="monthly"
              >
                Pro プランを確認する
              </PricingButton>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              料金プラン
            </h2>
            <p className="mt-4 text-muted-foreground">
              個人から企業まで。クレジットカード決済・いつでもキャンセル可能。
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-3">
            {/* 月額プラン */}
            <div className="rounded-2xl border border-border bg-background p-8">
              <div className="text-sm font-medium text-muted-foreground">
                月額プラン
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight">
                  ¥1,500
                </span>
                <span className="text-sm text-muted-foreground">/ 月</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                いつでもキャンセル可能
              </p>
              <ul className="mt-6 space-y-2 text-xs text-muted-foreground">
                <li>✓ 全 4 種のダッシュボード</li>
                <li>✓ 保存・共有 URL・PDF 出力</li>
                <li>✓ クレジットカード決済</li>
              </ul>
              <PricingButton plan="monthly" className="mt-8 w-full">
                月額で始める
              </PricingButton>
            </div>

            {/* 年額プラン */}
            <div className="relative rounded-2xl border-2 border-foreground bg-background p-8">
              <div className="absolute -top-3 right-8 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                2 ヶ月分お得
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                年額プラン
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight">
                  ¥15,000
                </span>
                <span className="text-sm text-muted-foreground">/ 年</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                月額換算 ¥1,250 / 月
              </p>
              <ul className="mt-6 space-y-2 text-xs text-muted-foreground">
                <li>✓ 月額プランのすべて</li>
                <li>✓ 2 ヶ月分お得</li>
                <li>✓ 年単位のレポート出力</li>
              </ul>
              <PricingButton plan="annual" className="mt-8 w-full">
                年額で始める
              </PricingButton>
            </div>

            {/* Business プラン */}
            <div className="relative rounded-2xl border border-border bg-foreground p-8 text-background">
              <div className="absolute -top-3 right-8 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 px-3 py-1 text-xs font-semibold text-white">
                <ShieldCheck className="h-3 w-3" />
                エンタープライズ
              </div>
              <div className="text-sm font-medium text-background/70">
                Business プラン
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">
                  お問い合わせ
                </span>
              </div>
              <p className="mt-2 text-sm text-background/70">
                セキュリティ要件に応じたカスタム提供
              </p>
              <ul className="mt-6 space-y-2 text-xs text-background/80">
                <li>✓ 年額プランのすべて</li>
                <li>✓ DPA (データ処理契約) 締結</li>
                <li>✓ IP 制限 / SSO (SAML)</li>
                <li>✓ 監査ログ・優先サポート</li>
                <li>✓ 専用 AI モデルチャネル</li>
              </ul>
              <a
                href={`mailto:${COMPANY.email}?subject=${encodeURIComponent("Skweep Business プランお問い合わせ")}`}
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "mt-8 w-full"
                )}
              >
                Business を相談する
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            支払いはクレジットカードのみ・自動更新です。Business プランの請求条件は個別契約により設定します。
            <br />
            セキュリティ・データ保護の詳細は{" "}
            <Link
              href="/security"
              className="underline underline-offset-2 hover:text-foreground"
            >
              セキュリティページ
            </Link>{" "}
            をご覧ください。
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border bg-foreground text-background">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            あなたの Excel が、最強のダッシュボードになる。
          </h2>
          <p className="mt-4 text-background/70">
            登録 30 秒・クレジットカード不要。今すぐ無料で試せます。
          </p>
          <div className="mt-8">
            <Link
              href="/start"
              className={buttonVariants({ size: "lg", variant: "secondary" })}
            >
              無料で解析する
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2">
                <Logo />
                <span className="font-semibold text-foreground">Skweep</span>
                <span className="text-xs text-muted-foreground">スクウィープ</span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                アップロードするだけ。データが意思決定に変わる。
                <br />
                Skweep は Geeno が運営する SaaS です。
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                プロダクト
              </p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#features" className="hover:text-foreground">
                    機能
                  </a>
                </li>
                <li>
                  <a href="#dashboards" className="hover:text-foreground">
                    ダッシュボード
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-foreground">
                    料金
                  </a>
                </li>
                <li>
                  <Link href="/start" className="hover:text-foreground">
                    無料で解析する
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Legal & Security
              </p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/security" className="hover:text-foreground">
                    セキュリティ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/tokushoho"
                    className="hover:text-foreground"
                  >
                    特定商取引法に基づく表記
                  </Link>
                </li>
                <li>
                  <Link href="/legal/privacy" className="hover:text-foreground">
                    プライバシーポリシー
                  </Link>
                </li>
                <li>
                  <Link href="/legal/terms" className="hover:text-foreground">
                    利用規約
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
            <span>© {new Date().getFullYear()} Geeno. All rights reserved.</span>
            <span>運営: Geeno (代表 藤野潤也) ・ info@geeno.net</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Logo() {
  return (
    <span
      aria-hidden
      className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-500 text-white shadow-sm"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-4 w-4"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 18 L10 12 L14 16 L20 8" />
        <path d="M14 8 H20 V14" />
      </svg>
    </span>
  );
}
