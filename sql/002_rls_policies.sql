-- ============================================================
-- Barakah Basics — Row Level Security Policies
-- Run this in: Supabase Dashboard → SQL Editor
-- Run AFTER 001_schema.sql
-- ============================================================
-- These policies ensure users can ONLY read/write their own data.
-- anon_id = auth.uid() links the Supabase anonymous session to
-- the profiles row. All other tables join through profiles.id.
-- ============================================================

-- Enable RLS on all tables
alter table profiles    enable row level security;
alter table daily_logs  enable row level security;
alter table baby_feeds  enable row level security;

-- ============================================================
-- profiles policies
-- A user can select/insert/update their own profile row only.
-- anon_id must match auth.uid() (set by Supabase on anon login).
-- ============================================================

create policy "profiles: select own"
  on profiles for select
  using (anon_id = auth.uid());

create policy "profiles: insert own"
  on profiles for insert
  with check (anon_id = auth.uid());

create policy "profiles: update own"
  on profiles for update
  using (anon_id = auth.uid());

-- ============================================================
-- daily_logs policies
-- user_id must belong to a profile owned by auth.uid().
-- ============================================================

create policy "daily_logs: select own"
  on daily_logs for select
  using (
    user_id in (
      select id from profiles where anon_id = auth.uid()
    )
  );

create policy "daily_logs: insert own"
  on daily_logs for insert
  with check (
    user_id in (
      select id from profiles where anon_id = auth.uid()
    )
  );

create policy "daily_logs: update own"
  on daily_logs for update
  using (
    user_id in (
      select id from profiles where anon_id = auth.uid()
    )
  );

create policy "daily_logs: delete own"
  on daily_logs for delete
  using (
    user_id in (
      select id from profiles where anon_id = auth.uid()
    )
  );

-- ============================================================
-- baby_feeds policies
-- Same pattern as daily_logs.
-- ============================================================

create policy "baby_feeds: select own"
  on baby_feeds for select
  using (
    user_id in (
      select id from profiles where anon_id = auth.uid()
    )
  );

create policy "baby_feeds: insert own"
  on baby_feeds for insert
  with check (
    user_id in (
      select id from profiles where anon_id = auth.uid()
    )
  );

create policy "baby_feeds: delete own"
  on baby_feeds for delete
  using (
    user_id in (
      select id from profiles where anon_id = auth.uid()
    )
  );
