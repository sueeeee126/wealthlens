"use client";

import type { CategoryKey, CategoryTotal } from "@/lib/utils/calculations";
import { CATEGORY_COLORS } from "@/lib/utils/calculations";
import { formatDisplay } from "@/lib/utils/currency";
import { useTranslation } from "@/lib/i18n";

interface CategoryCardProps {
  data: CategoryTotal;
  rates: Record<string, number>;
  displayCurrency: string;
}

const CATEGORY_EMOJI: Record<CategoryKey, string> = {
  cash:       "🏦",
  stock:      "📈",
  realestate: "🏠",
  crypto:     "₿",
};

const CATEGORY_BG: Record<CategoryKey, string> = {
  cash:        "rgba(0,122,255,0.10)",
  stock:       "rgba(52,199,89,0.10)",
  realestate:  "rgba(255,149,0,0.10)",
  crypto:      "rgba(175,82,222,0.10)",
};

export default function CategoryCard({ data, rates, displayCurrency }: CategoryCardProps) {
  const { t } = useTranslation();
  const color = CATEGORY_COLORS[data.category];
  const bg = CATEGORY_BG[data.category];
  const emoji = CATEGORY_EMOJI[data.category];
  const label = t.categories[data.category];

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{
        background: "#FFFFFF",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
          style={{ background: bg }}
        >
          {emoji}
        </div>
        <span className="text-xs font-semibold" style={{ color: "#8E8E93" }}>
          {label}
        </span>
      </div>

      <div>
        <div
          className="text-base font-bold font-numeric leading-tight"
          style={{ color: "#1C1C1E" }}
        >
          {data.totalCNY > 0
            ? formatDisplay(data.totalCNY, displayCurrency, rates)
            : "—"}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div
            className="h-1 rounded-full flex-1"
            style={{ background: "#E5E5EA" }}
          >
            <div
              className="h-1 rounded-full transition-all duration-700"
              style={{
                background: color,
                width: `${Math.min(data.percentage, 100)}%`,
              }}
            />
          </div>
          <span className="text-xs font-medium" style={{ color: "#8E8E93" }}>
            {data.percentage.toFixed(0)}%
          </span>
        </div>
      </div>

      <div className="text-xs" style={{ color: "#8E8E93" }}>
        {data.count} {data.count === 1 ? "asset" : "assets"}
      </div>
    </div>
  );
}
