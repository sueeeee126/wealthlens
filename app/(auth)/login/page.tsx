"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useTranslation, type Language } from "@/lib/i18n";

export default function LoginPage() {
  const { t, language, setLanguage } = useTranslation();
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"options" | "email">("options");

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (err) {
      setError(t.auth.signInError);
      setLoading(false);
    } else {
      router.push("/overview");
      router.refresh();
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/overview` },
    });
    if (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  const isZh = language === "zh";

  return (
    <div
      className={`min-h-dvh flex flex-col items-center justify-between px-6 py-12 ${isZh ? "lang-zh" : ""}`}
      style={{
        background: "linear-gradient(160deg, #1C1C1E 0%, #2C2C2E 60%, #1C1C1E 100%)",
      }}
    >
      {/* Language toggle */}
      <div className="w-full max-w-mobile flex justify-end">
        <div
          className="flex rounded-xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.1)" }}
        >
          {(["en", "zh"] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className="px-3 py-1.5 text-sm font-medium transition-all"
              style={{
                background:
                  language === lang ? "rgba(255,255,255,0.2)" : "transparent",
                color: language === lang ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                borderRadius: "10px",
              }}
            >
              {lang === "en" ? "🇺🇸 EN" : "🇨🇳 中文"}
            </button>
          ))}
        </div>
      </div>

      {/* Logo & tagline */}
      <div className="flex flex-col items-center gap-4 py-8">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
          style={{ background: "rgba(0,122,255,0.25)", border: "1px solid rgba(0,122,255,0.4)" }}
        >
          🌐
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {t.appName}
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
            {t.tagline}
          </p>
        </div>
      </div>

      {/* Auth card */}
      <div className="w-full max-w-mobile">
        {error && (
          <div
            className="mb-4 px-4 py-3 rounded-2xl text-sm text-center"
            style={{ background: "rgba(255,59,48,0.15)", color: "#FF6B6B" }}
          >
            {error}
          </div>
        )}

        {mode === "options" ? (
          <div className="flex flex-col gap-3">
            {/* Google */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-sm font-semibold transition-all active:scale-95"
              style={{
                background: "#FFFFFF",
                color: "#1C1C1E",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t.auth.continueWithGoogle}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.12)" }} />
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                {t.auth.orDivider}
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.12)" }} />
            </div>

            {/* Email option */}
            <button
              onClick={() => setMode("email")}
              className="w-full py-4 rounded-2xl text-sm font-semibold transition-all active:scale-95"
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {t.auth.continueWithEmail}
            </button>

            <p className="text-center text-xs mt-4" style={{ color: "rgba(255,255,255,0.3)" }}>
              {t.auth.terms}
            </p>

            <p className="text-center text-sm mt-2" style={{ color: "rgba(255,255,255,0.5)" }}>
              {t.auth.noAccount}{" "}
              <Link href="/signup" className="font-semibold" style={{ color: "#007AFF" }}>
                {t.auth.signUp}
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleEmailSignIn} className="flex flex-col gap-3">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <div className="px-4 py-3.5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <label className="block text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {t.auth.email}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.auth.emailPlaceholder}
                  required
                  autoComplete="email"
                  className="w-full bg-transparent text-white text-base placeholder-gray-600"
                />
              </div>
              <div className="px-4 py-3.5">
                <label className="block text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {t.auth.password}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.auth.passwordPlaceholder}
                  required
                  autoComplete="current-password"
                  className="w-full bg-transparent text-white text-base placeholder-gray-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl text-sm font-semibold transition-all active:scale-95"
              style={{
                background: loading ? "rgba(0,122,255,0.5)" : "#007AFF",
                color: "#FFFFFF",
              }}
            >
              {loading ? t.auth.loading : t.auth.signIn}
            </button>

            <button
              type="button"
              onClick={() => setMode("options")}
              className="text-center text-sm"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              ← {t.back}
            </button>

            <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              {t.auth.noAccount}{" "}
              <Link href="/signup" className="font-semibold" style={{ color: "#007AFF" }}>
                {t.auth.signUp}
              </Link>
            </p>
          </form>
        )}
      </div>

      <div />
    </div>
  );
}
