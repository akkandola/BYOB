-- Properties: the parent record every appliance, policy and project in BYOB
-- attaches to (PRD section 12, core domain model). No owner/auth column yet;
-- that arrives with FR-01/02 account auth in a later slice.
create extension if not exists "pgcrypto";

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  property_type text not null check (
    property_type in ('house', 'flat', 'townhouse', 'bungalow', 'other')
  ),
  address text,
  notes text,
  created_at timestamptz not null default now()
);

-- RLS is enabled with no policies: until auth exists, only the server
-- (service role key, used solely in Next.js API routes) can read or write.
alter table public.properties enable row level security;
