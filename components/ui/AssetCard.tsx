"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Asset } from "@/lib/utils/calculations";
import { formatNative, formatDisplay, toCNY, CURRENCIES } from "@/lib/utils/currency";
import { useTranslation } from "@/lib/i18n";
import { CATEGORY_COLORS } from "@/lib/utils/calculations";

interface AssetCardProps {
  asset: Asset;
  rates: Record<string, number>;
  displayCurrency: string;
  onEdit?: (asset: Asset) => void;
  onDelete?: (id: string) => void;
}

const CATEGORY_BG: Record<string, string> = {
  cash:        "rgba(0,122,255,0.12)",
  stock:       "rgba(52,199,89,0.12)",
  realestate:  "rgba(255,149,0,0.12)",
  crypto:      "rgba(175,82,222,0.12)",
};

const CATEGORY_EMOJI: Record<string, string> = {
  cash:       "🏦",
  stock:      "📈",
  realestate: "🏠",
  crypto:     "₿",
};

export default function AssetCard({
  asset,
  rates,
  displayCurrency,
  onEdit,
  onDelete,
}: AssetCardProps) {
  const { t } = useTranslation();
  const [showActions, setShowActions] = useState(false);

  const cnyValue = toCNY(asset.value, asset.currency, rates);
  const catColor = CATEGORY_COLORS[asset.category] ?? "#8E8E93";
  const catBg = CATEGORY_BG[asset.category] ?? "rgba(142,142,147,0.1)";
  const catEmoji = CATEGORY_EMOJI[asset.category] ?? "💰";
  const catLabel = t.categories[asset.category as keyof typeof t.categories];

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl mb-3 overflow-hidden"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      <button
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-gray-50 transition-colors"
        onClick={() => setShowActions(!showActions)}
      >
        {/* Category icon */}
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: catBg }}
        >
          {catEmoji}
        </div>

        {/* Name & note */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate" style={{ color: "#1C1C1E" }}>
            {asset.name}
          </div>
          <div className="text-xs truncate" style={{ color: "#8E8E93" }}>
            {catLabel}
            {asset.note ? ` · ${asset.note}` : ""}
          </div>
        </div>

        {/* Values */}
        <div className="text-right flex-shrink-0">
          <div className="text-sm font-semibold font-numeric" style={{ color: "#1C1C1E" }}>
            {formatNative(asset.value, asset.currency)}
          </div>
          {asset.currency !== displayCurrency && (
            <div className="text-xs font-numeric" style={{ color: "#8E8E93" }}>
              ≈{formatDisplay(cnyValue, displayCurrency, rates)}
            </div>
          )}
        </div>
      </button>

      {/* Expandable actions */}
      {showActions && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="flex border-t"
          style={{ borderColor: "#F2F2F7" }}
        >
          <button
            onClick={() => {
              setShowActions(false);
              onEdit?.(asset);
            }}
            className="flex-1 py-3 text-sm font-semibold active:bg-gray-50 transition-colors"
            style={{ color: "#007AFF" }}
          >
            {t.editAsset}
          </button>
          <div className="w-px" style={{ background: "#F2F2F7" }} />
          <button
            onClick={() => {
              setShowActions(false);
              onDelete?.(asset.id);
            }}
            className="flex-1 py-3 text-sm font-semibold active:bg-gray-50 transition-colors"
            style={{ color: "#FF3B30" }}
          >
            {t.deleteAsset}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
