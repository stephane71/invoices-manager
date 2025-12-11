-- Prevent client deletion by changing CASCADE to RESTRICT
-- This ensures clients cannot be deleted if they have associated invoices
ALTER TABLE invoices
DROP CONSTRAINT IF EXISTS invoices_client_id_fkey;

ALTER TABLE invoices
ADD CONSTRAINT invoices_client_id_fkey
FOREIGN KEY (client_id) REFERENCES clients(id)
ON DELETE RESTRICT;

-- Prevent product deletion by changing SET NULL to RESTRICT
-- This ensures products cannot be deleted if they are referenced in invoice items
ALTER TABLE invoice_items
DROP CONSTRAINT IF EXISTS invoice_items_product_id_fkey;

ALTER TABLE invoice_items
ADD CONSTRAINT invoice_items_product_id_fkey
FOREIGN KEY (product_id) REFERENCES products(id)
ON DELETE RESTRICT;
