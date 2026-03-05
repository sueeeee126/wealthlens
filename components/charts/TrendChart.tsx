"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatShort } from "@/lib/utils/currency";
import { useTranslation } from "@/lib/i18n";

interface TrendDataPoint {
  date: string;
  label: string;
  value: number;
}

interface TrendChartProps {
  data: TrendDataPoint[];
  displayCurrency: string;
  rates: Record<string, number>;
  color?: string;
}

export default function TrendChart({
  data,
  displayCurrency,
  rates,
  color = "#007AFF",
}: TrendChartProps) {
  const { t } = useTranslation();

  if (data.length < 2) {
    return (
      <div
        className="flex flex-col items-center justify-center h-48 rounded-2xl px-8 text-center"
        style={{ background: "#F2F2F7" }}
      >
        <div className="text-2xl mb-2">📈</div>
        <p className="text-sm" style={{ color: "#8E8E93" }}>
          {t.trends.noData}
        </p>
      </div>
    );
  }

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="px-3 py-2 rounded-xl text-sm"
          style={{
            background: "rgba(28,28,30,0.9)",
            color: "#FFFFFF",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          <div className="text-xs opacity-60 mb-0.5">{label}</div>
          <div className="font-semibold">
            {formatShort(
              displayCurrency === "CNY" ? payload[0].value : payload[0].value,
              displayCurrency,
              rates
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 10, right: 4, left: 4, bottom: 0 }}>
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.04)" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: "#8E8E93" }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#8E8E93" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) =>
            formatShort(
              displayCurrency === "CNY" ? v : v,
              displayCurrency,
              rates
            )
          }
          width={48}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2.5}
          fill="url(#trendGradient)"
          dot={false}
          activeDot={{ r: 5, fill: color, strokeWidth: 2, stroke: "#fff" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
