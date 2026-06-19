/**
 * PII (Personally Identifiable Information) を伏字化する。
 * AI 提供事業者に列メタを送信する前に、サンプル行に対して適用する。
 *
 * - メールアドレス  -> ***@***.***
 * - クレジットカード番号風 (4-4-4-4) -> ****-****-****-****
 * - 電話番号風       -> ***-****-****
 * - 長い数字列 (10 桁以上) -> ***
 */

const EMAIL_RE = /[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}/g;
const CARD_RE = /\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b/g;
const PHONE_RE = /\b\d{2,4}[ -]?\d{2,4}[ -]?\d{3,4}\b/g;
const LONG_NUM_RE = /\b\d{10,}\b/g;

export function maskPii(value: string): string {
  return value
    .replace(EMAIL_RE, "***@***.***")
    .replace(CARD_RE, "****-****-****-****")
    .replace(PHONE_RE, "***-****-****")
    .replace(LONG_NUM_RE, "***");
}

/** 列名から PII 系っぽい列を判定する (氏名・住所・電話・メールなど) */
const SENSITIVE_NAME_PATTERNS = [
  /name|氏名|お名前|なまえ/i,
  /email|mail|メール|アドレス/i,
  /phone|tel|電話|携帯/i,
  /address|住所|所在地/i,
  /card|カード番号/i,
  /password|パスワード/i,
];

export function isSensitiveColumnName(name: string): boolean {
  return SENSITIVE_NAME_PATTERNS.some((re) => re.test(name));
}
