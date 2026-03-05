"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Asset, CategoryKey } from "@/lib/utils/calculations";

export interface UseAssetsReturn {
  assets: Asset[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addAsset: (data: Omit<Asset, "id" | "user_id" | "created_at" | "updated_at" | "is_auto_synced">) => Promise<{ error?: string }>;
  updateAsset: (id: string, data: Partial<Omit<Asset, "id" | "user_id" | "created_at" | "is_auto_synced">>) => Promise<{ error?: string }>;
  deleteAsset: (id: string) => Promise<{ error?: string }>;
}

export function useAssets(userId: string | null): UseAssetsReturn {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const fetchAssets = useCallback(async () => {
    if (!userId) {
      setAssets([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: err } = await supabase
      .from("assets")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (err) {
      setError(err.message);
    } else {
      setAssets((data ?? []) as Asset[]);
    }
    setLoading(false);
  }, [userId, supabase]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const addAsset = useCallback(
    async (
      data: Omit<Asset, "id" | "user_id" | "created_at" | "updated_at" | "is_auto_synced">
    ) => {
      if (!userId) return { error: "Not authenticated" };

      const { data: inserted, error: err } = await supabase
        .from("assets")
        .insert({
          user_id: userId,
          name: data.name,
          category: data.category,
          value: data.value,
          currency: data.currency,
          note: data.note ?? null,
          is_auto_synced: false,
        })
        .select()
        .single();

      if (err) return { error: err.message };

      setAssets((prev) => [...prev, inserted as Asset]);
      return {};
    },
    [userId, supabase]
  );

  const updateAsset = useCallback(
    async (
      id: string,
      data: Partial<Omit<Asset, "id" | "user_id" | "created_at" | "is_auto_synced">>
    ) => {
      const { data: updated, error: err } = await supabase
        .from("assets")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (err) return { error: err.message };

      setAssets((prev) =>
        prev.map((a) => (a.id === id ? (updated as Asset) : a))
      );
      return {};
    },
    [supabase]
  );

  const deleteAsset = useCallback(async (id: string) => {
    const { error: err } = await supabase
      .from("assets")
      .delete()
      .eq("id", id);

    if (err) return { error: err.message };

    setAssets((prev) => prev.filter((a) => a.id !== id));
    return {};
  }, [supabase]);

  return {
    assets,
    loading,
    error,
    refetch: fetchAssets,
    addAsset,
    updateAsset,
    deleteAsset,
  };
}
