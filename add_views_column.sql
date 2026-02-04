-- Fix for "column portals.views does not exist" error
-- Run this in your Supabase SQL Editor

ALTER TABLE "public"."portals" 
ADD COLUMN "views" bigint DEFAULT 0;
