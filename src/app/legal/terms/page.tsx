import type { Metadata } from "next";

import { COMPANY, JURISDICTION, SERVICE } from "@/lib/company";

export const metadata: Metadata = {
  title: `利用規約 | ${SERVICE.name}`,
  description: `${SERVICE.name} の利用規約。`,
};

export default function TermsPage() {
  return (
    <>
      <header className="mb-10">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          利用規約
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          最終改定日: {SERVICE.policyLastUpdated}
        </p>
      </header>

      <div className="space-y-10 text-[15px] leading-relaxed">
        <p>
          本利用規約 (以下「本規約」といいます) は、{COMPANY.name} (以下「当社」といいます) が提供する「{SERVICE.name}」(以下「本サービス」といいます) のご利用条件を定めるものです。利用者の皆様には、本規約に同意のうえ本サービスをご利用いただきます。
        </p>

        <Section title="第1条 (適用)">
          <p>
            本規約は、利用者と当社との間の本サービス利用に関わる一切の関係に適用されるものとします。
          </p>
        </Section>

        <Section title="第2条 (利用登録)">
          <ol className="ml-5 list-decimal space-y-1.5">
            <li>
              利用希望者は、本規約に同意のうえ、当社の定める方法によって利用登録を申請するものとします。
            </li>
            <li>
              当社は、利用申請者に以下の事由があると判断した場合、利用登録を承認しないことがあります。
              <ul className="ml-5 mt-1 list-disc space-y-1">
                <li>申請内容に虚偽の記載がある場合</li>
                <li>反社会的勢力に該当する、または関係を有する場合</li>
                <li>過去に本規約の違反等により利用停止処分を受けたことがある場合</li>
                <li>その他、当社が利用登録を相当でないと判断した場合</li>
              </ul>
            </li>
          </ol>
        </Section>

        <Section title="第3条 (利用料金および支払方法)">
          <ol className="ml-5 list-decimal space-y-1.5">
            <li>
              利用者は、有料プランの対価として、当社が別途定め本サービス上に表示する利用料金を、当社が指定する方法で支払うものとします。
            </li>
            <li>
              支払方法はクレジットカードによる自動引き落としとし、解約があるまで継続的に課金されます。
            </li>
            <li>
              支払いが遅延した場合、利用者は年 14.6% の割合による遅延損害金を当社に支払うものとします。
            </li>
          </ol>
        </Section>

        <Section title="第4条 (禁止事項)">
          <p>利用者は、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>法令または公序良俗に違反する行為</li>
            <li>犯罪行為に関連する行為</li>
            <li>
              本サービスの内容等、本サービスに含まれる著作権、商標権等の知的財産権を侵害する行為
            </li>
            <li>
              当社、他の利用者、または第三者の権利、名誉、財産、プライバシーを侵害する行為
            </li>
            <li>
              本サービスのネットワーク、システムに過度な負荷をかける行為、リバースエンジニアリング、不正アクセス
            </li>
            <li>本サービスの運営を妨害するおそれのある行為</li>
            <li>
              他の利用者に成りすます行為、または本サービスのアカウントを第三者に譲渡・貸与する行為
            </li>
            <li>本サービスを商業目的で再販・転売する行為</li>
            <li>その他、当社が不適切と判断する行為</li>
          </ul>
        </Section>

        <Section title="第5条 (本サービスの提供の停止等)">
          <ol className="ml-5 list-decimal space-y-1.5">
            <li>
              当社は、以下のいずれかに該当する場合、利用者への事前の通知なく本サービスの全部または一部の提供を停止または中断することがあります。
              <ul className="ml-5 mt-1 list-disc space-y-1">
                <li>システムの保守点検または更新を行う場合</li>
                <li>地震、落雷、火災、停電または天災等の不可抗力により提供が困難となった場合</li>
                <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                <li>その他、当社が本サービスの提供が困難と判断した場合</li>
              </ul>
            </li>
            <li>
              当社は、本サービスの提供の停止または中断により利用者に生じた損害について、一切の責任を負いません。
            </li>
          </ol>
        </Section>

        <Section title="第6条 (著作権・知的財産権)">
          <ol className="ml-5 list-decimal space-y-1.5">
            <li>
              本サービスおよび本サービスに関連する一切のコンテンツに係る著作権、商標権その他の知的財産権はすべて当社または当社にライセンスを許諾している者に帰属します。
            </li>
            <li>
              利用者が本サービスにアップロードしたデータの著作権等は利用者に帰属するものとし、当社はサービス提供に必要な範囲でのみこれを利用します。
            </li>
          </ol>
        </Section>

        <Section title="第7条 (利用制限および登録抹消)">
          <p>
            当社は、利用者が本規約に違反した場合、または当社が本サービスの利用を継続することが不適当と判断した場合、事前の通知なく本サービスの利用を制限し、または利用者の登録を抹消することができます。
          </p>
        </Section>

        <Section title="第8条 (退会)">
          <p>
            利用者は、当社の定める手続きによりいつでも退会することができます。退会した場合、当該利用者に紐づくデータは規約および関連法令に従い削除されます。
          </p>
        </Section>

        <Section title="第9条 (保証の否認および免責事項)">
          <ol className="ml-5 list-decimal space-y-1.5">
            <li>
              当社は、本サービスに事実上または法律上の瑕疵 (安全性、信頼性、正確性、完全性、有効性、特定目的への適合性、第三者の権利を侵害しないこと等を含みます) がないことを明示的にも黙示的にも保証しません。
            </li>
            <li>
              本サービスにより生成される分析結果、ダッシュボード、AI による提案等は、参考情報であり、その正確性・有用性を保証するものではありません。最終的な意思決定は利用者ご自身の責任で行うものとします。
            </li>
            <li>
              当社は、本サービスに起因して利用者に生じたあらゆる損害について、当社の故意または重過失による場合を除き、一切の責任を負いません。
            </li>
            <li>
              当社が責任を負う場合であっても、損害賠償額は、利用者が当該損害の発生時点までの過去 12 か月間に当社に支払った利用料金の総額を上限とします。
            </li>
          </ol>
        </Section>

        <Section title="第10条 (サービス内容の変更等)">
          <p>
            当社は、利用者に事前の通知をすることなく本サービスの内容を変更、追加、廃止することがあり、これによって利用者に生じた損害について一切の責任を負いません。
          </p>
        </Section>

        <Section title="第11条 (利用規約の変更)">
          <p>
            当社は、必要と判断した場合には、利用者に通知することなく本規約をいつでも変更することができるものとします。変更後の本規約は、本サービス上での公表時から効力を生じるものとします。
          </p>
        </Section>

        <Section title="第12条 (個人情報の取扱い)">
          <p>
            本サービスの利用に伴って当社が取得する個人情報については、別途定めるプライバシーポリシーに従い適切に取り扱います。
          </p>
        </Section>

        <Section title="第13条 (通知または連絡)">
          <p>
            利用者と当社との間の通知または連絡は、当社の定める方法によって行うものとします。
          </p>
        </Section>

        <Section title="第14条 (権利義務の譲渡禁止)">
          <p>
            利用者は、当社の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利義務を第三者に譲渡し、または担保に供することはできません。
          </p>
        </Section>

        <Section title="第15条 (準拠法・管轄裁判所)">
          <ol className="ml-5 list-decimal space-y-1.5">
            <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
            <li>
              本サービスに関して紛争が生じた場合には、{JURISDICTION} を第一審の専属的合意管轄裁判所とします。
            </li>
          </ol>
        </Section>

        <p className="text-sm text-muted-foreground">以上</p>
      </div>
    </>
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
