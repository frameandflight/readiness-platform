-- Run this in your Supabase SQL editor to set up the assessments table

create table if not exists assessments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  company_name text not null,
  respondent_name text not null,
  respondent_email text not null,
  respondent_role text,
  scores jsonb not null default '{}',
  completed boolean not null default false,
  section_progress integer not null default 0
);

-- Enable Row Level Security
alter table assessments enable row level security;

-- Allow anonymous inserts and reads (adjust for production auth)
create policy "Allow anonymous insert" on assessments
  for insert with check (true);

create policy "Allow read own" on assessments
  for select using (true);

-- Index for quick lookups
create index if not exists assessments_created_at_idx on assessments (created_at desc);
