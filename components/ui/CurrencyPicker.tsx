"use client";

import { useState } from "react";
import BottomSheet from "./BottomSheet";
import { DISPLAY_CURRENCIES, CURRENCIES, type CurrencyCode } from "@/lib/utils/currency";
import { useTranslation } from "@/lib/i18n";

interface CurrencyPickerProps {
  value: CurrencyCode;
  onChange: (currency: CurrencyCode) => void;
}

export default function CurrencyPicker({ value, onChange }: CurrencyPickerProps) {
  const [open, setOpen] = useState(false);
  const { t, language } = useTranslation();
  const isZh = language === "zh";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold active:scale-95 transition-all"
        style={{
          background: "rgba(0,122,255,0.12)",
          color: "#007AFF",
        }}
      >
        <span>💱</span>
        <span>{value}</span>
        <span style={{ fontSize: "10px", opacity: 0.7 }}>▾</span>
      </button>

      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title={isZh ? "选择货币" : "Display Currency"}
      >
        <div className="px-4 pb-6">
          {DISPLAY_CURRENCIES.map((cur) => {
            const info = CURRENCIES[cur];
            const isSelected = cur === value;
            return (
              <button
                key={cur}
                onClick={() => {
                  onChange(cur);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-4 rounded-2xl mb-2 active:scale-98 transition-all"
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
    </>
  );
}
