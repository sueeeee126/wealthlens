# WealthLens — Setup Instructions

## 1. Install dependencies

```bash
npm install
```

## 2. Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/migrations/001_initial.sql`
3. Go to **Authentication → Providers**:
   - Enable **Email** (already on by default)
   - Enable **Google** OAuth (add your Google OAuth credentials)
4. Copy your project credentials from **Settings → API**

## 3. Environment Variables

Edit `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

## 5. Deploy to Vercel

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy
vercel

# Add env vars in Vercel dashboard:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Or connect your GitHub repo to Vercel for auto-deploy.

## APIs Used (all free, no keys needed)

- **FX Rates**: `https://open.exchangerate-api.com/v6/latest/CNY` — free, no key
- **Crypto prices**: `https://api.coingecko.com` — free tier, no key needed

## Free Plan Limits

- Max 5 assets per user
- Upgrade path: `/pro` page (CTA shows "Coming Soon" toast for MVP)

## File Structure

```
app/
  (auth)/login/      Login page with language toggle
  (auth)/signup/     Signup page
  (app)/overview/    Dashboard with net worth + charts
  (app)/assets/      Asset list + add/edit + freemium gate
  (app)/trends/      Historical net worth trend chart
  (app)/pro/         Paywall / upgrade page
  (app)/settings/    Language, currency, sign out
  api/fx-rates/      Proxy: ExchangeRate-API (cached 1hr)
  api/crypto-prices/ Proxy: CoinGecko BTC+ETH (cached 5min)
components/
  charts/            DonutChart, TrendChart (recharts)
  forms/             AddAssetSheet bottom sheet
  layout/            BottomNav
  ui/                BottomSheet, SegmentControl, etc.
lib/
  hooks/             useAssets, useFxRates, useNetWorth
  i18n/              en.ts, zh.ts, useTranslation hook
  supabase/          client, server, types
  utils/             currency formatting, calculations
```
