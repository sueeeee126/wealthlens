"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n";
import { useFxRates } from "@/lib/hooks/useFxRates";
import { useNetWorthHistory } from "@/lib/hooks/useNetWorth";
import { prepTrendData, calcMonthlyChange } from "@/lib/utils/calculations";
import { formatDisplay, formatChange, type CurrencyCode } from "@/lib/utils/currency";
import TrendChart from "@/components/charts/TrendChart";
import CurrencyPicker from "@/components/ui/CurrencyPicker";
import type { User } from "@supabase/supabase-js";

export default function TrendsPage() {
  const { t, language } = useTranslation();
  const supabase = createClient();
  const isZh = language === "zh";

  const [user, setUser] = useState<User | null>(null);
  const [displayCurrency, setDisplayCurrency] = useState<CurrencyCode>("CNY");

  const { rates } = useFxRates();
  const { history, loading } = useNetWorthHistory(user?.id ?? null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase
          .from("profiles")
          .select("display_currency")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            if (data?.display_currency) {
              setDisplayCurrency(data.display_currency as CurrencyCode);
            }
          });
      }
    });
  }, []);

  async function handleCurrencyChange(cur: CurrencyCode) {
    setDisplayCurrency(cur);
    if (user) {
      await supabase.from("profiles").update({ display_currency: cur }).eq("id", user.id);
    }
  }

  const trendData = prepTrendData(history, displayCurrency, rates);
  const monthlyChange = calcMonthlyChange(history);

  // Build month-over-month list
  const monthlyList = (() => {
    if (history.length < 2) return [];
    const sorted = [...history].sort(
      (a, b) =>
        new Date(b.snapshot_date).getTime() - new Date(a.snapshot_date).getTime()
    );

    const result: {
      month: string;
      value: number;
      change: number | null;
      percent: number | null;
    }[] = [];

    // Group by month
    const byMonth: Record<string, number> = {};
    for (const h of sorted) {
      const key = h.snapshot_date.slice(0, 7); // YYYY-MM
      if (!byMonth[key]) byMonth[key] = h.total_cny;
    }

    const months = Object.keys(byMonth).sort().reverse();
    for (let i = 0; i < Math.min(months.length, 6); i++) {
      const curr = byMonth[months[i]];
      const prev = i + 1 < months.length ? byMonth[months[i + 1]] : null;
      const change = prev !== null ? curr - prev : null;
      const percent = prev && prev > 0 ? ((curr - prev) / prev) * 100 : null;
      result.push({
        month: months[i],
        value: curr,
        change,
        percent,
      });
    }
    return result;
  })();

  return (
    <div className={`min-h-screen ${isZh ? "lang-zh" : ""}`} style={{ background: "#F2F2F7" }}>
      {/* Header */}
      <div className="px-4 pt-14 pb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ color: "#1C1C1E" }}>
          {t.trends.title}
        </h1>
        <CurrencyPicker value={displayCurrency} onChange={handleCurrencyChange} />
      </div>

      <div className="px-4 space-y-4">
        {/* Trend chart card */}
        <div
          className="rounded-3xl p-5"
          style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-medium" style={{ color: "#8E8E93" }}>
                {t.netWorth}
              </p>
              {history.length > 0 && (
                <p
                  className="text-lg font-bold font-numeric"
                  style={{ color: "#1C1C1E", letterSpacing: "-0.5px" }}
                >
                  {formatDisplay(
                    history[history.length - 1]?.total_cny ?? 0,
                    displayCurrency,
                    rates
                  )}
                </p>
              )}
            </div>
            {monthlyChange && (
              <div
                className="px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{
                  background:
                    monthlyChange.percent >= 0
                      ? "rgba(52,199,89,0.12)"
                      : "rgba(255,59,48,0.12)",
                  color: monthlyChange.percent >= 0 ? "#34C759" : "#FF3B30",
                }}
              >
                {formatChange(monthlyChange.percent)}
              </div>
            )}
          </div>

          {loading ? (
            <div className="skeleton h-48 rounded-2xl" />
          ) : (
            <TrendChart
              data={trendData}
              displayCurrency={displayCurrency}
              rates={rates}
              color="#007AFF"
            />
          )}
        </div>

        {/* Monthly changes list */}
        {monthlyList.length > 0 && (
          <div
            className="rounded-3xl overflow-hidden"
            style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
          >
            <div className="px-4 pt-4 pb-1">
              <h2 className="text-sm font-bold" style={{ color: "#1C1C1E" }}>
                {t.trends.monthlyChanges}
              </h2>
            </div>
            {monthlyList.map((m, i) => {
              const [year, mon] = m.month.split("-");
              const date = new Date(parseInt(year), parseInt(mon) - 1, 1);
              const monthLabel = date.toLocaleDateString(
                isZh ? "zh-CN" : "en-US",
                { month: "long", year: "numeric" }
              );

              return (
                <div
                  key={m.month}
                  className="flex items-center justify-between px-4 py-3.5"
                  style={{
                    borderTop: i === 0 ? "none" : "1px solid #F2F2F7",
                  }}
                >
                  <span className="text-sm" style={{ color: "#1C1C1E" }}>
                    {monthLabel}
                  </span>
                  <div className="text-right">
                    <div
                      className="text-sm font-semibold font-numeric"
                      style={{ color: "#1C1C1E" }}
                    >
                      {formatDisplay(m.value, displayCurrency, rates)}
                    </div>
                    {m.change !== null && m.percent !== null && (
                      <div
                        className="text-xs font-numeric"
                        style={{
                          color: m.change >= 0 ? "#34C759" : "#FF3B30",
                        }}
                      >
                        {m.change >= 0 ? "+" : ""}
                        {formatDisplay(Math.abs(m.change), displayCurrency, rates)}{" "}
                        ({formatChange(m.percent)})
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* History count info */}
        <p className="text-center text-xs pb-2" style={{ color: "#C7C7CC" }}>
          {isZh
            ? `共 ${history.length} 天记录`
            : `${history.length} day${history.length !== 1 ? "s" : ""} tracked`}
        </p>
      </div>
    </div>
  );
}
