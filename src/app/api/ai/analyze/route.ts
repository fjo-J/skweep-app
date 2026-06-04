import { NextResponse } from "next/server";
import { z } from "zod";

import { getAIProvider } from "@/lib/ai/gateway";
import type { AnalysisInput } from "@/lib/ai/types";

export const runtime = "nodejs";

const ColumnStatsSchema = z
  .object({
    count: z.number().int().nonnegative().optional(),
    distinct: z.number().int().nonnegative().optional(),
    nullCount: z.number().int().nonnegative().optional(),
    min: z.union([z.string(), z.number()]).optional(),
    max: z.union([z.string(), z.number()]).optional(),
    mean: z.number().optional(),
    median: z.number().optional(),
    stddev: z.number().optional(),
  })
  .strict()
  .optional();

const ColumnMetaSchema = z
  .object({
    name: z.string().min(1).max(200),
    type: z.enum([
      "string",
      "number",
      "integer",
      "date",
      "boolean",
      "unknown",
    ]),
    stats: ColumnStatsSchema,
    samples: z.array(z.string().max(200)).max(5).optional(),
  })
  .strict();

const AnalysisInputSchema = z
  .object({
    filename: z.string().min(1).max(255),
    rowCount: z.number().int().nonnegative(),
    columns: z.array(ColumnMetaSchema).min(1).max(200),
    locale: z.string().max(10).optional(),
  })
  .strict();

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { error: "INVALID_JSON", message: "リクエストボディが JSON ではありません" },
      { status: 400 }
    );
  }

  const parsed = AnalysisInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "INVALID_INPUT",
        message: "入力スキーマと一致しません",
        issues: parsed.error.issues,
      },
      { status: 422 }
    );
  }

  const input: AnalysisInput = parsed.data;

  try {
    const provider = getAIProvider();
    const output = await provider.analyzeSchema(input);
    return NextResponse.json(output, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "PROVIDER_ERROR", message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      error: "METHOD_NOT_ALLOWED",
      message:
        "POST してください。Body は AnalysisInput (列名・型・統計・サンプル行) のみを含めること。",
    },
    { status: 405 }
  );
}
