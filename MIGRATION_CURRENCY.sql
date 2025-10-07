-- Migration to add currency field to profiles table
-- This SQL should be run in your Supabase SQL editor

-- Add currency column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'EUR';

-- Add a comment to document the column
COMMENT ON COLUMN profiles.currency IS 'Currency code (ISO 4217) for the user account. Currently only EUR is supported.';
