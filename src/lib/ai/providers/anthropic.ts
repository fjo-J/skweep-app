import type { AIProvider, AnalysisInput, AnalysisOutput } from "../types";
import { buildMockAnalysis } from "../mock-analysis";

/**
 * Anthropic (Claude) プロバイダのスタブ。
 *
 * Phase 7 以降では @anthropic-ai/sdk を導入し、列メタ・統計のみを Messages API に送る。
 * 例: claude-haiku-4-5, claude-sonnet-4-6 など。
 */
export class AnthropicProvider implements AIProvider {
  readonly name = "anthropic";

  constructor(public readonly model: string) {}

  async analyzeSchema(input: AnalysisInput): Promise<AnalysisOutput> {
    const startedAt = Date.now();
    // Phase 7: ここで Anthropic Messages API を呼ぶ。
    await new Promise((r) => setTimeout(r, 50));
    return buildMockAnalysis(input, {
      provider: this.name,
      model: this.model,
      startedAt,
    });
  }
}
