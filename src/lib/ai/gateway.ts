import type { AIProvider } from "./types";
import { AnthropicProvider } from "./providers/anthropic";
import { GeminiProvider } from "./providers/gemini";
import { OpenAIProvider } from "./providers/openai";

export type ProviderKey = "openai" | "anthropic" | "gemini";

/**
 * デフォルト値。本番運用で適切なモデルに上書きすること。
 */
const DEFAULTS: Record<ProviderKey, string> = {
  openai: "gpt-4.1-mini",
  anthropic: "claude-haiku-4-5",
  gemini: "gemini-2.0-flash",
};

/**
 * 環境変数からプロバイダを構築するファクトリ。
 *
 *   AI_PROVIDER=openai|anthropic|gemini
 *   AI_MODEL=<provider 固有のモデル ID>
 *
 * いずれも未指定の場合は anthropic + claude-haiku-4-5 にフォールバックする。
 */
export function getAIProvider(): AIProvider {
  const providerKey = normalizeProvider(process.env.AI_PROVIDER);
  const model = process.env.AI_MODEL?.trim() || DEFAULTS[providerKey];

  switch (providerKey) {
    case "openai":
      return new OpenAIProvider(model);
    case "anthropic":
      return new AnthropicProvider(model);
    case "gemini":
      return new GeminiProvider(model);
  }
}

function normalizeProvider(value: string | undefined): ProviderKey {
  const v = value?.trim().toLowerCase();
  if (v === "openai" || v === "anthropic" || v === "gemini") return v;
  return "anthropic";
}
