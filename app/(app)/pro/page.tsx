"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n";
import toast, { Toaster } from "react-hot-toast";
import type { User } from "@supabase/supabase-js";

type PricingPeriod = "monthly" | "yearly";

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  blue:   { bg: "rgba(0,122,255,0.12)",   color: "#007AFF" },
  orange: { bg: "rgba(255,149,0,0.12)",   color: "#FF9500" },
  purple: { bg: "rgba(175,82,222,0.12)",  color: "#AF52DE" },
  green:  { bg: "rgba(52,199,89,0.12)",   color: "#34C759" },
  red:    { bg: "rgba(255,59,48,0.12)",   color: "#FF3B30" },
};

const FEATURES = [
  {
    emoji: "🏦",
    title: "Bank Auto-Sync",
    tag: "Most Popular",
    tagColor: "blue",
    description:
      "Connect Chase, Bank of America, Wells Fargo, HSBC and more. Auto-syncs balance daily.",
  },
  {
    emoji: "₿",
    title: "Coinbase Auto-Sync",
    tag: "Most Popular",
    tagColor: "blue",
    description:
      "Auto-sync: Coinbase. Manual entry supported for other brokers.",
  },
  {
    emoji: "🏠",
    title: "Property Valuation Tracking",
    tag: "US Only",
    tagColor: "orange",
    description:
      "Auto-updates US home values via Zillow. Non-US properties use manual entry.",
  },
  {
    emoji: "📊",
    title: "Portfolio Reports (PDF)",
    tag: "Coming Soon",
    tagColor: "purple",
    description:
      "Download quarterly and annual net worth reports as PDF or Excel. Share with your accountant or financial advisor.",
  },
  {
    emoji: "👨‍👩‍👧",
    title: "Family Wealth View",
    tag: "Coming Soon",
    tagColor: "purple",
    description:
      "Invite your spouse or family members. See combined household net worth in one dashboard.",
  },
  {
    emoji: "🤖",
    title: "AI Financial Insights",
    tag: "Coming Soon",
    tagColor: "purple",
    description:
      "AI analyzes your cross-border asset allocation and suggests optimizations based on your goals.",
  },
];

export default function ProPage() {
  const { t, language } = useTranslation();
  const supabase = createClient();
  const isZh = language === "zh";

  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [period, setPeriod] = useState<PricingPeriod>("yearly");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase
          .from("profiles")
          .select("plan")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            if (data) setPlan(data.plan as "free" | "pro");
          });
      }
    });
  }, []);

  function handleCTA() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast(t.pro.comingSoon, {
        icon: "🚀",
        style: { borderRadius: "14px", background: "#1C1C1E", color: "#FFFFFF" },
      });
    }, 800);
  }

  return (
    <div className={`min-h-screen ${isZh ? "lang-zh" : ""}`} style={{ background: "#F2F2F7" }}>
      <Toaster position="top-center" />

      {/* Hero section */}
      <div
        className="px-4 pt-14 pb-8"
        style={{ background: "linear-gradient(160deg, #1C1C1E 0%, #2C2C2E 100%)" }}
      >
        <div className="flex items-center gap-2 mb-6">
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold"
            style={{
              background: "linear-gradient(135deg, #FF9500, #FF3B30, #AF52DE)",
              color: "#FFFFFF",
            }}
          >
            PRO ✦
          </span>
          {plan === "pro" && (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: "rgba(52,199,89,0.2)", color: "#34C759" }}
            >
              {t.pro.currentPlan}
            </span>
          )}
        </div>

        <h1
          className="text-2xl font-extrabold text-white mb-2"
          style={{ letterSpacing: "-0.5px" }}
        >
          {t.pro.title}
        </h1>
        <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
          {t.pro.subtitle}
        </p>

        {/* Period toggle */}
        <div
          className="flex rounded-2xl p-1 mb-6"
          style={{ background: "rgba(255,255,255,0.1)" }}
        >
          {(["monthly", "yearly"] as PricingPeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
              style={{
                background: period === p ? "#FFFFFF" : "transparent",
                color: period === p ? "#1C1C1E" : "rgba(255,255,255,0.5)",
              }}
            >
              {p === "monthly" ? t.pro.monthly : t.pro.yearly}
              {p === "yearly" && (
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: "#34C759", color: "#FFFFFF" }}
                >
                  {t.pro.save}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* CTA button — dark */}
        <button
          onClick={handleCTA}
          disabled={loading || plan === "pro"}
          className="w-full py-4 rounded-2xl text-sm font-bold transition-all active:scale-95"
          style={{
            background: plan === "pro" ? "rgba(52,199,89,0.2)" : "#1C1C1E",
            color: plan === "pro" ? "#34C759" : "#FFFFFF",
            border: plan !== "pro" ? "1px solid rgba(255,255,255,0.12)" : "none",
          }}
        >
          {plan === "pro"
            ? isZh ? "✓ 已是专业版" : "✓ You're on Pro"
            : loading
            ? "..."
            : t.pro.cta}
        </button>

        <p className="text-center text-xs mt-3" style={{ color: "rgba(255,255,255,0.35)" }}>
          {t.pro.trial}
        </p>
      </div>

      {/* Features list */}
      <div className="px-4 py-5 space-y-3">
        <h2 className="text-xs font-semibold uppercase px-1" style={{ color: "#8E8E93", letterSpacing: "0.5px" }}>
          {isZh ? "专业版功能" : "Pro Features"}
        </h2>

        {FEATURES.map((feature, i) => {
          const tagStyle = TAG_COLORS[feature.tagColor] ?? TAG_COLORS.blue;
          return (
            <div
              key={i}
              className="bg-white flex items-start gap-3 px-4 py-4"
              style={{
                borderRadius: "16px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              {/* Emoji icon */}
              <div
                className="flex-shrink-0 flex items-center justify-center text-2xl"
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "#F2F2F7",
                }}
              >
                {feature.emoji}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className="font-bold"
                    style={{ fontSize: "14px", color: "#1C1C1E" }}
                  >
                    {feature.title}
                  </span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: tagStyle.bg, color: tagStyle.color }}
                  >
                    {feature.tag}
                  </span>
                </div>
                <p
                  className="leading-relaxed"
                  style={{ fontSize: "12px", color: "#8E8E93" }}
                >
                  {feature.description}
                </p>
              </div>

              {/* Lock / check */}
              <div className="flex-shrink-0 mt-0.5">
                {plan === "pro" ? (
                  <span style={{ color: "#34C759", fontSize: "16px" }}>✓</span>
                ) : (
                  <span style={{ color: "#C7C7CC", fontSize: "16px" }}>🔒</span>
                )}
              </div>
            </div>
          );
        })}

        <p className="text-center text-xs pt-2 pb-4" style={{ color: "#C7C7CC" }}>
          {isZh ? "MVP 阶段仅展示 · 功能持续更新中" : "MVP preview · More features coming soon"}
        </p>
      </div>
    </div>
  );
}
