-- SPLNTR waitlist table
-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role text default '',
  product text not null default 'general',
  created_at timestamptz not null default now(),
  unique (email, product)
);

-- Lock the table down: no anonymous/browser access at all.
-- Inserts happen only from the Next.js API route using the service role key.
alter table public.waitlist enable row level security;
-- (No policies created on purpose: service role bypasses RLS; everyone else is denied.)
