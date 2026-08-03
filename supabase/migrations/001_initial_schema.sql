-- GreenCart initial schema
-- Prerequisite: configure Supabase to accept Clerk JWTs so auth.jwt()->>'sub'
-- resolves to the signed-in Clerk user ID.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  clerk_id text primary key,
  role text not null default 'customer' check (role in ('customer', 'seller')),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 180),
  description text not null default '',
  price numeric(12, 2) not null check (price >= 0),
  offer_price numeric(12, 2) not null check (offer_price >= 0 and offer_price <= price),
  category text not null check (char_length(category) between 1 and 80),
  image_urls text[] not null default '{}',
  in_stock boolean not null default true,
  seller_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  name text not null check (char_length(name) between 1 and 100),
  phone text not null check (char_length(phone) between 5 and 30),
  street text not null check (char_length(street) between 1 and 240),
  city text not null check (char_length(city) between 1 and 100),
  state text not null check (char_length(state) between 1 and 100),
  zip text not null check (char_length(zip) between 1 and 20),
  country text not null check (char_length(country) between 1 and 100),
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  items jsonb not null check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) > 0),
  amount numeric(12, 2) not null check (amount >= 0),
  address_id uuid not null references public.addresses(id) on delete restrict,
  status text not null default 'Order Placed'
    check (status in ('Order Placed', 'Packed', 'Shipped', 'Delivered', 'Cancelled')),
  payment_type text not null default 'COD' check (payment_type in ('COD', 'Online')),
  is_paid boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_seller_id_idx on public.products (seller_id);
create index if not exists addresses_user_id_idx on public.addresses (user_id);
create index if not exists orders_user_id_created_at_idx on public.orders (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;

-- Profiles are created as customers by the user or via the server. Seller roles
-- are assigned through Clerk public metadata and server-side authorization.
create policy "profiles_select_own" on public.profiles
  for select using ((select auth.jwt() ->> 'sub') = clerk_id);
create policy "profiles_insert_own_customer" on public.profiles
  for insert with check (
    (select auth.jwt() ->> 'sub') = clerk_id and role = 'customer'
  );
create policy "profiles_update_own_customer" on public.profiles
  for update using ((select auth.jwt() ->> 'sub') = clerk_id)
  with check ((select auth.jwt() ->> 'sub') = clerk_id and role = 'customer');

-- Product mutations run through server routes using the Supabase service role,
-- after Clerk verifies publicMetadata.role === 'seller'.
create policy "products_public_read" on public.products
  for select using (true);

create policy "addresses_select_own" on public.addresses
  for select using ((select auth.jwt() ->> 'sub') = user_id);
create policy "addresses_insert_own" on public.addresses
  for insert with check ((select auth.jwt() ->> 'sub') = user_id);
create policy "addresses_update_own" on public.addresses
  for update using ((select auth.jwt() ->> 'sub') = user_id)
  with check ((select auth.jwt() ->> 'sub') = user_id);
create policy "addresses_delete_own" on public.addresses
  for delete using ((select auth.jwt() ->> 'sub') = user_id);

create policy "orders_select_own" on public.orders
  for select using ((select auth.jwt() ->> 'sub') = user_id);
create policy "orders_insert_own" on public.orders
  for insert with check ((select auth.jwt() ->> 'sub') = user_id);

-- Product images are uploaded by seller-only server routes to Cloudinary.
-- The resulting secure URLs are stored in products.image_urls.
