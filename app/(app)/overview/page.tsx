"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n";
import { useFxRates } from "@/lib/hooks/useFxRates";
import { useAssets } from "@/lib/hooks/useAssets";
import { useNetWorthHistory } from "@/lib/hooks/useNetWorth";
import {
  calcNetWorth,
  calcCategoryTotals,
  calcMonthlyChange,
} from "@/lib/utils/calculations";
import { formatDisplay, formatChange, type CurrencyCode } from "@/lib/utils/currency";
import CurrencyPicker from "@/components/ui/CurrencyPicker";
import CategoryCard from "@/components/ui/CategoryCard";
import DonutChart from "@/components/charts/DonutChart";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/supabase/types";

export default function OverviewPage() {
  const { t, language } = useTranslation();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayCurrency, setDisplayCurrency] = useState<CurrencyCode>("CNY");

  const { rates, loading: ratesLoading } = useFxRates();
  const { assets, loading: assetsLoading } = useAssets(user?.id ?? null);
  const { history, snapshot } = useNetWorthHistory(user?.id ?? null);

  // Fetch user & profile
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setProfile(data as Profile);
          setDisplayCurrency(data.display_currency as CurrencyCode);
        }
      });
  }, [user]);

  async function handleCurrencyChange(cur: CurrencyCode) {
    setDisplayCurrency(cur);
    if (user) {
      await supabase
        .from("profiles")
        .update({ display_currency: cur })
        .eq("id", user.id);
    }
  }

  // Calculate net worth
  const totalCNY = calcNetWorth(assets, rates);
  const categories = calcCategoryTotals(assets, rates);
  const monthlyChange = calcMonthlyChange(history);

  // Snapshot on page load
  useEffect(() => {
    if (user && !assetsLoading && !ratesLoading && totalCNY > 0) {
      snapshot(user.id, totalCNY);
    }
  }, [user, totalCNY, assetsLoading, ratesLoading]);

  const isLoading = assetsLoading || ratesLoading;
  const isZh = language === "zh";

  return (
    <div className={`min-h-screen ${isZh ? "lang-zh" : ""}`} style={{ background: "#F2F2F7" }}>
      {/* Header */}
      <div className="px-4 pt-14 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-xs font-medium" style={{ color: "#8E8E93" }}>
              {profile?.display_name
                ? isZh ? `${profile.display_name}的` : `${profile.display_name}'s`
                : ""}{" "}
              {t.netWorth}
            </p>
          </div>
          <CurrencyPicker
            value={displayCurrency}
            onChange={handleCurrencyChange}
          />
        </div>

        {isLoading ? (
          <div className="skeleton h-10 w-48 mb-1" />
        ) : (
          <div
            className="font-numeric"
            style={{
              fontSize: "36px",
              fontWeight: 800,
              letterSpacing: "-1.5px",
              color: "#1C1C1E",
              lineHeight: 1.1,
            }}
          >
            {formatDisplay(totalCNY, displayCurrency, rates)}
          </div>
        )}

        {monthlyChange && (
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="text-sm font-semibold"
              style={{ color: monthlyChange.absolute >= 0 ? "#34C759" : "#FF3B30" }}
            >
              {monthlyChange.absolute >= 0 ? "↑" : "↓"}{" "}
              {formatChange(monthlyChange.percent)}
            </span>
            <span className="text-xs" style={{ color: "#8E8E93" }}>
              {t.monthlyChange}
            </span>
          </div>
        )}
      </div>

      <div className="px-4 space-y-4">
        {/* Hero dark card with summary */}
        <div
          className="rounded-3xl p-5"
          style={{
            background: "linear-gradient(160deg, #1C1C1E 0%, #2C2C2E 100%)",
          }}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                {t.totalAssets}
              </p>
              <p
                className="text-2xl font-bold font-numeric mt-0.5 text-white"
                style={{ letterSpacing: "-0.5px" }}
              >
                {isLoading
                  ? "—"
                  : formatDisplay(totalCNY, displayCurrency, rates)}
              </p>
            </div>
            <div
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: "rgba(52,199,89,0.2)", color: "#34C759" }}
            >
              {assets.length} {t.assetCount(assets.length)}
            </div>
          </div>

          {/* Mini category bars */}
          <div className="space-y-2">
            {categories
              .filter((c) => c.totalCNY > 0)
              .map((c) => (
                <div key={c.category} className="flex items-center gap-2">
                  <span className="text-xs w-20" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {t.categories[c.category]}
                  </span>
                  <div
                    className="flex-1 h-1.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                  >
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${c.percentage}%`,
                        background: {
                          cash: "#007AFF",
                          stock: "#34C759",
                          realestate: "#FF9500",
                          crypto: "#AF52DE",
                        }[c.category],
                      }}
                    />
                  </div>
                  <span className="text-xs font-numeric" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {c.percentage.toFixed(0)}%
                  </span>
                </div>
              ))}
            {categories.every((c) => c.totalCNY === 0) && (
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                {t.noAssetsSubtitle}
              </p>
            )}
          </div>
        </div>

        {/* 2×2 Category cards */}
        <div>
          <h2 className="text-sm font-bold mb-3" style={{ color: "#1C1C1E" }}>
            {t.allocation}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.category}
                data={cat}
                rates={rates}
                displayCurrency={displayCurrency}
              />
            ))}
          </div>
        </div>

        {/* Donut chart card */}
        <div
          className="rounded-3xl p-5"
          style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
        >
          <h2 className="text-sm font-bold mb-4" style={{ color: "#1C1C1E" }}>
            {t.allocation}
          </h2>
          <DonutChart
            categories={categories}
            rates={rates}
            displayCurrency={displayCurrency}
            totalCNY={totalCNY}
          />
        </div>

        {/* FX rates updated indicator */}
        <p className="text-center text-xs pb-2" style={{ color: "#C7C7CC" }}>
          {isZh ? "汇率自动更新" : "FX rates auto-updated hourly"}
        </p>
      </div>
    </div>
  );
}
