-- ============================================================
-- Barakah Journey — Row Level Security Policies
-- Run AFTER 001_schema.sql
-- Also enable Anonymous sign-ins:
--   Supabase → Authentication → Configuration → Sign In / Sign Up
-- ============================================================

alter table bj_profiles     enable row level security;
alter table bj_daily        enable row level security;
alter table bj_habits       enable row level security;
alter table bj_weight       enable row level security;
alter table bj_measurements enable row level security;
alter table bj_weekly       enable row level security;
alter table bj_rewards      enable row level security;

-- bj_profiles: user owns row where anon_id = auth.uid()
create policy "bj_profiles: select own" on bj_profiles for select using (anon_id = auth.uid());
create policy "bj_profiles: insert own" on bj_profiles for insert with check (anon_id = auth.uid());
create policy "bj_profiles: update own" on bj_profiles for update using (anon_id = auth.uid());

-- Helper: check user_id belongs to current user
-- All other tables use this pattern
create policy "bj_daily: select own"   on bj_daily for select using (user_id in (select id from bj_profiles where anon_id = auth.uid()));
create policy "bj_daily: insert own"   on bj_daily for insert with check (user_id in (select id from bj_profiles where anon_id = auth.uid()));
create policy "bj_daily: update own"   on bj_daily for update using (user_id in (select id from bj_profiles where anon_id = auth.uid()));
create policy "bj_daily: delete own"   on bj_daily for delete using (user_id in (select id from bj_profiles where anon_id = auth.uid()));

create policy "bj_habits: select own"  on bj_habits for select using (user_id in (select id from bj_profiles where anon_id = auth.uid()));
create policy "bj_habits: insert own"  on bj_habits for insert with check (user_id in (select id from bj_profiles where anon_id = auth.uid()));
create policy "bj_habits: update own"  on bj_habits for update using (user_id in (select id from bj_profiles where anon_id = auth.uid()));

create policy "bj_weight: select own"  on bj_weight for select using (user_id in (select id from bj_profiles where anon_id = auth.uid()));
create policy "bj_weight: insert own"  on bj_weight for insert with check (user_id in (select id from bj_profiles where anon_id = auth.uid()));
create policy "bj_weight: update own"  on bj_weight for update using (user_id in (select id from bj_profiles where anon_id = auth.uid()));

create policy "bj_measurements: select own" on bj_measurements for select using (user_id in (select id from bj_profiles where anon_id = auth.uid()));
create policy "bj_measurements: insert own" on bj_measurements for insert with check (user_id in (select id from bj_profiles where anon_id = auth.uid()));
create policy "bj_measurements: update own" on bj_measurements for update using (user_id in (select id from bj_profiles where anon_id = auth.uid()));

create policy "bj_weekly: select own"  on bj_weekly for select using (user_id in (select id from bj_profiles where anon_id = auth.uid()));
create policy "bj_weekly: insert own"  on bj_weekly for insert with check (user_id in (select id from bj_profiles where anon_id = auth.uid()));
create policy "bj_weekly: update own"  on bj_weekly for update using (user_id in (select id from bj_profiles where anon_id = auth.uid()));

create policy "bj_rewards: select own" on bj_rewards for select using (user_id in (select id from bj_profiles where anon_id = auth.uid()));
create policy "bj_rewards: insert own" on bj_rewards for insert with check (user_id in (select id from bj_profiles where anon_id = auth.uid()));
create policy "bj_rewards: update own" on bj_rewards for update using (user_id in (select id from bj_profiles where anon_id = auth.uid()));
