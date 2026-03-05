import { NextResponse } from "next/server";

export const revalidate = 300; // cache 5 minutes

export async function GET() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=cny",
      {
        next: { revalidate: 300 },
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`CoinGecko API error: ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json(
      {
        BTC: data.bitcoin?.cny ?? 450000,  // CNY per 1 BTC
        ETH: data.ethereum?.cny ?? 25000,  // CNY per 1 ETH
        updated: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (err) {
    console.error("Crypto prices fetch error:", err);
    // Fallback prices
    return NextResponse.json(
      {
        BTC: 450000,
        ETH: 25000,
        updated: null,
        fallback: true,
      },
      { status: 200 }
    );
  }
}
