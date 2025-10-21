-- Migration: Convert price fields from numeric(10,2) to bigint (storing cents)
-- This ensures no floating-point arithmetic issues and stores prices as integers

-- Step 1: Convert products.price from numeric(10,2) to bigint (cents)
-- Multiply by 100 to convert to cents
ALTER TABLE products
  ALTER COLUMN price TYPE bigint
  USING (price * 100)::bigint;

-- Add comment to document the unit
COMMENT ON COLUMN products.price IS 'Price in cents (integer)';

-- Step 2: Convert invoice_items columns
-- unit_price: numeric(10,2) → bigint (cents)
ALTER TABLE invoice_items
  ALTER COLUMN unit_price TYPE bigint
  USING (unit_price * 100)::bigint;

COMMENT ON COLUMN invoice_items.unit_price IS 'Unit price in cents (integer)';

-- line_total: numeric(10,2) → bigint (cents)
ALTER TABLE invoice_items
  ALTER COLUMN line_total TYPE bigint
  USING (line_total * 100)::bigint;

COMMENT ON COLUMN invoice_items.line_total IS 'Line total in cents (integer)';

-- Step 3: Convert invoices.total_amount
ALTER TABLE invoices
  ALTER COLUMN total_amount TYPE bigint
  USING (total_amount * 100)::bigint;

COMMENT ON COLUMN invoices.total_amount IS 'Total amount in cents (integer)';

-- Note: quantity and tax_rate remain as numeric since they are not monetary values
-- quantity: can be fractional (e.g., 1.5 hours)
-- tax_rate: percentage value (e.g., 20.00%)
