-- ============================================================
-- Barakah Basics — Database Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- Run BEFORE 002_rls_policies.sql
-- ============================================================

-- ------------------------------------------------------------
-- profiles
-- One row per anonymous user. Created during onboarding.
-- anon_id = auth.uid() from Supabase anonymous session
-- ------------------------------------------------------------
create table if not exists profiles (
  id               uuid primary key default gen_random_uuid(),
  anon_id          uuid not null unique,          -- Supabase auth.uid()
  name             text,                          -- optional first name
  baby_birth_date  date,                          -- to calculate "Day X postpartum"
  start_date       date not null default current_date,
  created_at       timestamptz not null default now()
);

-- ------------------------------------------------------------
-- daily_logs
-- One row per user per day. Upserted on every save.
-- unique(user_id, date) ensures only one log per day per user.
-- ------------------------------------------------------------
create table if not exists daily_logs (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references profiles(id) on delete cascade,
  date                date not null,
  intention           text,
  water_cups          integer not null default 0 check (water_cups >= 0 and water_cups <= 8),
  ate                 boolean not null default false,
  vitamins            boolean not null default false,
  moved               boolean not null default false,
  reflection_answer   text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  unique(user_id, date)
);

-- Auto-update updated_at on every row update
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger daily_logs_updated_at
  before update on daily_logs
  for each row execute function update_updated_at();

-- ------------------------------------------------------------
-- baby_feeds
-- One row per logged feed. Multiple per day per user.
-- date column allows easy GROUP BY date queries.
-- ------------------------------------------------------------
create table if not exists baby_feeds (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references profiles(id) on delete cascade,
  logged_at         timestamptz not null default now(),
  duration_minutes  integer check (duration_minutes is null or duration_minutes > 0),
  date              date not null default current_date
);

-- Index for fast "feeds today" queries
create index if not exists baby_feeds_user_date_idx
  on baby_feeds (user_id, date);

-- Index for fast daily_logs queries (user + date range)
create index if not exists daily_logs_user_date_idx
  on daily_logs (user_id, date);
