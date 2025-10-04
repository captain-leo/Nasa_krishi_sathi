-- Tables
create table if not exists farms (
  id uuid primary key default gen_random_uuid(),
  owner uuid references auth.users(id),
  name text,
  location geometry, -- optional if PostGIS enabled; else store as GeoJSON in plots
  created_at timestamptz default now()
);

create table if not exists plots (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references farms(id) on delete cascade,
  name text,
  geom jsonb, -- GeoJSON polygon
  created_at timestamptz default now()
);

create table if not exists fertilizer_applications (
  id uuid primary key default gen_random_uuid(),
  farm_id text, -- free text for hackathon; can be uuid to farms
  crop text,
  fertilizer_type text,
  amount_kg numeric,
  applied_at date,
  notes text,
  owner uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists livestock (
  id uuid primary key default gen_random_uuid(),
  type text,
  daily_feed_kg numeric,
  water_liters numeric,
  notes text,
  owner uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists datasets (
  id uuid primary key default gen_random_uuid(),
  name text,
  kind text,
  payload jsonb,
  owner uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists weather_cache (
  id uuid primary key default gen_random_uuid(),
  lat numeric,
  lon numeric,
  date_range text,
  payload jsonb,
  created_at timestamptz default now()
);

-- Enable RLS
alter table fertilizer_applications enable row level security;
alter table livestock enable row level security;
alter table datasets enable row level security;

-- Policies (owner-based). For hackathon, owner is inferred by auth.uid().
drop policy if exists "fertilizer_owner_select" on fertilizer_applications;
create policy "fertilizer_owner_select" on fertilizer_applications
for select using (owner = auth.uid());

drop policy if exists "fertilizer_owner_ins" on fertilizer_applications;
create policy "fertilizer_owner_ins" on fertilizer_applications
for insert with check (owner = auth.uid());

drop policy if exists "fertilizer_owner_upd" on fertilizer_applications;
create policy "fertilizer_owner_upd" on fertilizer_applications
for update using (owner = auth.uid());

drop policy if exists "fertilizer_owner_del" on fertilizer_applications;
create policy "fertilizer_owner_del" on fertilizer_applications
for delete using (owner = auth.uid());

drop policy if exists "livestock_owner_select" on livestock;
create policy "livestock_owner_select" on livestock
for select using (owner = auth.uid());

drop policy if exists "livestock_owner_ins" on livestock;
create policy "livestock_owner_ins" on livestock
for insert with check (owner = auth.uid());

drop policy if exists "datasets_owner_select" on datasets;
create policy "datasets_owner_select" on datasets
for select using (owner = auth.uid());

drop policy if exists "datasets_owner_ins" on datasets;
create policy "datasets_owner_ins" on datasets
for insert with check (owner = auth.uid());
