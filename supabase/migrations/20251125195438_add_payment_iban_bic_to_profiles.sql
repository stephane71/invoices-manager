-- Add IBAN and BIC fields to profiles table for storing user's default payment information
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS payment_iban text,
ADD COLUMN IF NOT EXISTS payment_bic text;

-- Add comments to describe the purpose of these fields
COMMENT ON COLUMN public.profiles.payment_iban IS 'Default IBAN for bank transfer payments (used in invoices)';
COMMENT ON COLUMN public.profiles.payment_bic IS 'Default BIC/SWIFT code for bank transfer payments (used in invoices)';
