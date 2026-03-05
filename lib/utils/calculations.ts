import { toCNY } from "./currency";

export type CategoryKey = "cash" | "stock" | "realestate" | "crypto";

export interface Asset {
  id: string;
  user_id: string;
  name: string;
  category: CategoryKey;
  value: number;
  currency: string;
  note?: string | null;
  is_auto_synced: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryTotal {
  category: CategoryKey;
  totalCNY: number;
  count: number;
  percentage: number;
}

export interface NetWorthHistory {
  id: string;
  user_id: string;
  total_cny: number;
  snapshot_date: string;
  created_at: string;
}

/**
 * Calculate total net worth in CNY.
 */
export function calcNetWorth(
  assets: Asset[],
  rates: Record<string, number>
): number {
  return assets.reduce((sum, asset) => {
    return sum + toCNY(asset.value, asset.currency, rates);
  }, 0);
}

/**
 * Calculate per-category totals and percentages.
 */
export function calcCategoryTotals(
  assets: Asset[],
  rates: Record<string, number>
): CategoryTotal[] {
  const categories: CategoryKey[] = ["cash", "stock", "realestate", "crypto"];
  const totalCNY = calcNetWorth(assets, rates);

  return categories.map((cat) => {
    const catAssets = assets.filter((a) => a.category === cat);
    const catTotal = catAssets.reduce(
      (sum, a) => sum + toCNY(a.value, a.currency, rates),
      0
    );
    return {
      category: cat,
      totalCNY: catTotal,
      count: catAssets.length,
      percentage: totalCNY > 0 ? (catTotal / totalCNY) * 100 : 0,
    };
  });
}

/**
 * Calculate month-over-month change from history.
 * Returns { absolute: CNY change, percent: % change } or null if not enough data.
 */
export function calcMonthlyChange(
  history: NetWorthHistory[]
): { absolute: number; percent: number } | null {
  if (history.length < 2) return null;

  const sorted = [...history].sort(
    (a, b) =>
      new Date(b.snapshot_date).getTime() - new Date(a.snapshot_date).getTime()
  );

  // Find the most recent and the one closest to 30 days ago
  const latest = sorted[0];
  const thirtyDaysAgo = new Date(latest.snapshot_date);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Find closest history point to 30 days ago
  let closest = sorted[sorted.length - 1];
  let minDiff = Infinity;
  for (const h of sorted.slice(1)) {
    const diff = Math.abs(
      new Date(h.snapshot_date).getTime() - thirtyDaysAgo.getTime()
    );
    if (diff < minDiff) {
      minDiff = diff;
      closest = h;
    }
  }

  const absolute = latest.total_cny - closest.total_cny;
  const percent =
    closest.total_cny > 0 ? (absolute / closest.total_cny) * 100 : 0;

  return { absolute, percent };
}

/**
 * Prepare data for the trend chart.
 */
export function prepTrendData(
  history: NetWorthHistory[],
  displayCurrency: string,
  rates: Record<string, number>
) {
  const rate =
    displayCurrency === "CNY" ? 1 : (rates[displayCurrency] ?? 1);

  return [...history]
    .sort(
      (a, b) =>
        new Date(a.snapshot_date).getTime() -
        new Date(b.snapshot_date).getTime()
    )
    .map((h) => ({
      date: h.snapshot_date,
      label: formatDateLabel(h.snapshot_date),
      value: displayCurrency === "CNY" ? h.total_cny : h.total_cny / rate,
    }));
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const CATEGORY_COLORS: Record<CategoryKey, string> = {
  cash:        "#007AFF",
  stock:       "#34C759",
  realestate:  "#FF9500",
  crypto:      "#AF52DE",
};
