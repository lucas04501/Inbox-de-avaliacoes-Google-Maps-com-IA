-- Organizações (cada cliente é uma org)
create table organizations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  plan text default 'free', -- free | starter | pro
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now()
);

-- Locais cadastrados
create table locations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations not null,
  google_place_id text not null unique,
  name text not null,
  address text,
  google_account_id text, -- para Google My Business API
  last_synced_at timestamptz,
  created_at timestamptz default now()
);

-- Avaliações
create table reviews (
  id uuid primary key default gen_random_uuid(),
  location_id uuid references locations not null,
  google_review_id text not null unique,
  author_name text,
  author_photo_url text,
  rating integer check (rating between 1 and 5),
  text text,
  published_at timestamptz,
  reply_text text,
  replied_at timestamptz,
  status text default 'pending', -- pending | replied | ignored
  ai_suggestion text,
  created_at timestamptz default now()
);

-- RLS Policies
alter table organizations enable row level security;
alter table locations enable row level security;
alter table reviews enable row level security;

create policy "users see own org" on organizations for all using (user_id = auth.uid());
create policy "users see own locations" on locations for all
  using (org_id in (select id from organizations where user_id = auth.uid()));
create policy "users see own reviews" on reviews for all
  using (location_id in (
    select l.id from locations l
    join organizations o on l.org_id = o.id
    where o.user_id = auth.uid()
  ));
