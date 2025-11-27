-- Add payment information fields to invoices table
ALTER TABLE public.invoices
ADD COLUMN IF NOT EXISTS payment_iban text,
ADD COLUMN IF NOT EXISTS payment_bic text,
ADD COLUMN IF NOT EXISTS payment_link text,
ADD COLUMN IF NOT EXISTS payment_free_text text;

-- Add comment to describe the purpose of these fields
COMMENT ON COLUMN public.invoices.payment_iban IS 'IBAN for bank transfer payments';
COMMENT ON COLUMN public.invoices.payment_bic IS 'BIC/SWIFT code for bank transfer payments';
COMMENT ON COLUMN public.invoices.payment_link IS 'URL for online payment (credit card, etc.)';
COMMENT ON COLUMN public.invoices.payment_free_text IS 'Free text field for additional payment information';
