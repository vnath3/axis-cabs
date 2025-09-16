-- Normalize and future-proof distance_matrix matching

-- 1) Add stored normalized columns (lower+trim) for robust equality
alter table public.distance_matrix
  add column if not exists from_city_norm text generated always as (lower(trim(from_city))) stored,
  add column if not exists to_city_norm   text generated always as (lower(trim(to_city)))   stored;

-- 2) Useful indexes
create index if not exists dm_from_norm_idx on public.distance_matrix (from_city_norm);
create index if not exists dm_to_norm_idx   on public.distance_matrix (to_city_norm);

-- 3) Optional unique constraint on normalized pair (comment if not desired)
do $$ begin
  alter table public.distance_matrix
    add constraint dm_from_to_norm_unique unique (from_city_norm, to_city_norm);
exception when duplicate_object then null; end $$;

-- 4) One-time cleanup of existing trailing spaces and NBSPs
update public.distance_matrix
set from_city = trim(replace(from_city, E'\u00a0',' ')),
    to_city   = trim(replace(to_city,   E'\u00a0',' '));

