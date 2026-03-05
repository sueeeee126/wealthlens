-- WealthLens Initial Schema
-- Run this in the Supabase SQL Editor

-- =============================================
-- TABLES
-- =============================================

create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  language text not null default 'en',           -- 'en' | 'zh'
  display_currency text not null default 'CNY',  -- CNY|USD|HKD|EUR|GBP|AUD
  plan text not null default 'free',             -- 'free' | 'pro'
  created_at timestamptz not null default now()
);

create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  category text not null,   -- 'cash' | 'stock' | 'realestate' | 'crypto'
  value numeric not null,
  currency text not null,   -- 'CNY'|'USD'|'HKD'|'EUR'|'GBP'|'AUD'|'BTC'|'ETH'
  note text,
  is_auto_synced boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists net_worth_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  total_cny numeric not null,           -- always stored in CNY
  snapshot_date date not null,
  created_at timestamptz not null default now(),
  unique(user_id, snapshot_date)
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

alter table profiles enable row level security;
alter table assets enable row level security;
alter table net_worth_history enable row level security;

-- Profiles: users own their own row
create policy "Users own their profiles"
  on profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Assets: users own their own assets
create policy "Users own their assets"
  on assets for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- History: users own their own history
create policy "Users own their history"
  on net_worth_history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =============================================
-- TRIGGER: Auto-create profile on signup
-- =============================================

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- =============================================
-- INDEXES for performance
-- =============================================

create index if not exists idx_assets_user_id on assets(user_id);
create index if not exists idx_assets_category on assets(category);
create index if not exists idx_history_user_date on net_worth_history(user_id, snapshot_date desc);
