-- =========================================================
-- Great Choice Auto Sales — Supabase schema + RLS policies
-- Run this in the Supabase SQL Editor on a fresh project.
-- =========================================================

-- ---------- TABLES ----------

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  is_admin boolean default false,
  created_at timestamp default now()
);

create table cars (
  id uuid primary key default gen_random_uuid(),
  make text not null,
  model text not null,
  year int not null,
  price numeric not null,
  original_price numeric,
  mileage int,
  fuel_type text,
  transmission text,
  description text,
  body_type text check (body_type in ('sedan','suv','truck','coupe','van','hatchback','wagon')),
  features text[] default '{}',
  status text default 'available' check (status in ('draft','available','reserved','sold')),
  sold_at timestamp,
  views_count int default 0,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table car_images (
  id uuid primary key default gen_random_uuid(),
  car_id uuid references cars(id) on delete cascade,
  image_url text not null,
  sort_order int default 0,
  is_cover boolean default false
);

create table favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  car_id uuid references cars(id) on delete cascade,
  created_at timestamp default now(),
  unique(user_id, car_id)
);

create table inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  car_id uuid references cars(id),
  name text,
  phone text,
  email text,
  message text,
  channel text default 'form' check (channel in ('form','whatsapp')),
  status text default 'new' check (status in ('new','contacted','closed')),
  created_at timestamp default now()
);

create table settings (
  key text primary key,
  value text
);

-- ---------- AUTO-CREATE PROFILE ON SIGNUP ----------

create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- HELPER: is the current user an admin? ----------

create function public.is_admin()
returns boolean as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$ language sql stable security definer;

-- ---------- ROW LEVEL SECURITY ----------

alter table profiles enable row level security;
alter table cars enable row level security;
alter table car_images enable row level security;
alter table favorites enable row level security;
alter table inquiries enable row level security;
alter table settings enable row level security;

-- profiles: users manage their own row; admin can read all
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id or public.is_admin());

create policy "Users can update own profile (not is_admin)"
  on profiles for update using (auth.uid() = id);
  -- Note: revoke ability to change is_admin from the client by
  -- only ever setting is_admin via the Supabase dashboard / SQL editor.

-- cars: public can read non-draft; only admin can write
create policy "Public can view non-draft cars"
  on cars for select using (status != 'draft' or public.is_admin());

create policy "Admin can insert cars"
  on cars for insert with check (public.is_admin());

create policy "Admin can update cars"
  on cars for update using (public.is_admin());

create policy "Admin can delete cars"
  on cars for delete using (public.is_admin());

-- car_images: public can read; only admin can write
create policy "Public can view car images"
  on car_images for select using (true);

create policy "Admin can manage car images"
  on car_images for all using (public.is_admin());

-- favorites: users manage their own; admin can read all
create policy "Users can view own favorites"
  on favorites for select using (auth.uid() = user_id or public.is_admin());

create policy "Users can add own favorites"
  on favorites for insert with check (auth.uid() = user_id);

create policy "Users can remove own favorites"
  on favorites for delete using (auth.uid() = user_id);

-- inquiries: users manage their own; admin can read/update all
create policy "Users can view own inquiries"
  on inquiries for select using (auth.uid() = user_id or public.is_admin());

create policy "Anyone can submit an inquiry"
  on inquiries for insert with check (true);
  -- Guests (not logged in) can also submit the contact form.

create policy "Admin can update inquiries"
  on inquiries for update using (public.is_admin());

-- settings: public can read, only admin can write
create policy "Public can read settings"
  on settings for select using (true);

create policy "Admin can manage settings"
  on settings for all using (public.is_admin());

-- ---------- STORAGE ----------
-- Run in Supabase Dashboard > Storage after creating a "car-images" bucket
-- (set it to Public), then add these policies via the Storage policy editor
-- or SQL below:

-- insert into storage.buckets (id, name, public) values ('car-images', 'car-images', true);

-- create policy "Public can view car images"
--   on storage.objects for select using (bucket_id = 'car-images');

-- create policy "Admin can upload car images"
--   on storage.objects for insert with check (
--     bucket_id = 'car-images' and public.is_admin()
--   );

-- create policy "Admin can delete car images"
--   on storage.objects for delete using (
--     bucket_id = 'car-images' and public.is_admin()
--   );

-- ---------- FIRST ADMIN ----------
-- After you sign up your own owner account through the site once,
-- run this (with your real email) to make yourself admin:
--
-- update public.profiles set is_admin = true
-- where id = (select id from auth.users where email = 'owner@example.com');
