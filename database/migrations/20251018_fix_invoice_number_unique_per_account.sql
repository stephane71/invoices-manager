-- Migration: Fix invoice number uniqueness to be scoped per account
-- Issue: #11
-- Date: 2025-10-18
--
-- Problem: Invoice numbers are currently unique across all accounts,
-- but they should only be unique within each account.
--
-- Solution: Drop the global unique constraint on 'number' and replace it
-- with a composite unique constraint on (account_id, number).

-- Step 1: Drop the existing unique constraint on the 'number' column
-- First, we need to find the constraint name. It's likely named something like:
-- - invoices_number_key
-- - invoices_number_unique
-- Run this query to find it if needed:
-- SELECT constraint_name FROM information_schema.table_constraints
-- WHERE table_name = 'invoices' AND constraint_type = 'UNIQUE';

-- Drop the existing unique constraint (adjust the name if different)
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_number_key;
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_number_unique;

-- Step 2: Create a new composite unique constraint on (account_id, number)
-- This ensures invoice numbers are unique per account, not globally
ALTER TABLE invoices
ADD CONSTRAINT invoices_account_number_unique
UNIQUE (account_id, number);

-- Verification query (optional - for testing):
-- SELECT account_id, number, COUNT(*)
-- FROM invoices
-- GROUP BY account_id, number
-- HAVING COUNT(*) > 1;
