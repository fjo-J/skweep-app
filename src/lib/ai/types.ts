/**
 * AI Gateway の共通型定義。
 *
 * 重要: AnalysisInput には「列名・型・統計・サンプル行」のみを含める。
 * Excel / CSV 全体のセル値を渡してはならない (コスト管理 & プライバシー)。
 */

export type ColumnType =
  | "string"
  | "number"
  | "integer"
  | "date"
  | "boolean"
  | "unknown";

export type ColumnStats = {
  count?: number;
  distinct?: number;
  nullCount?: number;
  min?: string | number;
  max?: string | number;
  mean?: number;
  median?: number;
  stddev?: number;
};

export type ColumnMeta = {
  name: string;
  type: ColumnType;
  stats?: ColumnStats;
  /** 5 件までのサンプル値。個人情報を含めないこと。 */
  samples?: string[];
};

export type AnalysisInput = {
  filename: string;
  rowCount: number;
  /** 1〜200 程度を想定。これより多い場合は呼び出し側で抽出を絞ること。 */
  columns: ColumnMeta[];
  /** UI 制御や A/B のためのオプショナルなヒント */
  locale?: string;
};

export type DashboardCandidateSlug =
  | "sales"
  | "marketing"
  | "executive"
  | "ops"
  | "production";

export type DashboardCandidate = {
  slug: DashboardCandidateSlug;
  title: string;
  /** 0-100 のマッチ度 */
  match: number;
  /** 採用根拠 (短い説明) */
  reasoning?: string;
  /** 推奨される KPI のラベル */
  kpis: string[];
  /** 推奨されるチャート種別 */
  charts?: string[];
};

export type KpiSuggestion = {
  name: string;
  description: string;
  /** 関連する列名 */
  columns?: string[];
};

export type AnalysisOutput = {
  category: string;
  candidates: DashboardCandidate[];
  kpis: KpiSuggestion[];
  /** どの provider / model が応答したか (デバッグ用) */
  provider: string;
  model: string;
  /** 概算原価 (日本円)。無料版では 5 円以下を目標。 */
  estimatedCostJpy: number;
  /** 処理にかかった時間 (ミリ秒) */
  latencyMs: number;
};

export interface AIProvider {
  readonly name: string;
  readonly model: string;
  analyzeSchema(input: AnalysisInput): Promise<AnalysisOutput>;
}
