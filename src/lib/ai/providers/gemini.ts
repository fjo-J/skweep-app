import type { AIProvider, AnalysisInput, AnalysisOutput } from "../types";
import { buildMockAnalysis } from "../mock-analysis";

/**
 * Google Gemini プロバイダのスタブ。
 *
 * Phase 7 以降では @google/generative-ai を導入し、列メタ・統計のみを GenerateContent に送る。
 * 例: gemini-1.5-flash, gemini-2.0-flash など。
 */
export class GeminiProvider implements AIProvider {
  readonly name = "gemini";

  constructor(public readonly model: string) {}

  async analyzeSchema(input: AnalysisInput): Promise<AnalysisOutput> {
    const startedAt = Date.now();
    // Phase 7: ここで Gemini API を呼ぶ。
    await new Promise((r) => setTimeout(r, 50));
    return buildMockAnalysis(input, {
      provider: this.name,
      model: this.model,
      startedAt,
    });
  }
}
