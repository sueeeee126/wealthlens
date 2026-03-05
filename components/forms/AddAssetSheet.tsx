"use client";

import { useState, useEffect } from "react";
import BottomSheet from "@/components/ui/BottomSheet";
import { useTranslation } from "@/lib/i18n";
import { ALL_CURRENCIES, CURRENCIES, type CurrencyCode } from "@/lib/utils/currency";
import type { Asset, CategoryKey } from "@/lib/utils/calculations";

const CATEGORIES: CategoryKey[] = ["cash", "stock", "realestate", "crypto"];

const CATEGORY_EMOJI: Record<CategoryKey, string> = {
  cash:       "🏦",
  stock:      "📈",
  realestate: "🏠",
  crypto:     "₿",
};

interface AddAssetSheetProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    category: CategoryKey;
    value: number;
    currency: string;
    note: string;
  }) => Promise<void>;
  editAsset?: Asset | null;
}

export default function AddAssetSheet({
  open,
  onClose,
  onSubmit,
  editAsset,
}: AddAssetSheetProps) {
  const { t, language } = useTranslation();
  const isZh = language === "zh";

  const [step, setStep] = useState<"category" | "form">("category");
  const [category, setCategory] = useState<CategoryKey>("cash");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("CNY");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill when editing
  useEffect(() => {
    if (editAsset) {
      setCategory(editAsset.category as CategoryKey);
      setName(editAsset.name);
      setValue(String(editAsset.value));
      setCurrency(editAsset.currency as CurrencyCode);
      setNote(editAsset.note ?? "");
      setStep("form");
    } else {
      setStep("category");
      setName("");
      setValue("");
      setCurrency("CNY");
      setNote("");
    }
    setError(null);
  }, [editAsset, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const numVal = parseFloat(value);
    if (isNaN(numVal) || numVal <= 0) {
      setError(isZh ? "请输入有效金额" : "Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError(null);
    await onSubmit({ name, category, value: numVal, currency, note });
    setLoading(false);
    handleClose();
  }

  function handleClose() {
    setStep("category");
    setName("");
    setValue("");
    setCurrency("CNY");
    setNote("");
    setError(null);
    onClose();
  }

  // Suggest default currency based on category
  function handleCategorySelect(cat: CategoryKey) {
    setCategory(cat);
    if (cat === "crypto") setCurrency("BTC");
    else setCurrency("CNY");
    setStep("form");
  }

  return (
    <BottomSheet
      open={open}
      onClose={handleClose}
      title={editAsset ? t.editAsset : t.addAsset}
    >
      {step === "category" && !editAsset ? (
        <div className="px-4 pb-8">
          <p className="text-sm text-center mb-4" style={{ color: "#8E8E93" }}>
            {isZh ? "选择资产类别" : "Select a category"}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl active:scale-95 transition-all"
                style={{
                  background: "#F2F2F7",
                  border: "1.5px solid transparent",
                }}
              >
                <span className="text-3xl">{CATEGORY_EMOJI[cat]}</span>
                <span className="text-sm font-semibold" style={{ color: "#1C1C1E" }}>
                  {t.categories[cat]}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="px-4 pb-8">
          {error && (
            <div
              className="mb-3 px-4 py-2.5 rounded-xl text-sm"
              style={{ background: "rgba(255,59,48,0.1)", color: "#FF3B30" }}
            >
              {error}
            </div>
          )}

          {/* Category header */}
          {!editAsset && (
            <button
              type="button"
              onClick={() => setStep("category")}
              className="flex items-center gap-2 mb-4 text-sm"
              style={{ color: "#007AFF" }}
            >
              ← {t.categories[category]}
            </button>
          )}

          {/* Form fields */}
          <div
            className="rounded-2xl overflow-hidden mb-3"
            style={{ background: "#F2F2F7" }}
          >
            {/* Name */}
            <div className="px-4 py-3.5 border-b" style={{ borderColor: "#E5E5EA" }}>
              <label className="block text-xs font-medium mb-1" style={{ color: "#8E8E93" }}>
                {t.assetForm.name}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.assetForm.namePlaceholder}
                required
                className="w-full bg-transparent text-base font-medium"
                style={{ color: "#1C1C1E" }}
              />
            </div>

            {/* Value */}
            <div className="px-4 py-3.5 border-b" style={{ borderColor: "#E5E5EA" }}>
              <label className="block text-xs font-medium mb-1" style={{ color: "#8E8E93" }}>
                {t.assetForm.value}
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={t.assetForm.valuePlaceholder}
                required
                min="0"
                step="any"
                className="w-full bg-transparent text-base font-medium"
                style={{ color: "#1C1C1E" }}
              />
            </div>

            {/* Currency */}
            <div className="px-4 py-3.5 border-b" style={{ borderColor: "#E5E5EA" }}>
              <label className="block text-xs font-medium mb-1" style={{ color: "#8E8E93" }}>
                {t.assetForm.currency}
              </label>
              <div className="flex flex-wrap gap-2 mt-1">
                {ALL_CURRENCIES.map((cur) => (
                  <button
                    key={cur}
                    type="button"
                    onClick={() => setCurrency(cur)}
                    className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                    style={{
                      background: currency === cur ? "#007AFF" : "#E5E5EA",
                      color: currency === cur ? "#FFFFFF" : "#1C1C1E",
                    }}
                  >
                    {CURRENCIES[cur].symbol} {cur}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="px-4 py-3.5">
              <label className="block text-xs font-medium mb-1" style={{ color: "#8E8E93" }}>
                {t.assetForm.note}
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t.assetForm.notePlaceholder}
                className="w-full bg-transparent text-base"
                style={{ color: "#1C1C1E" }}
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
            {loading ? t.loading : t.save}
          </button>
        </form>
      )}
    </BottomSheet>
  );
}
