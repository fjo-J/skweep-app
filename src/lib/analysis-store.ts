/**
 * 解析結果と保存済みダッシュボードを localStorage に永続化する。
 * Phase 2 では Supabase 等の DB に差し替える想定。
 */

import type { AnalysisOutput } from "@/lib/ai/types";

const CURRENT_KEY = "skweep:currentAnalysis";
const SAVED_KEY = "skweep:savedAnalyses";

export type StoredCurrentAnalysis = {
  filename: string;
  totalRowCount: number;
  truncated: boolean;
  output: AnalysisOutput;
  analyzedAt: string;
};

export type StoredSavedAnalysis = StoredCurrentAnalysis & {
  id: string;
  savedAt: string;
  /** ユーザーが付けた任意のタイトル (デフォルトはファイル名) */
  title: string;
  /** 開いた最後のダッシュボード slug (任意) */
  lastDashboardSlug?: string;
};

export function setCurrentAnalysis(value: StoredCurrentAnalysis): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CURRENT_KEY, JSON.stringify(value));
  } catch {
    // quota 超過などは無視
  }
}

export function getCurrentAnalysis(): StoredCurrentAnalysis | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CURRENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredCurrentAnalysis;
  } catch {
    return null;
  }
}

export function clearCurrentAnalysis(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CURRENT_KEY);
  } catch {
    // ignore
  }
}

export function listSavedAnalyses(): StoredSavedAnalysis[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SAVED_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as StoredSavedAnalysis[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveAnalysis(
  analysis: StoredCurrentAnalysis,
  options?: { title?: string; dashboardSlug?: string }
): StoredSavedAnalysis {
  const all = listSavedAnalyses();
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const entry: StoredSavedAnalysis = {
    ...analysis,
    id,
    savedAt: new Date().toISOString(),
    title: options?.title ?? analysis.filename,
    lastDashboardSlug: options?.dashboardSlug,
  };
  const updated = [entry, ...all].slice(0, 50); // 上限 50 件
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
    } catch {
      // quota 超過時は古いものから削除して再保存
      while (updated.length > 1) {
        updated.pop();
        try {
          window.localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
          return entry;
        } catch {
          // continue
        }
      }
    }
  }
  return entry;
}

export function removeSavedAnalysis(id: string): void {
  const all = listSavedAnalyses();
  const updated = all.filter((a) => a.id !== id);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
}
