import type { AIProvider, AnalysisInput, AnalysisOutput } from "../types";
import { buildMockAnalysis } from "../mock-analysis";

/**
 * OpenAI プロバイダのスタブ。
 *
 * Phase 7 以降では openai SDK を導入し、列メタ・統計のみを Chat Completion に送る。
 * 例: gpt-4.1-mini, gpt-4o-mini など。
 */
export class OpenAIProvider implements AIProvider {
  readonly name = "openai";

  constructor(public readonly model: string) {}

  async analyzeSchema(input: AnalysisInput): Promise<AnalysisOutput> {
    const startedAt = Date.now();
    // Phase 7: ここで OpenAI API を呼ぶ。列名・型・統計・サンプルのみを送信する。
    await new Promise((r) => setTimeout(r, 50));
    return buildMockAnalysis(input, {
      provider: this.name,
      model: this.model,
      startedAt,
    });
  }
}
