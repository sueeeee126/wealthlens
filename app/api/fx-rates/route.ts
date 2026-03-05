import { NextResponse } from "next/server";

export const revalidate = 3600; // cache 1 hour

export async function GET() {
  try {
    const res = await fetch(
      "https://open.exchangerate-api.com/v6/latest/CNY",
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      throw new Error(`ExchangeRate-API error: ${res.status}`);
    }

    const data = await res.json();

    // data.rates: e.g. USD: 0.138 means 1 CNY = 0.138 USD
    // We want: how many CNY per 1 unit of each currency
    // So invertedRate[USD] = 1 / 0.138 ≈ 7.25 CNY per 1 USD
    const rawRates: Record<string, number> = data.rates;
    const invertedRates: Record<string, number> = {};

    for (const [cur, rate] of Object.entries(rawRates)) {
      if (rate && rate !== 0) {
        invertedRates[cur] = 1 / rate;
      }
    }

    // Ensure CNY = 1
    invertedRates["CNY"] = 1;

    return NextResponse.json(
      {
        rates: invertedRates,
        updated: data.time_last_update_utc,
        base: "CNY",
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch (err) {
    console.error("FX rates fetch error:", err);
    // Return fallback rates
    return NextResponse.json(
      {
        rates: {
          CNY: 1,
          USD: 7.25,
          HKD: 0.93,
          EUR: 7.85,
          GBP: 9.15,
          AUD: 4.75,
        },
        updated: null,
        base: "CNY",
        fallback: true,
      },
      { status: 200 }
    );
  }
}
