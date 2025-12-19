-- Remove NOT NULL constraint from name column (not all clients need it)
-- Person clients use firstname+lastname, company clients use name
ALTER TABLE public.clients
ALTER COLUMN name DROP NOT NULL;

-- Add CHECK constraint to ensure the right fields are present based on client_type
ALTER TABLE public.clients
ADD CONSTRAINT client_fields_check
CHECK (
  (client_type = 'person' AND firstname IS NOT NULL AND lastname IS NOT NULL) OR
  (client_type = 'company' AND name IS NOT NULL)
);

COMMENT ON CONSTRAINT client_fields_check ON public.clients IS
'Ensures person clients have firstname+lastname, and company clients have name';
