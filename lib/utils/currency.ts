export type CurrencyCode =
  | "CNY"
  | "USD"
  | "HKD"
  | "EUR"
  | "GBP"
  | "AUD"
  | "BTC"
  | "ETH";

export const CURRENCIES: Record<
  CurrencyCode,
  { symbol: string; name: string; nameZh: string; isCrypto?: boolean }
> = {
  CNY: { symbol: "¥",   name: "Chinese Yuan",     nameZh: "人民币" },
  USD: { symbol: "$",   name: "US Dollar",         nameZh: "美元" },
  HKD: { symbol: "HK$", name: "Hong Kong Dollar",  nameZh: "港元" },
  EUR: { symbol: "€",   name: "Euro",              nameZh: "欧元" },
  GBP: { symbol: "£",   name: "British Pound",     nameZh: "英镑" },
  AUD: { symbol: "A$",  name: "Australian Dollar", nameZh: "澳元" },
  BTC: { symbol: "₿",   name: "Bitcoin",           nameZh: "比特币", isCrypto: true },
  ETH: { symbol: "Ξ",   name: "Ethereum",          nameZh: "以太坊", isCrypto: true },
};

export const DISPLAY_CURRENCIES: CurrencyCode[] = [
  "CNY", "USD", "HKD", "EUR", "GBP", "AUD",
];

export const ALL_CURRENCIES: CurrencyCode[] = [
  "CNY", "USD", "HKD", "EUR", "GBP", "AUD", "BTC", "ETH",
];

/**
 * Convert a value in any currency to CNY.
 * rates: { USD: 7.25, HKD: 0.93, BTC: 450000, ... } — CNY per 1 unit
 */
export function toCNY(
  value: number,
  currency: string,
  rates: Record<string, number>
): number {
  if (currency === "CNY") return value;
  const rate = rates[currency];
  if (!rate) return value;
  return value * rate;
}

/**
 * Format a CNY value for display in the target currency.
 */
export function formatDisplay(
  cnyValue: number,
  displayCurrency: string,
  rates: Record<string, number>,
  lang = "en"
): string {
  const rate = displayCurrency === "CNY" ? 1 : (rates[displayCurrency] ?? 1);
  const val = displayCurrency === "CNY" ? cnyValue : cnyValue / rate;
  const sym =
    CURRENCIES[displayCurrency as CurrencyCode]?.symbol ?? displayCurrency;

  if (displayCurrency === "CNY") {
    if (val >= 1e8) return `${sym}${(val / 1e8).toFixed(2)}亿`;
    if (val >= 1e4) return `${sym}${(val / 1e4).toFixed(1)}万`;
    return `${sym}${Math.round(val).toLocaleString("en-US")}`;
  }

  if (displayCurrency === "BTC" || displayCurrency === "ETH") {
    return `${sym}${val.toFixed(4)}`;
  }

  if (val >= 1e6) return `${sym}${(val / 1e6).toFixed(2)}M`;
  if (val >= 1e3) return `${sym}${Math.round(val).toLocaleString("en-US")}`;
  return `${sym}${val.toFixed(0)}`;
}

/**
 * Short format for small labels (no M suffix, compact).
 */
export function formatShort(
  cnyValue: number,
  displayCurrency: string,
  rates: Record<string, number>
): string {
  const rate = displayCurrency === "CNY" ? 1 : (rates[displayCurrency] ?? 1);
  const val = displayCurrency === "CNY" ? cnyValue : cnyValue / rate;
  const sym =
    CURRENCIES[displayCurrency as CurrencyCode]?.symbol ?? displayCurrency;

  if (displayCurrency === "CNY") {
    if (val >= 1e8) return `${sym}${(val / 1e8).toFixed(1)}亿`;
    if (val >= 1e4) return `${sym}${(val / 1e4).toFixed(0)}万`;
    return `${sym}${Math.round(val).toLocaleString("en-US")}`;
  }
  if (val >= 1e6) return `${sym}${(val / 1e6).toFixed(1)}M`;
  if (val >= 1e3) return `${sym}${(val / 1e3).toFixed(0)}K`;
  return `${sym}${val.toFixed(0)}`;
}

/**
 * Format a raw value in its native currency (e.g. for asset list).
 */
export function formatNative(value: number, currency: string): string {
  const sym =
    CURRENCIES[currency as CurrencyCode]?.symbol ?? currency;

  if (currency === "BTC" || currency === "ETH") {
    return `${sym}${value.toFixed(4)}`;
  }
  if (currency === "CNY") {
    if (value >= 1e4) return `${sym}${(value / 1e4).toFixed(1)}万`;
    return `${sym}${value.toLocaleString("en-US")}`;
  }
  return `${sym}${value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format a percent change with sign.
 */
export function formatChange(pct: number): string {
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}
