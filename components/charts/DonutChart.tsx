"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { CategoryTotal } from "@/lib/utils/calculations";
import { CATEGORY_COLORS } from "@/lib/utils/calculations";
import { formatDisplay } from "@/lib/utils/currency";
import { useTranslation } from "@/lib/i18n";

interface DonutChartProps {
  categories: CategoryTotal[];
  rates: Record<string, number>;
  displayCurrency: string;
  totalCNY: number;
}

export default function DonutChart({
  categories,
  rates,
  displayCurrency,
  totalCNY,
}: DonutChartProps) {
  const { t } = useTranslation();

  const data = categories
    .filter((c) => c.totalCNY > 0)
    .map((c) => ({
      name: t.categories[c.category],
      value: c.totalCNY,
      color: CATEGORY_COLORS[c.category],
      percentage: c.percentage,
    }));

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-40 rounded-2xl"
        style={{ background: "#F2F2F7" }}
      >
        <p className="text-sm" style={{ color: "#8E8E93" }}>
          {t.noAssets}
        </p>
      </div>
    );
  }

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; payload: { color: string; percentage: number } }>;
  }) => {
    if (active && payload && payload.length) {
      const d = payload[0];
      return (
        <div
          className="px-3 py-2 rounded-xl text-sm"
          style={{
            background: "rgba(28,28,30,0.9)",
            color: "#FFFFFF",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          <div className="font-semibold">{d.name}</div>
          <div className="text-xs opacity-70">
            {formatDisplay(d.value, displayCurrency, rates)} · {d.payload.percentage.toFixed(1)}%
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Center label */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
      >
        <div className="text-xs font-medium" style={{ color: "#8E8E93" }}>
          {t.allocation}
        </div>
        <div className="text-sm font-bold" style={{ color: "#1C1C1E" }}>
          {formatDisplay(totalCNY, displayCurrency, rates)}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: d.color }}
            />
            <span className="text-xs" style={{ color: "#8E8E93" }}>
              {d.name}
            </span>
            <span className="text-xs font-semibold" style={{ color: "#1C1C1E" }}>
              {d.percentage.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
