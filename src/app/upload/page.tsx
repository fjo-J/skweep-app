"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  FileSpreadsheet,
  Loader2,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ACCEPTED_EXTENSIONS = [".xlsx", ".xls", ".csv"] as const;
const ACCEPT_ATTR = ACCEPTED_EXTENSIONS.join(",");
const MAX_BYTES = 20 * 1024 * 1024; // 20 MB

type SelectedFile = {
  name: string;
  size: number;
  ext: string;
  file: File;
};

export default function UploadPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<SelectedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadName, setLeadName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("skweep:lead");
      if (!raw) return;
      const parsed = JSON.parse(raw) as { fullName?: string };
      if (parsed?.fullName) setLeadName(parsed.fullName);
    } catch {
      // ignore
    }
  }, []);

  const validateAndSet = useCallback((file: File | undefined | null) => {
    setError(null);
    if (!file) return;

    const lower = file.name.toLowerCase();
    const ext = lower.slice(lower.lastIndexOf("."));
    if (!ACCEPTED_EXTENSIONS.includes(ext as (typeof ACCEPTED_EXTENSIONS)[number])) {
      setError(
        `対応していないファイル形式です。${ACCEPTED_EXTENSIONS.join(" / ")} をアップロードしてください。`
      );
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(
        `ファイルサイズが上限を超えています(${formatBytes(file.size)})。20MB 以下のファイルをアップロードしてください。`
      );
      return;
    }

    setSelected({ name: file.name, size: file.size, ext, file });
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files?.[0];
      validateAndSet(file);
    },
    [validateAndSet]
  );

  const onPick = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      validateAndSet(file);
      if (inputRef.current) inputRef.current.value = "";
    },
    [validateAndSet]
  );

  const remove = useCallback(() => {
    setSelected(null);
    setError(null);
  }, []);

  const onAnalyze = useCallback(async () => {
    if (!selected) return;
    setIsSubmitting(true);
    setError(null);
    try {
      // 1) アップロードメタ情報を保存 (互換性のため既存キーを残す)
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "skweep:upload",
          JSON.stringify({
            name: selected.name,
            size: selected.size,
            ext: selected.ext,
            uploadedAt: new Date().toISOString(),
          })
        );
      }

      // 2) ブラウザでファイルをパース (列メタ + サンプル抽出 + PII マスク)
      const { parseFileToAnalysisInput } = await import(
        "@/lib/file-parser"
      );
      const { input, totalRowCount, truncated } =
        await parseFileToAnalysisInput(selected.file);

      if (input.columns.length === 0) {
        throw new Error(
          "解析できる列が見つかりませんでした。1 行目に列名があるファイルをアップロードしてください。"
        );
      }

      // 3) サーバーの AI Gateway に列メタのみ送信
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          message?: string;
          error?: string;
        } | null;
        throw new Error(
          data?.message ?? data?.error ?? `解析 API が失敗しました (${res.status})`
        );
      }
      const output = (await res.json()) as import(
        "@/lib/ai/types"
      ).AnalysisOutput;

      // 4) 解析結果を localStorage に保存
      const { setCurrentAnalysis } = await import("@/lib/analysis-store");
      setCurrentAnalysis({
        filename: selected.name,
        totalRowCount,
        truncated,
        output,
        analyzedAt: new Date().toISOString(),
      });

      // 5) /dashboards へ遷移
      router.push("/dashboards");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "解析中に予期しないエラーが発生しました。";
      setError(message);
      setIsSubmitting(false);
    }
  }, [router, selected]);

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-12rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-sky-200/50 via-indigo-200/30 to-transparent blur-3xl" />
      </div>

      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-semibold tracking-tight">Skweep</span>
          </Link>
          <Link
            href="/start"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            前のステップ
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto flex max-w-2xl flex-col px-6 py-16">
          <div className="text-center">
            <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              STEP 2 / 3 ・ ファイルアップロード
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              {leadName ? `${leadName} さん、` : ""}Excel か CSV を
              <br className="sm:hidden" />
              アップロードしてください
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              .xlsx / .xls / .csv に対応。
              ドラッグ & ドロップでも、ボタンからの選択でも OK です。
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-background p-7 shadow-sm sm:p-8">
            {selected ? (
              <SelectedFileCard
                file={selected}
                onRemove={remove}
                onAnalyze={onAnalyze}
                isSubmitting={isSubmitting}
              />
            ) : (
              <Dropzone
                isDragging={isDragging}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onPickClick={() => inputRef.current?.click()}
              />
            )}

            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT_ATTR}
              className="hidden"
              onChange={onPick}
            />

            {error ? (
              <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs leading-relaxed text-emerald-900">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <div className="space-y-1">
                <p className="font-semibold">あなたのファイルは Skweep に保存されません</p>
                <p>
                  ファイル本体はお客様のブラウザのメモリ内にのみ保持されます。AI に送信されるのは
                  <span className="font-medium">列名・型・統計値・先頭 5 件のサンプル行のみ</span>
                  で、セル単位の生データは外部に送られません。
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border bg-background p-3 text-xs text-muted-foreground">
              <span>処理は日本リージョン (Vercel 東京) で実行されます。</span>
              <Link
                href="/security"
                className="inline-flex shrink-0 items-center gap-1 text-sky-600 underline-offset-2 hover:underline"
              >
                詳しいセキュリティ
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Dropzone({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onPickClick,
}: {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onPickClick: () => void;
}) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onPickClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPickClick();
        }
      }}
      className={cn(
        "group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition outline-none",
        "border-border hover:border-foreground/40 hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        isDragging && "border-foreground/60 bg-muted/60"
      )}
    >
      <div
        className={cn(
          "inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-500 text-white shadow-sm transition",
          isDragging && "scale-110"
        )}
      >
        <UploadCloud className="h-7 w-7" />
      </div>
      <p className="mt-5 text-base font-semibold">
        ファイルをドラッグ & ドロップ
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        または <span className="text-foreground underline-offset-2 group-hover:underline">クリックして選択</span>
      </p>
      <p className="mt-5 text-xs text-muted-foreground">
        対応形式: .xlsx / .xls / .csv ・ 最大 20MB
      </p>
    </div>
  );
}

function SelectedFileCard({
  file,
  onRemove,
  onAnalyze,
  isSubmitting,
}: {
  file: SelectedFile;
  onRemove: () => void;
  onAnalyze: () => void;
  isSubmitting: boolean;
}) {
  return (
    <div>
      <div className="flex items-start gap-4 rounded-xl border border-border bg-muted/30 p-4">
        <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-foreground text-background">
          <FileSpreadsheet className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold" title={file.name}>
            {file.name}
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center rounded-md bg-background px-1.5 py-0.5 ring-1 ring-border">
              {file.ext.replace(".", "").toUpperCase()}
            </span>
            <span>{formatBytes(file.size)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label="ファイルを削除"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={onAnalyze}
        disabled={isSubmitting}
        className={cn(
          buttonVariants({ size: "lg" }),
          "mt-6 w-full disabled:opacity-70"
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            解析を準備中…
          </>
        ) : (
          <>
            解析を開始する
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function Logo() {
  return (
    <span
      aria-hidden
      className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-500 text-white shadow-sm"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-4 w-4"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 18 L10 12 L14 16 L20 8" />
        <path d="M14 8 H20 V14" />
      </svg>
    </span>
  );
}
