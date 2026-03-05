"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { NetWorthHistory } from "@/lib/utils/calculations";

export interface UseNetWorthHistoryReturn {
  history: NetWorthHistory[];
  loading: boolean;
  snapshot: (userId: string, totalCNY: number) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useNetWorthHistory(userId: string | null): UseNetWorthHistoryReturn {
  const [history, setHistory] = useState<NetWorthHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  const fetchHistory = useCallback(async () => {
    if (!userId) {
      setHistory([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("net_worth_history")
      .select("*")
      .eq("user_id", userId)
      .order("snapshot_date", { ascending: true })
      .limit(180); // last 6 months

    if (!error && data) {
      setHistory(data as NetWorthHistory[]);
    }
    setLoading(false);
  }, [userId, supabase]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const snapshot = useCallback(
    async (uid: string, totalCNY: number) => {
      const today = new Date().toISOString().split("T")[0];
      await supabase.from("net_worth_history").upsert(
        {
          user_id: uid,
          total_cny: totalCNY,
          snapshot_date: today,
        },
        { onConflict: "user_id,snapshot_date" }
      );

      // Update local state
      setHistory((prev) => {
        const existing = prev.find((h) => h.snapshot_date === today);
        if (existing) {
          return prev.map((h) =>
            h.snapshot_date === today ? { ...h, total_cny: totalCNY } : h
          );
        }
        return [
          ...prev,
          {
            id: crypto.randomUUID(),
            user_id: uid,
            total_cny: totalCNY,
            snapshot_date: today,
            created_at: new Date().toISOString(),
          } as NetWorthHistory,
        ];
      });
    },
    [supabase]
  );

  return { history, loading, snapshot, refetch: fetchHistory };
}
