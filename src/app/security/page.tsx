import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CloudOff,
  FileSpreadsheet,
  Globe2,
  KeyRound,
  Layers,
  Lock,
  ServerCog,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { SkweepLogo } from "@/components/skweep-logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { COMPANY, SERVICE, SUB_PROCESSORS } from "@/lib/company";

export const metadata: Metadata = {
  title: `セキュリティ | ${SERVICE.name}`,
  description: `${SERVICE.name} のセキュリティ・データ保護に関する方針と仕組み。`,
};

export default function SecurityPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <SkweepLogo />
            <span className="text-lg font-semibold tracking-tight">Skweep</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            トップへ戻る
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-[-10rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-emerald-100/60 via-sky-100/40 to-transparent blur-3xl" />
          </div>
          <div className="mx-auto max-w-4xl px-6 py-20 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Skweep のセキュリティ
            </span>
            <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              「中身」を渡さなくても、
              <br className="hidden sm:block" />
              ダッシュボードはつくれる。
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Skweep は AI 提供事業者に <span className="font-semibold text-foreground">列名・型・統計・限定的なサンプル行のみ</span> を送信します。お客様のセル単位の機密データが外部に送られることはありません。
            </p>
          </div>
        </section>

        {/* Promises */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <h2 className="text-center text-3xl font-bold tracking-tight">
              5 つのセキュリティ約束
            </h2>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <PromiseCard
                icon={<CloudOff className="h-5 w-5" />}
                title="ファイル本体を永続化しない"
                desc="アップロードされた Excel / CSV は AI 解析の直後に破棄されます。Skweep のストレージには保存しません。"
              />
              <PromiseCard
                icon={<Sparkles className="h-5 w-5" />}
                title="AI へは列メタのみ送信"
                desc="列名・型情報・統計値・最大 5 件のサンプル行のみが AI に送信されます。セル単位の生データは AI に渡りません。"
              />
              <PromiseCard
                icon={<Globe2 className="h-5 w-5" />}
                title="日本リージョンで処理"
                desc="アプリケーションは Vercel の東京 (hnd1) リージョンに固定。コードや API は日本国内のデータセンターで実行されます。"
              />
              <PromiseCard
                icon={<Lock className="h-5 w-5" />}
                title="通信は TLS 1.2+ で暗号化"
                desc="すべての通信は HTTPS (TLS 1.2 以上) で暗号化されます。ブラウザから Skweep、Skweep から AI 提供事業者すべて。"
              />
              <PromiseCard
                icon={<KeyRound className="h-5 w-5" />}
                title="ゼロデータリテンション契約"
                desc="主要 AI 提供事業者 (Anthropic / OpenAI) と API データの学習利用不可・短期保管の契約を結んだ上で利用しています。"
              />
              <PromiseCard
                icon={<ServerCog className="h-5 w-5" />}
                title="責任分界点の明確化"
                desc="DPA (データ処理契約) のテンプレートを企業契約時にご提供します。サブプロセッサーは下記の通り公開しています。"
              />
            </div>
          </div>
        </section>

        {/* Data flow */}
        <section className="border-b border-border bg-muted/30">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <h2 className="text-center text-3xl font-bold tracking-tight">
              データの流れを可視化
            </h2>
            <p className="mt-4 text-center text-sm leading-relaxed text-muted-foreground">
              アップロードから解析結果表示までに、どこにどんな情報が流れるかを完全公開します。
            </p>

            <div className="mt-12 space-y-4">
              <FlowStep
                step="1"
                icon={<FileSpreadsheet className="h-5 w-5" />}
                title="ブラウザで Excel/CSV を読み込み"
                desc="ファイル本体はお客様のブラウザのメモリ内にのみ保持されます。この時点で Skweep サーバーには一切送信されていません。"
                badge="ユーザー端末"
                tone="local"
              />
              <FlowStep
                step="2"
                icon={<Layers className="h-5 w-5" />}
                title="列メタ情報を抽出"
                desc="列名・型・統計値・先頭 5 件のサンプル行を抽出。PII (メールアドレス / 電話番号等) を含む可能性がある列はマスクします。"
                badge="ユーザー端末"
                tone="local"
              />
              <FlowStep
                step="3"
                icon={<ServerCog className="h-5 w-5" />}
                title="Skweep サーバーへ列メタを送信"
                desc="抽出した列メタ情報のみが HTTPS で Skweep の API (Vercel 東京) に送信されます。ファイル本体は送信しません。"
                badge="Skweep API (東京)"
                tone="skweep"
              />
              <FlowStep
                step="4"
                icon={<Sparkles className="h-5 w-5" />}
                title="AI 提供事業者へ列メタを転送"
                desc="お客様が選択した AI 提供事業者 (Anthropic / OpenAI / Gemini) のいずれかに、列メタのみを転送して解析を依頼します。"
                badge="AI 提供事業者"
                tone="ai"
              />
              <FlowStep
                step="5"
                icon={<CheckCircle2 className="h-5 w-5" />}
                title="解析結果をユーザーに返却"
                desc="AI の応答 (ダッシュボード候補・KPI 提案) をお客様のブラウザに返却します。Skweep サーバー上には永続保存しません (Pro プランの「保存」機能利用時を除く)。"
                badge="ユーザー端末"
                tone="local"
              />
            </div>
          </div>
        </section>

        {/* Sub-processors */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <h2 className="text-3xl font-bold tracking-tight">
              サブプロセッサー (業務委託先)
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              本サービスの提供のために以下の業務委託先を利用しています。サブプロセッサーの追加・変更時は、本ページにて更新します。
            </p>

            <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-background">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/40">
                  <tr className="text-left">
                    <th className="px-5 py-3 font-medium">事業者</th>
                    <th className="px-5 py-3 font-medium">利用目的</th>
                    <th className="px-5 py-3 font-medium">処理地域</th>
                    <th className="px-5 py-3 font-medium">プライバシー</th>
                  </tr>
                </thead>
                <tbody>
                  {SUB_PROCESSORS.map((p) => (
                    <tr
                      key={p.name}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-5 py-3 font-medium">{p.name}</td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {p.purpose}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {p.region}
                      </td>
                      <td className="px-5 py-3">
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-600 underline underline-offset-2 hover:text-sky-700"
                        >
                          詳細
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Business plan upsell */}
        <section className="border-b border-border bg-foreground text-background">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-background/10 px-3 py-1 text-xs font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              Business プラン
            </span>
            <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
              より高い水準のセキュリティをお求めの企業様へ
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-background/80">
              DPA (データ処理契約) の締結、IP 制限、SSO (SAML)、監査ログ、専用 AI モデルチャネルなど、企業の情報セキュリティ要件に応じた追加機能を Business プランでご提供します。
            </p>
            <div className="mt-8">
              <a
                href={`mailto:${COMPANY.email}?subject=${encodeURIComponent("Skweep Business プランお問い合わせ")}`}
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" })
                )}
              >
                Business プランを相談する
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-4 text-xs text-background/60">
              info@geeno.net 宛にメールでもお気軽にお問い合わせください。
            </p>
          </div>
        </section>

        {/* Q&A short */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-6 py-20">
            <h2 className="text-3xl font-bold tracking-tight">よくある質問</h2>
            <div className="mt-10 space-y-6">
              <Faq
                q="アップロードしたファイルは保存されますか？"
                a="無料版・Pro 版とも、ファイル本体は Skweep のサーバーに永続保存されません。AI 解析後にメモリから破棄されます。Pro 版の「保存」機能は、解析結果 (ダッシュボード) のみを保存します。元の Excel/CSV は保存しません。"
              />
              <Faq
                q="AI 提供事業者は当社のデータを学習に使いませんか？"
                a="主要 AI 提供事業者 (Anthropic / OpenAI) と「API データを学習利用しない」契約を結んでいます。詳細は各社のエンタープライズ条項をご参照ください。"
              />
              <Faq
                q="DPA (データ処理契約) を結べますか？"
                a="Business プランでは標準対応しています。Pro プランをご利用中でも個別にご相談可能ですので info@geeno.net までご連絡ください。"
              />
              <Faq
                q="脆弱性を発見した場合の報告先は？"
                a={`セキュリティに関するご報告は ${COMPANY.email} までお願いします。可能であれば PoC・再現手順・想定影響を併記いただけると助かります。発見者の方には誠実に対応いたします。`}
              />
              <Faq
                q="本番リリース後の本人確認・カード情報はどう管理されますか？"
                a="決済情報 (カード番号等) は Stripe が直接取得し、Skweep には保存されません。Skweep は Stripe から「顧客 ID」「サブスクリプション ID」のみを受け取ります。これは PCI DSS Level 1 認証を受けた Stripe の標準アーキテクチャです。"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-8 text-xs text-muted-foreground">
          最終更新: {SERVICE.policyLastUpdated} ・ お問い合わせ:{" "}
          <a
            href={`mailto:${COMPANY.email}`}
            className="underline underline-offset-2 hover:text-foreground"
          >
            {COMPANY.email}
          </a>
        </div>
      </footer>
    </div>
  );
}

function PromiseCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-foreground text-background">
        {icon}
      </span>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {desc}
      </p>
    </div>
  );
}

function FlowStep({
  step,
  icon,
  title,
  desc,
  badge,
  tone,
}: {
  step: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge: string;
  tone: "local" | "skweep" | "ai";
}) {
  const badgeClass = cn(
    "rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1",
    tone === "local"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : tone === "skweep"
        ? "bg-sky-50 text-sky-700 ring-sky-200"
        : "bg-violet-50 text-violet-700 ring-violet-200"
  );
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-background p-5">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted font-mono text-sm font-bold">
        {step}
      </span>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background">
            {icon}
          </span>
          <h3 className="text-sm font-semibold">{title}</h3>
          <span className={badgeClass}>{badge}</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {desc}
        </p>
      </div>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <h3 className="text-sm font-semibold">{q}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a}</p>
    </div>
  );
}
