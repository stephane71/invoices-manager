-- Add IBAN and BIC fields back to invoices table
-- These fields should be stored per invoice to capture the payment details at invoice creation time
ALTER TABLE public.invoices
ADD COLUMN IF NOT EXISTS payment_iban text,
ADD COLUMN IF NOT EXISTS payment_bic text;

-- Add comments to describe the purpose of these fields
COMMENT ON COLUMN public.invoices.payment_iban IS 'IBAN for bank transfer payments for this specific invoice';
COMMENT ON COLUMN public.invoices.payment_bic IS 'BIC/SWIFT code for bank transfer payments for this specific invoice';
