-- Add lastname column to clients table for person type
ALTER TABLE public.clients
ADD COLUMN lastname TEXT;

COMMENT ON COLUMN public.clients.lastname IS 'Last name for person clients';

-- Add constraint: firstname and lastname required for persons
ALTER TABLE public.clients
ADD CONSTRAINT name_fields_required_for_person
CHECK (
  (client_type = 'company') OR
  (client_type = 'person' AND firstname IS NOT NULL AND lastname IS NOT NULL)
);

-- Migrate existing data: if 'name' field exists for persons, use it as lastname
UPDATE public.clients
SET lastname = name
WHERE client_type = 'person' AND lastname IS NULL AND name IS NOT NULL;
