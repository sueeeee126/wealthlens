"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslation, type Language } from "@/lib/i18n";
import { DISPLAY_CURRENCIES, CURRENCIES, type CurrencyCode } from "@/lib/utils/currency";
import BottomSheet from "@/components/ui/BottomSheet";
import toast, { Toaster } from "react-hot-toast";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/supabase/types";
import ProBadge from "@/components/ui/ProBadge";

export default function SettingsPage() {
  const { t, language, setLanguage } = useTranslation();
  const router = useRouter();
  const supabase = createClient();
  const isZh = language === "zh";

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayCurrency, setDisplayCurrency] = useState<CurrencyCode>("CNY");
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
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
      }
    });
  }, []);

  async function saveLanguage(lang: Language) {
    setLanguage(lang);
    setShowLangPicker(false);
    if (user) {
      await supabase
        .from("profiles")
        .update({ language: lang })
        .eq("id", user.id);
    }
    toast.success(lang === "zh" ? "语言已保存" : "Language saved");
  }

  async function saveCurrency(cur: CurrencyCode) {
    setDisplayCurrency(cur);
    setShowCurrencyPicker(false);
    if (user) {
      setSaving(true);
      await supabase
        .from("profiles")
        .update({ display_currency: cur })
        .eq("id", user.id);
      setSaving(false);
    }
    toast.success(isZh ? "货币已保存" : "Currency saved");
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const initials = profile?.display_name
    ? profile.display_name.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className={`min-h-screen pb-8 ${isZh ? "lang-zh" : ""}`} style={{ background: "#F2F2F7" }}>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: "14px",
            background: "#1C1C1E",
            color: "#FFFFFF",
            fontSize: "14px",
          },
        }}
      />

      <div className="px-4 pt-14 pb-4">
        <h1 className="text-xl font-bold" style={{ color: "#1C1C1E" }}>
          {t.settings.title}
        </h1>
      </div>

      <div className="px-4 space-y-5">
        {/* Account section */}
        <section>
          <p className="text-xs font-semibold uppercase mb-2 px-1" style={{ color: "#8E8E93", letterSpacing: "0.5px" }}>
            {t.settings.account}
          </p>
          <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center gap-4 px-4 py-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #007AFF, #AF52DE)" }}
              >
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate" style={{ color: "#1C1C1E" }}>
                  {profile?.display_name || (isZh ? "用户" : "User")}
                </div>
                <div className="text-xs truncate" style={{ color: "#8E8E93" }}>
                  {user?.email}
                </div>
              </div>
              <div className="flex-shrink-0">
                {profile?.plan === "pro" ? (
                  <ProBadge small />
                ) : (
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{ background: "#F2F2F7", color: "#8E8E93" }}
                  >
                    {t.pro.free}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Preferences section */}
        <section>
          <p className="text-xs font-semibold uppercase mb-2 px-1" style={{ color: "#8E8E93", letterSpacing: "0.5px" }}>
            {t.settings.preferences}
          </p>
          <div
            className="bg-white rounded-2xl overflow-hidden divide-y divide-gray-100"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
          >
            {/* Language row */}
            <button
              onClick={() => setShowLangPicker(true)}
              className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🌐</span>
                <span className="text-sm font-medium" style={{ color: "#1C1C1E" }}>
                  {t.settings.language}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: "#8E8E93" }}>
                  {language === "en" ? "🇺🇸 English" : "🇨🇳 中文"}
                </span>
                <span style={{ color: "#C7C7CC" }}>›</span>
              </div>
            </button>

            {/* Currency row */}
            <button
              onClick={() => setShowCurrencyPicker(true)}
              className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">💱</span>
                <span className="text-sm font-medium" style={{ color: "#1C1C1E" }}>
                  {t.settings.defaultCurrency}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: "#8E8E93" }}>
                  {CURRENCIES[displayCurrency]?.symbol} {displayCurrency}
                </span>
                <span style={{ color: "#C7C7CC" }}>›</span>
              </div>
            </button>

            {/* Notification toggle (static for MVP) */}
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔔</span>
                <span className="text-sm font-medium" style={{ color: "#1C1C1E" }}>
                  {t.settings.notifications}
                </span>
              </div>
              <div
                className="w-12 h-6 rounded-full"
                style={{ background: "#E5E5EA" }}
              >
                <div className="w-5 h-5 bg-white rounded-full m-0.5 shadow-sm" />
              </div>
            </div>
          </div>
        </section>

        {/* Subscription section */}
        <section>
          <p className="text-xs font-semibold uppercase mb-2 px-1" style={{ color: "#8E8E93", letterSpacing: "0.5px" }}>
            {t.settings.subscription}
          </p>
          <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
          >
            <button
              onClick={() => router.push("/pro")}
              className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">✦</span>
                <div className="text-left">
                  <div className="text-sm font-medium" style={{ color: "#1C1C1E" }}>
                    {t.settings.currentPlan}
                  </div>
                  <div className="text-xs" style={{ color: "#8E8E93" }}>
                    {profile?.plan === "pro" ? t.pro.proLabel : t.pro.free}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {profile?.plan !== "pro" && (
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{ background: "rgba(0,122,255,0.1)", color: "#007AFF" }}
                  >
                    {isZh ? "升级" : "Upgrade"}
                  </span>
                )}
                <span style={{ color: "#C7C7CC" }}>›</span>
              </div>
            </button>
          </div>
        </section>

        {/* Sign out */}
        <section>
          <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
          >
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-4 text-sm font-semibold text-center active:bg-gray-50"
              style={{ color: "#FF3B30" }}
            >
              {t.settings.signOut}
            </button>
          </div>
        </section>

        <p className="text-center text-xs" style={{ color: "#C7C7CC" }}>
          {t.settings.version}
        </p>
      </div>

      {/* Language picker sheet */}
      <BottomSheet
        open={showLangPicker}
        onClose={() => setShowLangPicker(false)}
        title={t.settings.language}
      >
        <div className="px-4 pb-8">
          {(["en", "zh"] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => saveLanguage(lang)}
              className="w-full flex items-center justify-between px-4 py-4 rounded-2xl mb-2 active:scale-95 transition-all"
              style={{
                background: language === lang ? "rgba(0,122,255,0.08)" : "#F2F2F7",
                border: language === lang ? "1.5px solid rgba(0,122,255,0.3)" : "1.5px solid transparent",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{lang === "en" ? "🇺🇸" : "🇨🇳"}</span>
                <span className="text-sm font-semibold" style={{ color: "#1C1C1E" }}>
                  {lang === "en" ? "English" : "中文（简体）"}
                </span>
              </div>
              {language === lang && (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "#007AFF" }}
                >
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Currency picker sheet */}
      <BottomSheet
        open={showCurrencyPicker}
        onClose={() => setShowCurrencyPicker(false)}
        title={t.settings.defaultCurrency}
      >
        <div className="px-4 pb-8">
          {DISPLAY_CURRENCIES.map((cur) => {
            const info = CURRENCIES[cur];
            const isSelected = cur === displayCurrency;
            return (
              <button
                key={cur}
                onClick={() => saveCurrency(cur)}
                className="w-full flex items-center justify-between px-4 py-4 rounded-2xl mb-2 active:scale-95 transition-all"
                style={{
                  background: isSelected ? "rgba(0,122,255,0.08)" : "#F2F2F7",
                  border: isSelected ? "1.5px solid rgba(0,122,255,0.3)" : "1.5px solid transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold" style={{ color: "#007AFF", width: "32px" }}>
                    {info.symbol}
                  </span>
                  <div className="text-left">
                    <div className="text-sm font-semibold" style={{ color: "#1C1C1E" }}>
                      {cur}
                    </div>
                    <div className="text-xs" style={{ color: "#8E8E93" }}>
                      {isZh ? info.nameZh : info.name}
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "#007AFF" }}
                  >
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </BottomSheet>
    </div>
  );
}
