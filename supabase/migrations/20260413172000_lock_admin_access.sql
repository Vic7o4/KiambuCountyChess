-- Create explicit admin allowlist table.
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamp with time zone not null default now()
);

alter table public.admin_users enable row level security;

-- Public users cannot read admin allowlist entries.
drop policy if exists "No public read on admin users" on public.admin_users;
create policy "No public read on admin users"
on public.admin_users
for select
to public
using (false);

-- Helper function for policy checks.
create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- Tighten events table policies from "any authenticated user" to approved admins only.
drop policy if exists "Authenticated users can insert events" on public.events;
drop policy if exists "Authenticated users can update events" on public.events;
drop policy if exists "Authenticated users can delete events" on public.events;

create policy "Admins can insert events"
on public.events
for insert
to authenticated
with check (public.is_admin_user());

create policy "Admins can update events"
on public.events
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

create policy "Admins can delete events"
on public.events
for delete
to authenticated
using (public.is_admin_user());

-- Tighten event image storage policies as well.
drop policy if exists "Authenticated users can upload event images" on storage.objects;
drop policy if exists "Authenticated users can update event images" on storage.objects;
drop policy if exists "Authenticated users can delete event images" on storage.objects;

create policy "Admins can upload event images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'event-images' and public.is_admin_user());

create policy "Admins can update event images"
on storage.objects
for update
to authenticated
using (bucket_id = 'event-images' and public.is_admin_user());

create policy "Admins can delete event images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'event-images' and public.is_admin_user());
