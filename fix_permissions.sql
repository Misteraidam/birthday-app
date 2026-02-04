-- Run this in your Supabase SQL Editor to fix the "Could not load portal" error.

-- 1. Allow anyone to VIEW portals (Fixes the loading error)
drop policy if exists "Enable read access for all users" on "public"."portals";
create policy "Enable read access for all users"
on "public"."portals"
as PERMISSIVE
for SELECT
to public
using ( true );

-- 2. Allow anyone to CREATE portals (Ensures generation works for everyone)
drop policy if exists "Enable insert access for all users" on "public"."portals";
create policy "Enable insert access for all users"
on "public"."portals"
as PERMISSIVE
for INSERT
to public
with check ( true );
