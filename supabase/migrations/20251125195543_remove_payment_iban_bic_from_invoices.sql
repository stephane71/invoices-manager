-- Remove IBAN and BIC fields from invoices table (moved to profiles table)
-- These fields are now stored in the user's profile as they rarely change per invoice
ALTER TABLE public.invoices
DROP COLUMN IF EXISTS payment_iban,
DROP COLUMN IF EXISTS payment_bic;
