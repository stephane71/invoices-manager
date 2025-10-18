# Database Migrations

This directory contains SQL migration scripts for the Supabase database.

## How to Apply Migrations

### Via Supabase Dashboard (Recommended for Production)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/vckkkupndydwilnzpjkc
2. Navigate to the **SQL Editor** section
3. Open the migration file from `database/migrations/`
4. Copy and paste the SQL content into the SQL Editor
5. Review the SQL carefully
6. Click **Run** to execute the migration

### Via Supabase CLI (For Local Development)

If you have the Supabase CLI installed and configured:

```bash
# Apply a specific migration
supabase db execute --file database/migrations/[migration-file].sql

# Or connect to your remote database
psql "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres" < database/migrations/[migration-file].sql
```

## Migration History

### 20251018_fix_invoice_number_unique_per_account.sql
- **Issue:** #11
- **Description:** Fixes invoice number uniqueness to be scoped per account instead of globally
- **Changes:**
  - Drops the global unique constraint on `invoices.number`
  - Adds a composite unique constraint on `(account_id, number)`
- **Impact:** Allows different accounts to use the same invoice numbers independently

## Testing Migrations

After applying a migration:

1. Test creating invoices with the same number across different accounts
2. Verify that duplicate numbers within the same account are still rejected
3. Check that existing invoices are not affected

## Rollback

If you need to rollback a migration, reverse the operations:

For `20251018_fix_invoice_number_unique_per_account.sql`:
```sql
-- Remove the composite constraint
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_account_number_unique;

-- Add back the global unique constraint (if needed)
ALTER TABLE invoices ADD CONSTRAINT invoices_number_unique UNIQUE (number);
```

**Note:** Always backup your database before applying migrations to production!
