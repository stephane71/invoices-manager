-- Remove logo_url column from profiles table
ALTER TABLE profiles DROP COLUMN IF EXISTS logo_url;

-- Drop storage policies for profile_logos bucket
DROP POLICY IF EXISTS "Authenticated users can read profile_logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can insert profile_logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update profile_logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete profile_logos" ON storage.objects;

-- Note: The profile_logos bucket itself should be deleted via Supabase Dashboard
-- or using the Supabase storage API, as it requires manual cleanup of files first.
--
-- Manual cleanup steps required:
-- 1. Delete all files in the 'profile_logos' bucket via Supabase Dashboard (Storage section)
-- 2. Delete the 'profile_logos' bucket itself from the Supabase Dashboard
