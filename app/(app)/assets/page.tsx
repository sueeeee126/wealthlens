"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n";
import { useFxRates } from "@/lib/hooks/useFxRates";
import { useAssets } from "@/lib/hooks/useAssets";
import { type CurrencyCode } from "@/lib/utils/currency";
import AssetCard from "@/components/ui/AssetCard";
import AddAssetSheet from "@/components/forms/AddAssetSheet";
import CurrencyPicker from "@/components/ui/CurrencyPicker";
import type { Asset, CategoryKey } from "@/lib/utils/calculations";
import type { User } from "@supabase/supabase-js";
import toast, { Toaster } from "react-hot-toast";

const FREE_ASSET_LIMIT = 5;

export default function AssetsPage() {
  const { t, language } = useTranslation();
  const router = useRouter();
  const supabase = createClient();
  const isZh = language === "zh";

  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [displayCurrency, setDisplayCurrency] = useState<CurrencyCode>("CNY");
  const [showSheet, setShowSheet] = useState(false);
  const [editAsset, setEditAsset] = useState<Asset | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { rates } = useFxRates();
  const { assets, loading, addAsset, updateAsset, deleteAsset } = useAssets(user?.id ?? null);

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
              setPlan(data.plan as "free" | "pro");
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

  function handleAddPress() {
    const canAdd = plan === "pro" || assets.length < FREE_ASSET_LIMIT;
    if (!canAdd) {
      router.push("/pro");
      return;
    }
    setEditAsset(null);
    setShowSheet(true);
  }

  async function handleSubmit(data: {
    name: string;
    category: CategoryKey;
    value: number;
    currency: string;
    note: string;
  }) {
    if (editAsset) {
      const { error } = await updateAsset(editAsset.id, data);
      if (error) {
        toast.error(isZh ? "更新失败" : "Update failed");
      } else {
        toast.success(isZh ? "已更新" : "Updated!");
      }
    } else {
      const { error } = await addAsset(data);
      if (error) {
        toast.error(isZh ? "添加失败" : "Failed to add");
      } else {
        toast.success(isZh ? "已添加" : "Asset added!");
      }
    }
  }

  async function handleDelete(id: string) {
    const { error } = await deleteAsset(id);
    if (error) {
      toast.error(isZh ? "删除失败" : "Delete failed");
    } else {
      toast.success(isZh ? "已删除" : "Deleted");
    }
    setDeleteConfirmId(null);
  }

  const canAddMore = plan === "pro" || assets.length < FREE_ASSET_LIMIT;

  return (
    <div className={`min-h-screen ${isZh ? "lang-zh" : ""}`} style={{ background: "#F2F2F7" }}>
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

      {/* Header */}
      <div className="px-4 pt-14 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#1C1C1E" }}>
            {t.assets}
          </h1>
          <p className="text-xs" style={{ color: "#8E8E93" }}>
            {t.assetCount(assets.length)}
            {plan === "free" && ` / ${FREE_ASSET_LIMIT}`}
          </p>
        </div>
        <CurrencyPicker value={displayCurrency} onChange={handleCurrencyChange} />
      </div>

      {/* Free plan banner */}
      {plan === "free" && assets.length >= FREE_ASSET_LIMIT && (
        <div
          className="mx-4 mb-3 px-4 py-3 rounded-2xl flex items-center justify-between"
          style={{
            background: "linear-gradient(135deg, rgba(255,149,0,0.12), rgba(255,59,48,0.12))",
            border: "1px solid rgba(255,149,0,0.3)",
          }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: "#FF9500" }}>
              {t.freeLimit}
            </p>
            <p className="text-xs" style={{ color: "#8E8E93" }}>
              {t.freeLimitSubtitle}
            </p>
          </div>
          <button
            onClick={() => router.push("/pro")}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg, #FF9500, #FF3B30)" }}
          >
            {t.upgradeNow}
          </button>
        </div>
      )}

      {/* Asset list */}
      <div className="px-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-16 rounded-2xl" />
            ))}
          </div>
        ) : assets.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-3xl"
            style={{ background: "#FFFFFF" }}
          >
            <div className="text-4xl mb-3">💼</div>
            <p className="text-base font-semibold" style={{ color: "#1C1C1E" }}>
              {t.noAssets}
            </p>
            <p className="text-sm mt-1" style={{ color: "#8E8E93" }}>
              {t.noAssetsSubtitle}
            </p>
          </div>
        ) : (
          <>
            {assets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                rates={rates}
                displayCurrency={displayCurrency}
                onEdit={(a) => {
                  setEditAsset(a);
                  setShowSheet(true);
                }}
                onDelete={(id) => setDeleteConfirmId(id)}
              />
            ))}
          </>
        )}

        {/* Add button */}
        <button
          onClick={handleAddPress}
          className="w-full py-4 rounded-2xl mt-2 mb-4 flex items-center justify-center gap-2 text-sm font-semibold transition-all active:scale-95"
          style={{
            background: canAddMore ? "rgba(0,122,255,0.08)" : "rgba(255,149,0,0.08)",
            color: canAddMore ? "#007AFF" : "#FF9500",
            border: `1.5px dashed ${canAddMore ? "rgba(0,122,255,0.25)" : "rgba(255,149,0,0.25)"}`,
          }}
        >
          {canAddMore ? (
            <>
              <span className="text-lg">+</span>
              {t.addAsset}
            </>
          ) : (
            <>
              <span>🔒</span>
              {t.upgradeNow}
            </>
          )}
        </button>
      </div>

      {/* Add/Edit sheet */}
      <AddAssetSheet
        open={showSheet}
        onClose={() => {
          setShowSheet(false);
          setEditAsset(null);
        }}
        onSubmit={handleSubmit}
        editAsset={editAsset}
      />

      {/* Delete confirm sheet */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.4)" }}
            onClick={() => setDeleteConfirmId(null)}
          />
          <div
            className="relative w-full max-w-mobile bg-white p-5 rounded-t-4xl"
            style={{ borderRadius: "22px 22px 0 0" }}
          >
            <div className="drag-handle mb-4" />
            <h3 className="text-base font-bold text-center mb-2" style={{ color: "#1C1C1E" }}>
              {t.deleteAsset}
            </h3>
            <p className="text-sm text-center mb-5" style={{ color: "#8E8E93" }}>
              {t.deleteConfirm}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3.5 rounded-2xl text-sm font-semibold"
                style={{ background: "#F2F2F7", color: "#1C1C1E" }}
              >
                {t.cancel}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-3.5 rounded-2xl text-sm font-semibold"
                style={{ background: "#FF3B30", color: "#FFFFFF" }}
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
