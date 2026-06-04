import type { Metadata } from "next";

import { COMPANY, SERVICE } from "@/lib/company";

export const metadata: Metadata = {
  title: `プライバシーポリシー | ${SERVICE.name}`,
  description: `${SERVICE.name} における個人情報の取扱方針。`,
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <header className="mb-10">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          プライバシーポリシー
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          最終改定日: {SERVICE.policyLastUpdated}
        </p>
      </header>

      <div className="space-y-10 text-[15px] leading-relaxed">
        <Intro />

        <Section title="第1条 (取得する情報)">
          <p>
            当社は、本サービスの提供にあたり、以下の情報を取得することがあります。
          </p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              氏名、会社名、メールアドレス等、お客様が入力フォームから登録された情報
            </li>
            <li>
              お客様がアップロードした Excel / CSV ファイルおよびそのメタデータ
              (列名、型、統計値等)
            </li>
            <li>
              IP アドレス、ブラウザ種別、リファラ、Cookie、アクセス日時等のログ情報
            </li>
            <li>
              決済処理に関連する情報 (カード情報そのものは決済代行会社が直接取得し、当社は受領しません)
            </li>
          </ul>
        </Section>

        <Section title="第2条 (利用目的)">
          <p>取得した情報は以下の目的で利用します。</p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>本サービスの提供、運営、改善のため</li>
            <li>本人確認、認証、不正利用の防止のため</li>
            <li>有料プランに関する利用料金の請求のため</li>
            <li>
              お客様からのお問い合わせ、サポートへの対応、重要なお知らせの通知のため
            </li>
            <li>サービス改善のための統計分析 (個人を識別しない形に加工して利用)</li>
            <li>
              法令、ガイドライン、利用規約等の遵守、または法令に基づく開示請求への対応のため
            </li>
          </ul>
        </Section>

        <Section title="第3条 (アップロードファイルの取扱い)">
          <p>
            お客様がアップロードされた Excel / CSV ファイルは、AI による解析処理の完了後、原則として速やかに削除します。
          </p>
          <p>
            AI 解析にあたっては、ファイル全体ではなく、列名・型情報・統計値・限定的なサンプル行のみを処理対象とします。お客様のセル単位のデータが意図せず外部に送信されることを防ぐ設計を採用しています。
          </p>
        </Section>

        <Section title="第4条 (第三者提供)">
          <p>
            当社は、次の場合を除き、お客様の個人情報を第三者に提供することはありません。
          </p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>お客様の同意がある場合</li>
            <li>法令に基づく場合</li>
            <li>
              人の生命、身体または財産の保護のために必要があり、お客様の同意取得が困難な場合
            </li>
            <li>
              本サービスの運営に必要な業務委託先 (クラウドインフラ、決済代行、AI プロバイダ、メール配信、解析等) に、利用目的の達成に必要な範囲で開示する場合
            </li>
          </ul>
        </Section>

        <Section title="第5条 (Cookie の利用)">
          <p>
            本サービスは、利用状況の把握およびサービス改善のために Cookie を使用することがあります。お客様はブラウザの設定により Cookie の受け入れを拒否することができますが、その場合一部の機能が利用できなくなる可能性があります。
          </p>
        </Section>

        <Section title="第6条 (個人情報の管理)">
          <p>
            当社は、お客様の個人情報を正確かつ最新の内容に保ち、漏洩、滅失、毀損、不正アクセス等を防止するため、安全管理に必要かつ適切な措置を講じます。
          </p>
        </Section>

        <Section title="第7条 (開示・訂正・削除の請求)">
          <p>
            お客様は、当社が保有するご自身の個人情報について、開示・訂正・追加・削除・利用停止を請求することができます。請求方法については下記お問い合わせ先までご連絡ください。
          </p>
        </Section>

        <Section title="第8条 (改定)">
          <p>
            本ポリシーの内容は、法令の変更や本サービスの内容の変更に伴い、予告なく変更されることがあります。重要な変更については本サービス上で別途お知らせします。
          </p>
        </Section>

        <Section title="第9条 (お問い合わせ)">
          <p>本ポリシーに関するお問い合わせは下記までお願いいたします。</p>
          <address className="mt-3 not-italic rounded-xl border border-border bg-muted/40 p-4">
            <div>{COMPANY.name}</div>
            <div>{COMPANY.address}</div>
            <div>
              Email:{" "}
              <a
                href={`mailto:${COMPANY.email}`}
                className="underline underline-offset-2 hover:text-foreground"
              >
                {COMPANY.email}
              </a>
            </div>
          </address>
        </Section>
      </div>
    </>
  );
}

function Intro() {
  return (
    <p className="text-[15px] leading-relaxed">
      {COMPANY.name} (以下「当社」といいます) は、{COMPANY.name} が提供するサービス「{SERVICE.name}」(以下「本サービス」といいます) におけるお客様の個人情報の取扱いについて、以下のとおりプライバシーポリシー (以下「本ポリシー」といいます) を定めます。
    </p>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}
