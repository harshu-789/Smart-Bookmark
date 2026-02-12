-- Supabase migration to create bookmarks table and row-level security

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text,
  url text not null,
  created_at timestamptz default now()
);

-- Enable row level security
alter table public.bookmarks enable row level security;

-- Allow users to insert their own bookmarks
create policy "Allow insert for authenticated" on public.bookmarks
  for insert
  with check (auth.uid() = user_id);

-- Allow users to select their own bookmarks
create policy "Allow select for owner" on public.bookmarks
  for select
  using (auth.uid() = user_id);

-- Allow users to delete/update their own bookmarks
create policy "Allow modify for owner" on public.bookmarks
  for update, delete
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
