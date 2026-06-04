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
  },
  /** 規約・ポリシーの最終改定日 (YYYY-MM-DD) */
  policyLastUpdated: "2026-06-04",
} as const;

/** 合意管轄裁判所 (運営者の所在地最寄り) */
export const JURISDICTION = "水戸地方裁判所";
