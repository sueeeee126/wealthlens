"use client";

import { useState, useEffect, useCallback } from "react";

export interface FxRates {
  rates: Record<string, number>;
  updated: string | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const DEFAULT_RATES: Record<string, number> = {
  CNY: 1,
  USD: 7.25,
  HKD: 0.93,
  EUR: 7.85,
  GBP: 9.15,
  AUD: 4.75,
  BTC: 450000,
  ETH: 25000,
};

let cachedRates: Record<string, number> | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export function useFxRates(): FxRates {
  const [rates, setRates] = useState<Record<string, number>>(
    cachedRates ?? DEFAULT_RATES
  );
  const [updated, setUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(!cachedRates);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    // Use cache if fresh
    if (cachedRates && Date.now() - cacheTimestamp < CACHE_DURATION) {
      setRates(cachedRates);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [fxRes, cryptoRes] = await Promise.all([
        fetch("/api/fx-rates"),
        fetch("/api/crypto-prices"),
      ]);

      const fxData = await fxRes.json();
      const cryptoData = await cryptoRes.json();

      const combined: Record<string, number> = {
        ...fxData.rates,
        BTC: cryptoData.BTC,
        ETH: cryptoData.ETH,
      };

      cachedRates = combined;
      cacheTimestamp = Date.now();

      setRates(combined);
      setUpdated(fxData.updated ?? cryptoData.updated);
    } catch (err) {
      setError("Failed to load rates");
      setRates(DEFAULT_RATES);
      console.error("Rate fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { rates, updated, loading, error, refresh: fetchAll };
}
