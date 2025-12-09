-- Add structured address fields to profiles table
-- This migration splits the existing 'address' field into separate street, postal_code, and city fields

-- Add new address fields
ALTER TABLE public.profiles
ADD COLUMN address_street TEXT,
ADD COLUMN address_postal_code TEXT,
ADD COLUMN address_city TEXT;

-- Migrate existing data: parse comma-separated addresses
-- Format expected: "Street, Postal Code City" or "Street, City"
-- This handles the common French address format
UPDATE public.profiles
SET
  address_street = CASE
    WHEN address IS NOT NULL AND position(',' in address) > 0
    THEN TRIM(split_part(address, ',', 1))
    ELSE NULL
  END,
  address_city = CASE
    WHEN address IS NOT NULL AND position(',' in address) > 0
    THEN TRIM(split_part(address, ',', 2))
    ELSE NULL
  END
WHERE address IS NOT NULL;

-- Note: postal_code extraction is complex as it's mixed with city in old format
-- For now, we leave it NULL and users will need to re-enter it properly
-- The address_city field may contain both postal code and city name

-- Add comment explaining the migration
COMMENT ON COLUMN public.profiles.address_street IS 'Street address (e.g., "12 rue de la Paix")';
COMMENT ON COLUMN public.profiles.address_postal_code IS 'Postal code (e.g., "75002")';
COMMENT ON COLUMN public.profiles.address_city IS 'City name (e.g., "Paris")';
COMMENT ON COLUMN public.profiles.address IS 'Deprecated: Old single-field address. Kept for backward compatibility during transition.';
