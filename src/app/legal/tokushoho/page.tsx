import type { Metadata } from "next";

import { COMPANY, JURISDICTION, SERVICE } from "@/lib/company";

export const metadata: Metadata = {
  title: `特定商取引法に基づく表記 | ${SERVICE.name}`,
  description: `${SERVICE.name} の特定商取引法に基づく表記。`,
};

const rows: { label: string; value: React.ReactNode }[] = [
  { label: "販売事業者", value: COMPANY.name },
  { label: "運営責任者", value: COMPANY.representative },
  { label: "所在地", value: COMPANY.address },
  {
    label: "電話番号",
    value: (
      <span className="text-muted-foreground">
        ご請求があった場合は遅滞なく開示いたします。お問い合わせは下記メールアドレスまでご連絡ください。
      </span>
    ),
  },
  {
    label: "お問い合わせ",
    value: (
      <a
        href={`mailto:${COMPANY.email}`}
        className="underline underline-offset-2 hover:text-foreground"
      >
        {COMPANY.email}
      </a>
    ),
  },
  {
    label: "販売価格",
    value: (
      <ul className="space-y-1">
        <li>
          {SERVICE.plans.monthly.label}: ¥
          {SERVICE.plans.monthly.price.toLocaleString()} (税込) /
          {SERVICE.plans.monthly.cycle.replace("/", "").trim()}
        </li>
        <li>
          {SERVICE.plans.annual.label}: ¥
          {SERVICE.plans.annual.price.toLocaleString()} (税込) /
          {SERVICE.plans.annual.cycle.replace("/", "").trim()}
        </li>
      </ul>
    ),
  },
  {
    label: "商品代金以外の必要料金",
    value: "なし (通信費はお客様のご負担となります)",
  },
  {
    label: "支払方法",
    value: "クレジットカード決済 (Visa / Mastercard / JCB / American Express / Diners Club)",
  },
  {
    label: "支払時期",
    value: (
      <ul className="list-disc space-y-1 pl-5">
        <li>月額プラン: お申込み時、および以降毎月のご利用開始日に自動課金</li>
        <li>年額プラン: お申込み時、および以降毎年のご利用開始日に自動課金</li>
      </ul>
    ),
  },
  {
    label: "商品の引渡時期",
    value:
      "決済完了後、即時にすべての機能をご利用いただけます。",
  },
  {
    label: "返品・キャンセル",
    value: (
      <div className="space-y-2">
        <p>
          本サービスはデジタルコンテンツの性質上、決済完了後の返金は原則としてお受けできません。
        </p>
        <p>
          サブスクリプションは、次回更新日の前日までにお客様自身で解約手続きを行うことで、次回以降の課金を停止することができます。日割り計算による中途解約の返金は行いません。
        </p>
      </div>
    ),
  },
  {
    label: "解約方法",
    value: (
      <p>
        ログイン後の管理画面または{" "}
        <a
          href={`mailto:${COMPANY.email}`}
          className="underline underline-offset-2 hover:text-foreground"
        >
          {COMPANY.email}
        </a>{" "}
        へのご連絡により、いつでも解約いただけます。
      </p>
    ),
  },
  {
    label: "動作環境",
    value:
      "最新版の Google Chrome / Safari / Microsoft Edge / Firefox 等のモダンブラウザでのご利用を推奨します。",
  },
];

export default function TokushohoPage() {
  return (
    <>
      <header className="mb-10">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          特定商取引法に基づく表記
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          最終改定日: {SERVICE.policyLastUpdated}
        </p>
      </header>

      <dl className="divide-y divide-border rounded-2xl border border-border bg-background">
        {rows.map((r) => (
          <div
            key={r.label}
            className="grid grid-cols-1 gap-3 px-5 py-4 sm:grid-cols-[12rem_1fr] sm:px-6 sm:py-5"
          >
            <dt className="text-sm font-semibold">{r.label}</dt>
            <dd className="text-sm leading-relaxed text-foreground">
              {r.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-8 text-xs text-muted-foreground">
        本表記は予告なく変更される場合があります。最新の内容は本ページにてご確認ください。
        準拠法は日本法とし、本サービスに関する一切の紛争については
        {JURISDICTION} を第一審の専属的合意管轄裁判所とします。
      </p>
    </>
  );
}
