-- Carbon transactions table
create table if not exists public.carbon_transactions (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null, -- references auth.users.id in Supabase
  side text not null check (side in ('farmer', 'industry')),
  crop_type text not null,
  area_ha numeric not null,
  credits numeric not null,
  unit_price numeric not null,
  total_value numeric not null,
  method_rate_tco2e_per_ha numeric not null,
  created_at timestamp with time zone default now()
);

-- Indexes
create index if not exists idx_carbon_transactions_owner on public.carbon_transactions(owner);
create index if not exists idx_carbon_transactions_created on public.carbon_transactions(created_at desc);

-- RLS
alter table public.carbon_transactions enable row level security;

-- Policies: owner can CRUD own rows
create policy if not exists "Carbon select own"
on public.carbon_transactions for select
using (auth.uid() = owner);

create policy if not exists "Carbon insert own"
on public.carbon_transactions for insert
with check (auth.uid() = owner);

create policy if not exists "Carbon update own"
on public.carbon_transactions for update
using (auth.uid() = owner);

create policy if not exists "Carbon delete own"
on public.carbon_transactions for delete
using (auth.uid() = owner);
