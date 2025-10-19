# Database Migration Quick Start Guide

## First Time Setup (5 minutes)

### Step 1: Link Your Project

```bash
npm run db:link
```

When prompted, enter your database password. You can find it in:
- Supabase Dashboard → Project Settings → Database → Database Password

### Step 2: Pull Current Schema

```bash
npm run db:pull
```

This creates a baseline migration with your current database schema.

**Done!** Your project is now set up for migrations.

---

## Common Workflows

### Creating a New Migration

**Scenario:** You need to add a new column to a table

```bash
# 1. Create a new migration file
npm run db:migration:new add_status_to_invoices

# 2. Edit the generated file in supabase/migrations/
# Add your SQL:
ALTER TABLE invoices ADD COLUMN status TEXT DEFAULT 'draft';

# 3. Preview the changes
npm run db:push:dry

# 4. Apply to remote database
npm run db:push
```

### Capturing Dashboard Changes

**Scenario:** You made changes via the Supabase Dashboard and want to save them

```bash
# Generate a migration from the differences
npm run db:diff -- -f sync_dashboard_changes

# This creates a new migration with the changes
# Review the file, then push it
npm run db:push
```

### Checking Migration Status

```bash
# See which migrations are applied locally and remotely
npm run db:migration:list
```

---

## Migration File Template

When you create a new migration, use this structure:

```sql
-- Description: Brief description of what this migration does
-- Date: YYYY-MM-DD

-- Step 1: Make your schema changes
CREATE TABLE new_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Add indexes if needed
CREATE INDEX idx_new_table_name ON new_table(name);

-- Step 3: Enable Row Level Security
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

-- Step 4: Add RLS policies
CREATE POLICY "Users can view their own records"
  ON new_table
  FOR SELECT
  USING (auth.uid() = user_id);
```

---

## Troubleshooting

### Error: "Access token not provided"

**Solution:** Use the database password instead:
```bash
SUPABASE_DB_PASSWORD="your-password" npm run db:link -- --password "$SUPABASE_DB_PASSWORD"
```

### Error: "Migration already applied"

**Solution:** The migration is already on the remote database. Check status:
```bash
npm run db:migration:list
```

### Schema Drift Warning

**Solution:** Your remote DB has changes not in migrations. Pull them:
```bash
npm run db:diff -- -f sync_remote_changes
```

---

## Safety Checklist

Before running `npm run db:push`:

- [ ] Reviewed the migration SQL carefully
- [ ] Tested locally if possible
- [ ] Ran `npm run db:push:dry` to preview changes
- [ ] Have a database backup (Supabase provides automatic backups)
- [ ] Know how to rollback if needed

---

## Next Steps

For detailed documentation, see [MIGRATIONS.md](./MIGRATIONS.md)

For Supabase CLI reference: https://supabase.com/docs/reference/cli
