-- Supabase / Postgres schema for dynamic Itinerary Generator
-- Create tables, indexes, and seed data for a minimal, future-proof setup

-- 1) Distance matrix: inter-city distances and toll guidance
create table if not exists public.distance_matrix (
  id bigserial primary key,
  from_city text not null,
  to_city   text not null,
  km numeric not null,
  toll_low numeric default 0,
  toll_high numeric default 0,
  highway_note text,
  constraint dm_from_to_unique unique (from_city, to_city)
);
create index if not exists dm_from_ilike on public.distance_matrix (lower(from_city));
create index if not exists dm_to_ilike   on public.distance_matrix (lower(to_city));

-- 2) Fare rules per vehicle type
create table if not exists public.fare_rules (
  vehicle_type text primary key, -- 'sedan' | 'suv' | 'traveller' | 'luxury'
  per_km numeric not null,
  da_per_day numeric default 300,
  night_surcharge_pct numeric default 0,
  min_km numeric default 150,
  updated_at timestamptz default now()
);

-- 3) Points of Interest (POIs) used to build day plans dynamically
create table if not exists public.pois (
  id uuid primary key default gen_random_uuid(),
  city text not null,           -- canonical city name (lowercase recommended)
  name text not null,           -- POI display name
  time_hint text,               -- morning | afternoon | evening | sunset | night | etc
  why text,                     -- short reason/copy shown in plan
  duration_min integer,         -- optional expected time
  tags text[] default '{}',     -- categories e.g., {'heritage','viewpoint'}
  priority smallint default 100,-- lower shows earlier
  lat numeric,                  -- optional
  lng numeric,                  -- optional
  is_active boolean default true,
  created_at timestamptz default now()
);
create index if not exists pois_city_idx on public.pois (lower(city));
create index if not exists pois_active_idx on public.pois (is_active);

-- 4) Leads (optional, if not already present)
create table if not exists public.leads (
  id bigserial primary key,
  source text default 'web',
  status text default 'new',
  name text not null,
  whatsapp text not null,
  from_city text,
  to_city text,
  date text,
  time text,
  vehicle text,
  pax integer,
  bags integer,
  notes text,
  page text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  gclid text,
  created_at timestamptz default now()
);

-- Seed data -------------------------------------------------------------

-- distance_matrix
insert into public.distance_matrix (from_city, to_city, km, toll_low, toll_high, highway_note) values
  ('pune','mumbai',153,300,450,'Mumbai–Pune Expressway'),
  ('mumbai','lonavala',90,100,150,'Expressway'),
  ('pune','lonavala',66,90,120,'Expressway'),
  ('aurangabad','ellora',30,0,0,'Local road'),
  ('aurangabad','ajanta',100,100,150,'State highway')
on conflict (from_city, to_city) do update set km=excluded.km, toll_low=excluded.toll_low, toll_high=excluded.toll_high, highway_note=excluded.highway_note;

-- fare_rules
insert into public.fare_rules (vehicle_type, per_km, da_per_day, night_surcharge_pct, min_km) values
  ('sedan',12,300,0,150),
  ('suv',16,300,0,150),
  ('traveller',20,300,0,200)
on conflict (vehicle_type) do update set per_km=excluded.per_km, da_per_day=excluded.da_per_day, night_surcharge_pct=excluded.night_surcharge_pct, min_km=excluded.min_km;

-- POIs: Mumbai, Lonavala, Pune, Aurangabad/Ellora
insert into public.pois (city, name, time_hint, why, duration_min, tags, priority) values
  -- Mumbai
  ('mumbai','Gateway of India','morning','Iconic waterfront arch near Colaba.',90,'{"heritage","waterfront"}',10),
  ('mumbai','Colaba Causeway','afternoon','Street shopping and cafes.',90,'{"market","food"}',20),
  ('mumbai','Marine Drive Sunset','evening','Queens Necklace views at sunset.',60,'{"viewpoint","sunset"}',30),
  -- Lonavala
  ('lonavala','Tiger Point','morning','Cliff-edge views; best early.',75,'{"viewpoint"}',10),
  ('lonavala','Bhushi Dam','afternoon','Seasonal water steps; monsoon favorite.',60,'{"nature"}',20),
  ('lonavala','Maganlal Chikki','evening','Famous local sweets stop.',20,'{"food"}',30),
  -- Pune
  ('pune','Shaniwar Wada','morning','Historic fortification in old town.',60,'{"heritage"}',10),\
  ('pune','FC Road Cafes','evening','Cafe hop and quick bites.',90,'{"food"}',30),
  -- Aurangabad / Ellora
  ('ellora','Kailasa Temple','morning','World’s largest monolithic rock-cut temple.',120,'{"heritage"}',10),
  ('aurangabad','Daulatabad Fort','afternoon','Hilltop fort with panoramic views.',120,'{"heritage","viewpoint"}',20),
  ('aurangabad','Bibi Ka Maqbara','evening','Mini Taj; great for photos.',60,'{"heritage"}',30);

-- Optional RLS (example: allow anon read of POIs and distance)
-- Note: Adjust to your security posture. By default Supabase enables RLS.
-- alter table public.distance_matrix enable row level security;
-- alter table public.pois enable row level security;
-- create policy "public read distance" on public.distance_matrix for select to anon using (true);
-- create policy "public read pois" on public.pois for select to anon using (is_active);

