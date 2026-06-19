/**
 * ブラウザ側で Excel / CSV をパースし、AI Gateway 用の AnalysisInput に変換する。
 *
 * 重要な設計判断:
 *  - すべてブラウザ上で処理する (ファイル本体はサーバーに送らない)
 *  - 大規模ファイルでも応答性を保つため、解析対象は先頭 1000 行に絞る
 *  - サンプル行は PII マスキングをかけてから返す
 *  - 列数は 200 を上限とする (API スキーマと一致)
 */

import * as XLSX from "xlsx";
import Papa from "papaparse";

import type {
  AnalysisInput,
  ColumnMeta,
  ColumnStats,
  ColumnType,
} from "@/lib/ai/types";
import { isSensitiveColumnName, maskPii } from "@/lib/pii-mask";

const ROW_LIMIT_FOR_ANALYSIS = 1000;
const SAMPLE_LIMIT_PER_COLUMN = 5;
const COLUMN_LIMIT = 200;

export type ParseResult = {
  input: AnalysisInput;
  totalRowCount: number;
  truncated: boolean;
};

export async function parseFileToAnalysisInput(
  file: File
): Promise<ParseResult> {
  const lower = file.name.toLowerCase();
  const ext = lower.slice(lower.lastIndexOf("."));

  const rows =
    ext === ".csv"
      ? await parseCsv(file)
      : await parseExcel(file);

  const totalRowCount = rows.length;
  const truncated = totalRowCount > ROW_LIMIT_FOR_ANALYSIS;
  const limited = truncated ? rows.slice(0, ROW_LIMIT_FOR_ANALYSIS) : rows;

  const columns = extractColumns(limited);

  return {
    input: {
      filename: file.name,
      rowCount: totalRowCount,
      columns,
      locale: "ja",
    },
    totalRowCount,
    truncated,
  };
}

async function parseCsv(file: File): Promise<Record<string, unknown>[]> {
  const text = await file.text();
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, unknown>>(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      worker: false,
      complete: (result) => resolve(result.data),
      error: (err: Error) => reject(err),
    });
  });
}

async function parseExcel(file: File): Promise<Record<string, unknown>[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    raw: true,
    defval: null,
  });
}

function extractColumns(rows: Record<string, unknown>[]): ColumnMeta[] {
  if (rows.length === 0) return [];

  // 列名を最初の行から取得 (どの行にも欠損があり得るので 1〜10 行を見て補完)
  const nameSet = new Set<string>();
  for (const row of rows.slice(0, 10)) {
    for (const key of Object.keys(row)) nameSet.add(key);
  }
  const names = Array.from(nameSet).slice(0, COLUMN_LIMIT);

  return names.map((name) => {
    const isSensitive = isSensitiveColumnName(name);

    // 値を抽出 (null/空文字を除外)
    const raw = rows
      .map((r) => r[name])
      .filter((v) => v !== null && v !== undefined && v !== "");

    const type = inferType(raw);
    const stats = computeStats(raw, type);
    const samples = pickSamples(raw, type, isSensitive);

    return {
      name,
      type,
      stats,
      samples,
    };
  });
}

function inferType(values: unknown[]): ColumnType {
  if (values.length === 0) return "unknown";

  const sample = values.slice(0, 200);

  // Date 判定: Date オブジェクトを XLSX が返した場合
  if (sample.every((v) => v instanceof Date)) return "date";

  // 数値判定
  const isNumeric = sample.every((v) => {
    if (typeof v === "number") return Number.isFinite(v);
    if (typeof v === "string") {
      const n = Number(v.replace(/,/g, ""));
      return v.trim() !== "" && Number.isFinite(n);
    }
    return false;
  });
  if (isNumeric) {
    const allInt = sample.every((v) => {
      const n = typeof v === "number" ? v : Number(String(v).replace(/,/g, ""));
      return Number.isInteger(n);
    });
    return allInt ? "integer" : "number";
  }

  // boolean 判定
  const boolTokens = new Set([
    "true",
    "false",
    "yes",
    "no",
    "y",
    "n",
    "0",
    "1",
    "はい",
    "いいえ",
    "有",
    "無",
    "ある",
    "ない",
  ]);
  const isBoolean = sample.every((v) => {
    if (typeof v === "boolean") return true;
    return boolTokens.has(String(v).trim().toLowerCase());
  });
  if (isBoolean) return "boolean";

  // 日付文字列判定 (ゆるい)
  const isDateString = sample.every((v) => {
    if (typeof v !== "string") return false;
    if (!/[\d]/.test(v)) return false;
    const d = Date.parse(v);
    if (Number.isNaN(d)) return false;
    return /[\-\/年月日]/.test(v);
  });
  if (isDateString) return "date";

  return "string";
}

function computeStats(values: unknown[], type: ColumnType): ColumnStats {
  const count = values.length;
  const distinct = new Set(values.map((v) => String(v))).size;
  const stats: ColumnStats = { count, distinct };

  if (type === "number" || type === "integer") {
    const nums = values
      .map((v) => (typeof v === "number" ? v : Number(String(v).replace(/,/g, ""))))
      .filter((n) => Number.isFinite(n));
    if (nums.length > 0) {
      stats.min = Math.min(...nums);
      stats.max = Math.max(...nums);
      stats.mean = nums.reduce((a, b) => a + b, 0) / nums.length;
    }
  }

  return stats;
}

function pickSamples(
  values: unknown[],
  type: ColumnType,
  isSensitive: boolean
): string[] {
  if (values.length === 0) return [];

  // 多様性を確保するため、distinct な値の中から最大 5 件
  const seen = new Set<string>();
  const picks: string[] = [];
  for (const v of values) {
    const str = formatValue(v, type);
    if (seen.has(str)) continue;
    seen.add(str);
    const safe = isSensitive ? "***" : maskPii(str);
    picks.push(safe.length > 200 ? safe.slice(0, 200) : safe);
    if (picks.length >= SAMPLE_LIMIT_PER_COLUMN) break;
  }
  return picks;
}

function formatValue(v: unknown, type: ColumnType): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "boolean") return v ? "true" : "false";
  if (type === "number" || type === "integer") {
    const n = typeof v === "number" ? v : Number(String(v).replace(/,/g, ""));
    return Number.isFinite(n) ? String(n) : String(v);
  }
  return String(v);
}
