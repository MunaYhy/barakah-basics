-- ============================================================
-- Barakah Journey — Database Schema
-- Run in: Supabase Dashboard → SQL Editor
-- Run BEFORE 002_rls_policies.sql
-- ============================================================

-- Profiles: one row per anonymous user (created at onboarding)
create table if not exists bj_profiles (
  id            uuid primary key default gen_random_uuid(),
  anon_id       uuid not null unique,   -- auth.uid() from Supabase anonymous session
  start_date    date not null,
  start_weight  numeric,
  dark_mode     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Daily tracking: one row per user per day (all DayData as JSONB)
create table if not exists bj_daily (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references bj_profiles(id) on delete cascade,
  date        date not null,
  data        jsonb not null default '{}',
  updated_at  timestamptz not null default now(),
  unique(user_id, date)
);

-- Custom habits: one row per user (full habits array as JSONB)
create table if not exists bj_habits (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references bj_profiles(id) on delete cascade unique,
  habits      jsonb not null default '[]',
  updated_at  timestamptz not null default now()
);

-- Weight milestones: one row per user per milestone day (1/22/43/64/90)
create table if not exists bj_weight (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references bj_profiles(id) on delete cascade,
  milestone   integer not null,
  weight      numeric not null,
  updated_at  timestamptz not null default now(),
  unique(user_id, milestone)
);

-- Body measurements: one row per user per milestone (JSONB)
create table if not exists bj_measurements (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references bj_profiles(id) on delete cascade,
  milestone   integer not null,
  data        jsonb not null default '{}',
  updated_at  timestamptz not null default now(),
  unique(user_id, milestone)
);

-- Weekly reviews: one row per user per week (1-13)
create table if not exists bj_weekly (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references bj_profiles(id) on delete cascade,
  week        integer not null,
  stars       integer,
  well        text,
  impr        text,
  focus       text,
  quote       text,
  updated_at  timestamptz not null default now(),
  unique(user_id, week)
);

-- Weekly rewards: one row per user per week
create table if not exists bj_rewards (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references bj_profiles(id) on delete cascade,
  week          integer not null,
  selected_tag  text,
  custom        text,
  done          boolean not null default false,
  updated_at    timestamptz not null default now(),
  unique(user_id, week)
);

-- Auto-update updated_at trigger
create or replace function bj_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger bj_profiles_updated_at    before update on bj_profiles    for each row execute function bj_set_updated_at();
create trigger bj_daily_updated_at       before update on bj_daily       for each row execute function bj_set_updated_at();
create trigger bj_habits_updated_at      before update on bj_habits      for each row execute function bj_set_updated_at();
create trigger bj_weight_updated_at      before update on bj_weight      for each row execute function bj_set_updated_at();
create trigger bj_measurements_updated_at before update on bj_measurements for each row execute function bj_set_updated_at();
create trigger bj_weekly_updated_at      before update on bj_weekly      for each row execute function bj_set_updated_at();
create trigger bj_rewards_updated_at     before update on bj_rewards     for each row execute function bj_set_updated_at();

-- Indexes for fast queries
create index if not exists bj_daily_user_date_idx        on bj_daily (user_id, date);
create index if not exists bj_weight_user_idx            on bj_weight (user_id);
create index if not exists bj_measurements_user_idx      on bj_measurements (user_id);
create index if not exists bj_weekly_user_idx            on bj_weekly (user_id);
create index if not exists bj_rewards_user_idx           on bj_rewards (user_id);
