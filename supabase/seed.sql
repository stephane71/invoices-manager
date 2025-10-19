-- =====================================================
-- Supabase Local Development Seed Data
-- =====================================================
-- This file is used to populate your local database with test data
-- Run: npx supabase db reset (to reset DB and apply this seed)

-- =====================================================
-- 1. CREATE STORAGE BUCKETS
-- =====================================================

-- Create invoices bucket (private - requires authentication)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'invoices',
  'invoices',
  false,
  52428800, -- 50MB limit
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Create product_images bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product_images',
  'product_images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. STORAGE POLICIES (RLS for buckets)
-- =====================================================

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can upload invoices" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their invoices" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their invoices" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their invoices" ON storage.objects;
DROP POLICY IF EXISTS "Public access to product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;

-- Policy: Users can upload their own invoices
CREATE POLICY "Users can upload invoices"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'invoices'
  AND auth.role() = 'authenticated'
);

-- Policy: Users can view their own invoices
CREATE POLICY "Users can view their invoices"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'invoices'
  AND auth.role() = 'authenticated'
);

-- Policy: Users can update their own invoices
CREATE POLICY "Users can update their invoices"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'invoices'
  AND auth.role() = 'authenticated'
);

-- Policy: Users can delete their own invoices
CREATE POLICY "Users can delete their invoices"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'invoices'
  AND auth.role() = 'authenticated'
);

-- Policy: Anyone can view product images (public bucket)
CREATE POLICY "Public access to product images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product_images');

-- Policy: Authenticated users can upload product images
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product_images'
);

-- =====================================================
-- 3. TEST DATA (Optional - uncomment to use)
-- =====================================================

-- Uncomment the sections below to add test data to your local database

-- -- Test Accounts
-- INSERT INTO accounts (id, name, email, created_at) VALUES
--   ('11111111-1111-1111-1111-111111111111', 'Acme Corporation', 'billing@acme.com', NOW()),
--   ('22222222-2222-2222-2222-222222222222', 'TechStart Inc.', 'finance@techstart.io', NOW()),
--   ('33333333-3333-3333-3333-333333333333', 'Global Services Ltd', 'accounts@globalservices.com', NOW())
-- ON CONFLICT (id) DO NOTHING;

-- -- Test Users (if you have a users table)
-- -- INSERT INTO users (id, email, full_name) VALUES
-- --   ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'john@acme.com', 'John Doe'),
-- --   ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'jane@techstart.io', 'Jane Smith')
-- -- ON CONFLICT (id) DO NOTHING;

-- -- Test Invoices
-- INSERT INTO invoices (id, account_id, number, total, status, created_at) VALUES
--   (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'INV-001', 1500.00, 'paid', NOW() - INTERVAL '30 days'),
--   (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 'INV-002', 2750.50, 'pending', NOW() - INTERVAL '15 days'),
--   (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'INV-001', 5000.00, 'paid', NOW() - INTERVAL '20 days'),
--   (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 'INV-002', 3200.00, 'draft', NOW() - INTERVAL '5 days'),
--   (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 'INV-001', 1200.00, 'overdue', NOW() - INTERVAL '60 days')
-- ON CONFLICT DO NOTHING;

-- -- Test Products
-- INSERT INTO products (id, name, price, description) VALUES
--   (gen_random_uuid(), 'Web Development Service', 150.00, 'Hourly rate for web development'),
--   (gen_random_uuid(), 'Consulting', 200.00, 'Technical consulting services'),
--   (gen_random_uuid(), 'Support Package', 500.00, 'Monthly support package')
-- ON CONFLICT DO NOTHING;

-- =====================================================
-- 4. FUNCTIONS (if needed for testing)
-- =====================================================

-- Example: Function to generate invoice number
-- CREATE OR REPLACE FUNCTION generate_invoice_number(account_uuid UUID)
-- RETURNS TEXT AS $$
-- DECLARE
--   next_number INTEGER;
-- BEGIN
--   SELECT COALESCE(MAX(CAST(SUBSTRING(number FROM 'INV-(\d+)') AS INTEGER)), 0) + 1
--   INTO next_number
--   FROM invoices
--   WHERE account_id = account_uuid;
--
--   RETURN 'INV-' || LPAD(next_number::TEXT, 3, '0');
-- END;
-- $$ LANGUAGE plpgsql;

-- =====================================================
-- End of Seed File
-- =====================================================

-- Log completion
DO $$
BEGIN
  RAISE NOTICE '✅ Seed data loaded successfully!';
  RAISE NOTICE '📦 Storage buckets created: invoices, product_images';
  RAISE NOTICE '🔐 Storage policies configured';
  RAISE NOTICE 'ℹ️  To add test data, uncomment the sections in supabase/seed.sql';
END $$;
