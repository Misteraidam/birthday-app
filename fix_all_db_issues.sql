-- COMPLETE FIX FOR BIRTHDAY APP DATABASE
-- Run this entire block in your Supabase SQL Editor.

-- 1. Add the missing 'views' column (Fixes "column not found" error)
ALTER TABLE "public"."portals" 
ADD COLUMN IF NOT EXISTS "views" bigint DEFAULT 0;

-- 2. Allow anyone to READ portals (Fixes "could not load portal" / 500 error)
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."portals";
CREATE POLICY "Enable read access for all users"
ON "public"."portals"
AS PERMISSIVE
FOR SELECT
TO public
USING ( true );

-- 3. Allow anyone to SAVE portals (Fixes "generate" button issues)
DROP POLICY IF EXISTS "Enable insert access for all users" ON "public"."portals";
CREATE POLICY "Enable insert access for all users"
ON "public"."portals"
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK ( true );
