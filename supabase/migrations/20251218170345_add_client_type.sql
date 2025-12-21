-- Add client_type column to clients table
ALTER TABLE public.clients
ADD COLUMN client_type TEXT NOT NULL DEFAULT 'person';

-- Add constraint for allowed values
ALTER TABLE public.clients
ADD CONSTRAINT client_type_check
CHECK (client_type IN ('person', 'company'));

-- Update existing clients to 'person' type
UPDATE public.clients
SET client_type = 'person'
WHERE client_type IS NULL;

COMMENT ON COLUMN public.clients.client_type IS 'Type of client: person (individual) or company (legal entity)';

-- Add firstname for persons
ALTER TABLE public.clients
ADD COLUMN firstname TEXT;

-- Add TVA number for companies
ALTER TABLE public.clients
ADD COLUMN tva_number TEXT;

-- Add constraint: SIREN required for companies
ALTER TABLE public.clients
ADD CONSTRAINT siren_required_for_company
CHECK (
  (client_type = 'person') OR
  (client_type = 'company' AND siren IS NOT NULL)
);

COMMENT ON COLUMN public.clients.firstname IS 'First name for person clients';
COMMENT ON COLUMN public.clients.tva_number IS 'TVA intra-communautaire number for companies (optional)';
