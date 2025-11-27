-- Make client_id column NOT NULL in invoices table
-- Every invoice must be associated with a client

-- First, check if there are any existing invoices with NULL client_id
-- If this migration fails, it means there are invoices without a client that need to be fixed first
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM public.invoices WHERE client_id IS NULL) THEN
        RAISE EXCEPTION 'Cannot make client_id NOT NULL: found invoices with NULL client_id. Please assign a client to all invoices before running this migration.';
    END IF;
END $$;

-- Alter the column to NOT NULL
ALTER TABLE public.invoices
ALTER COLUMN client_id SET NOT NULL;

-- Add a comment to document this constraint
COMMENT ON COLUMN public.invoices.client_id IS 'Client associated with this invoice (required)';
