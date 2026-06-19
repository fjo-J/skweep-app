/**
 * ユーザーの契約状態を localStorage で管理する (MVP 用)。
 *
 * Phase 2 (Supabase Auth) で「サーバー側で正規に検証する仕組み」に差し替える前提。
 * 現状は「決済完了したかどうか」をブラウザ側で覚えているだけのデモ実装。
 *
 * 主要なキー:
 *   skweep:plan          - 確定済みの契約情報 (Pro 状態)
 *   skweep:pendingPlan   - Stripe Checkout に遷移する直前の保留情報
 */

const PLAN_KEY = "skweep:plan";
const PENDING_KEY = "skweep:pendingPlan";

export type Plan = "monthly" | "annual";

export type PlanState = {
  tier: "pro";
  plan: Plan;
  /** 契約開始日時 (ISO 8601) */
  startedAt: string;
  /** Stripe Checkout Session ID (確認用) */
  sessionId?: string;
};

export type PendingPlan = {
  plan: Plan;
  /** 開始した日時 (ISO 8601)。一定時間経過で破棄する判定にも使う */
  initiatedAt: string;
};

export function getPlan(): PlanState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PLAN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PlanState;
    if (parsed.tier !== "pro") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setPlan(state: PlanState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PLAN_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function clearPlan(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PLAN_KEY);
  } catch {
    // ignore
  }
}

export function isPro(): boolean {
  return getPlan() !== null;
}

export function getPendingPlan(): PendingPlan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingPlan;
  } catch {
    return null;
  }
}

export function setPendingPlan(plan: Plan): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      PENDING_KEY,
      JSON.stringify({
        plan,
        initiatedAt: new Date().toISOString(),
      } satisfies PendingPlan)
    );
  } catch {
    // ignore
  }
}

export function clearPendingPlan(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PENDING_KEY);
  } catch {
    // ignore
  }
}

/**
 * pending → 確定に昇格する。Stripe Checkout から戻ってきた直後に呼ぶ。
 * pendingPlan がない場合はデフォルトで monthly として確定 (フェイルセーフ)。
 */
export function promotePendingToActive(sessionId?: string): PlanState {
  const pending = getPendingPlan();
  const planType: Plan = pending?.plan ?? "monthly";
  const state: PlanState = {
    tier: "pro",
    plan: planType,
    startedAt: new Date().toISOString(),
    sessionId,
  };
  setPlan(state);
  clearPendingPlan();
  return state;
}

/**
 * プランラベルを取得 (UI 表示用)。
 */
export function planLabel(plan: Plan): string {
  return plan === "annual" ? "年額プラン (¥15,000 / 年)" : "月額プラン (¥1,500 / 月)";
}

/**
 * 次回更新日を計算 (UI 表示用・契約開始日 + 1 ヶ月 or 1 年)。
 */
export function nextRenewalDate(state: PlanState): Date {
  const start = new Date(state.startedAt);
  const next = new Date(start);
  if (state.plan === "annual") {
    next.setFullYear(next.getFullYear() + 1);
  } else {
    next.setMonth(next.getMonth() + 1);
  }
  return next;
}
