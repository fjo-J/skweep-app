/**
 * Skweep を運営する Geeno の情報。
 * 法的ページ・フッター・特商法表記など複数箇所から参照される。
 */
export const COMPANY = {
  /** 屋号 */
  name: "Geeno",
  /** 代表者氏名 */
  representative: "藤野潤也",
  /** 所在地 */
  address: "〒305-0031 茨城県つくば市吾妻2丁目4-1 d_llつくば 3F",
  /** お問い合わせ用メールアドレス */
  email: "info@geeno.net",
  /** 設立年 (フッターのコピーライト表示) */
  foundedYear: 2026,
} as const;

export const SERVICE = {
  /** サービス名 */
  name: "Skweep",
  /** 読み */
  nameJa: "スクウィープ",
  /** 公開 URL */
  url: "https://skweep.jp",
  /** プラン */
  plans: {
    monthly: { label: "月額プラン", price: 1500, cycle: "/ 月" },
    annual: { label: "年額プラン", price: 15000, cycle: "/ 年" },
    business: {
      label: "Business プラン",
      priceLabel: "お問い合わせ",
      cycle: "/ 月〜",
      contact: "info@geeno.net",
    },
  },
  /** 規約・ポリシーの最終改定日 (YYYY-MM-DD) */
  policyLastUpdated: "2026-06-04",
} as const;

/**
 * 業務委託先 (サブプロセッサー)。
 * セキュリティページ・プライバシーポリシーから参照される。
 */
export const SUB_PROCESSORS = [
  {
    name: "Vercel, Inc.",
    purpose: "Web ホスティング・配信 (Next.js アプリ実行)",
    region: "東京 (hnd1) リージョンに固定",
    url: "https://vercel.com/legal/privacy-policy",
  },
  {
    name: "Stripe Japan K.K.",
    purpose: "クレジットカード決済代行・サブスクリプション管理",
    region: "日本",
    url: "https://stripe.com/jp/privacy",
  },
  {
    name: "Anthropic, PBC",
    purpose: "AI による列メタ解析 (Claude モデル)",
    region: "米国 (zero data retention 契約・学習利用不可)",
    url: "https://www.anthropic.com/legal/privacy",
  },
  {
    name: "OpenAI, LLC",
    purpose: "AI による列メタ解析 (GPT モデル・選択時のみ)",
    region: "米国 (API データの学習利用不可)",
    url: "https://openai.com/policies/privacy-policy",
  },
  {
    name: "Google LLC",
    purpose: "AI による列メタ解析 (Gemini モデル・選択時のみ)",
    region: "米国/欧州",
    url: "https://policies.google.com/privacy",
  },
  {
    name: "GitHub, Inc.",
    purpose: "ソースコード管理 (お客様データは保管しません)",
    region: "米国",
    url: "https://docs.github.com/en/site-policy/privacy-policies",
  },
] as const;

/** 合意管轄裁判所 (運営者の所在地最寄り) */
export const JURISDICTION = "水戸地方裁判所";
