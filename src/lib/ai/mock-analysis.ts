import type {
  AnalysisInput,
  AnalysisOutput,
  DashboardCandidate,
  DashboardCandidateSlug,
  KpiSuggestion,
} from "./types";

/**
 * Phase 6 ではすべての provider が同じこのモック関数を呼ぶ。
 * Phase 7 以降で各 provider が実 API を呼ぶように差し替える。
 *
 * カラム名の簡易ヒューリスティックでマッチ度を上下させ、それっぽい応答を返す。
 */
export function buildMockAnalysis(
  input: AnalysisInput,
  meta: { provider: string; model: string; startedAt: number }
): AnalysisOutput {
  const score = computeCandidateScores(input);

  const raw: DashboardCandidate[] = [
    {
      slug: "sales",
      title: "営業パイプライン",
      match: score.sales,
      reasoning: "商談・受注を示唆する列が検出されました。",
      kpis: ["商談ステージ別件数", "受注率", "担当者別パイプライン"],
      charts: ["bar", "line"],
    },
    {
      slug: "marketing",
      title: "マーケティング",
      match: score.marketing,
      reasoning: "施策・流入・コンバージョンを示唆する列が検出されました。",
      kpis: ["チャネル別流入", "CVR 推移", "キャンペーン別 ROAS"],
      charts: ["donut", "line"],
    },
    {
      slug: "executive",
      title: "経営サマリー",
      match: score.executive,
      reasoning: "売上・利益を示唆する列が検出されました。",
      kpis: ["売上 YoY", "粗利益率", "事業セグメント比"],
      charts: ["line", "donut"],
    },
    {
      slug: "ops",
      title: "現場オペレーション",
      match: score.ops,
      reasoning: "ステータスやタスク状態を示唆する列が検出されました。",
      kpis: ["稼働率", "ステータス別タスク数", "リードタイム"],
      charts: ["bar", "table"],
    },
    {
      slug: "production",
      title: "生産管理ボード",
      match: score.production,
      reasoning: "工程・予実を示唆する列が検出されました。",
      kpis: ["工程別予実", "リードタイム", "歩留り推移"],
      charts: ["bar", "line"],
    },
  ];
  const candidates = [...raw].sort((a, b) => b.match - a.match);

  const topCategory = labelForSlug(candidates[0].slug);

  const kpis: KpiSuggestion[] = candidates[0].kpis.map((name) => ({
    name,
    description: `${candidates[0].title} の中核指標として推奨されます。`,
  }));

  return {
    category: topCategory,
    candidates,
    kpis,
    provider: meta.provider,
    model: meta.model,
    estimatedCostJpy: estimateCostJpy(input),
    latencyMs: Date.now() - meta.startedAt,
  };
}

function labelForSlug(slug: DashboardCandidateSlug): string {
  switch (slug) {
    case "sales":
      return "営業";
    case "marketing":
      return "マーケティング";
    case "executive":
      return "経営";
    case "ops":
      return "現場オペレーション";
    case "production":
      return "生産管理";
  }
}

function computeCandidateScores(input: AnalysisInput): {
  sales: number;
  marketing: number;
  executive: number;
  ops: number;
  production: number;
} {
  const colNames = input.columns.map((c) => c.name.toLowerCase());

  const matchAny = (keywords: string[]) =>
    keywords.some((k) => colNames.some((n) => n.includes(k.toLowerCase())));

  const salesHits =
    Number(
      // ⚠️ "リード" 単体は "リードタイム" に誤ヒットするため除外し、
      //    "リード数" や "lead " のような特異性のある形でのみ判定する
      matchAny([
        "商談",
        "受注",
        "リード数",
        "見込み客",
        "deal",
        "opportunity",
        "pipeline",
      ])
    ) +
    Number(matchAny(["顧客", "client", "company", "account"])) +
    Number(matchAny(["金額", "amount", "price", "value"]));

  const marketingHits =
    Number(
      matchAny([
        "施策",
        "キャンペーン",
        "campaign",
        "promotion",
        "ad",
        "ads",
        "広告",
        "marketing",
      ])
    ) +
    Number(
      matchAny([
        "ctr",
        "cv",
        "cvr",
        "conversion",
        "コンバージョン",
        "クリック",
        "click",
      ])
    ) +
    Number(
      matchAny([
        "流入",
        "セッション",
        "session",
        "impression",
        "インプレッション",
        "pv",
        "ページビュー",
      ])
    ) +
    Number(
      matchAny(["roas", "cpa", "cac", "cpm", "ltv", "媒体", "channel", "チャネル"])
    );

  const execHits =
    Number(matchAny(["売上", "revenue", "sales"])) +
    Number(matchAny(["利益", "profit", "margin", "ebitda"])) +
    Number(matchAny(["セグメント", "segment", "事業", "部門"]));

  const opsHits =
    Number(matchAny(["タスク", "task", "status", "ステータス", "チケット", "ticket"])) +
    Number(matchAny(["担当", "assignee", "owner", "アサイン"])) +
    Number(matchAny(["完了", "進捗", "deadline", "期限", "sla"]));

  const prodHits =
    Number(matchAny(["工程", "process", "production"])) +
    Number(
      // ⚠️ "予実" は "予定数"/"実績数" には部分一致しないため、個別キーワードを追加
      matchAny(["予実", "plan", "actual", "予定", "実績"])
    ) +
    Number(matchAny(["歩留", "yield"])) +
    Number(matchAny(["不良", "defect"])) +
    Number(matchAny(["ロット", "lot"]));

  const toScore = (hits: number, base: number) =>
    Math.min(99, base + hits * 8 + Math.floor(Math.random() * 4));

  return {
    sales: toScore(salesHits, 70),
    marketing: toScore(marketingHits, 67),
    executive: toScore(execHits, 65),
    ops: toScore(opsHits, 62),
    production: toScore(prodHits, 58),
  };
}

/**
 * 概算原価 (円)。列数とサンプル数から、列メタ送信に要する想定トークンを計算する。
 * 無料版では 5 円以下を目標 (指示書)。
 */
function estimateCostJpy(input: AnalysisInput): number {
  // 1 列あたりおおむね 40 トークン (列名 + 型 + 統計 + サンプル)
  const estimatedTokens = input.columns.length * 40;
  // 平均的なモデル単価想定: 1k トークンあたり 0.5 円
  const cost = (estimatedTokens / 1000) * 0.5;
  return Math.max(0.5, Math.round(cost * 10) / 10);
}
