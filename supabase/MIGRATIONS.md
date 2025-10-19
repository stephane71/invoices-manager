# Supabase Database Migrations

This project is configured to use Supabase's official database migration system using the Supabase CLI.

## Initial Setup

### 1. Get Your Database Password

You'll need your Supabase database password to link the project:

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/vckkkupndydwilnzpjkc
2. Navigate to **Project Settings** → **Database**
3. Copy your database password (or reset it if needed)

### 2. Link Your Project

Run the following command and enter your database password when prompted:

```bash
npx supabase link --project-ref vckkkupndydwilnzpjkc
```

Alternatively, you can set the password as an environment variable to avoid the prompt:

```bash
SUPABASE_DB_PASSWORD="your-password" npx supabase link --project-ref vckkkupndydwilnzpjkc --password "$SUPABASE_DB_PASSWORD"
```

### 3. Pull Current Database Schema (First Time Only)

After linking, pull your current database schema to create a baseline migration:

```bash
npx supabase db pull
```

This will create a migration file in `supabase/migrations/` with your current schema.

## Working with Migrations

### Creating a New Migration

When you need to make schema changes:

```bash
# Create a new empty migration file
npx supabase migration new <migration_name>

# For example:
npx supabase migration new add_products_table
```

This creates a new timestamped SQL file in `supabase/migrations/`.

### Writing Migration SQL

Edit the generated migration file and add your SQL commands:

```sql
-- Example: Create a new table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Example: Add Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
```

### Applying Migrations

#### To Local Development Database (if using Supabase local dev)

```bash
npx supabase db reset
```

#### To Remote Database (Production/Staging)

```bash
# Preview changes first (dry run)
npx supabase db push --dry-run

# Apply migrations to remote database
npx supabase db push
```

### Checking Migration Status

```bash
# List all migrations and their status
npx supabase migration list
```

### Generating Migrations from Schema Changes

If you make changes via the Supabase Dashboard, you can capture them:

```bash
# Compare remote database with local migrations
npx supabase db diff

# Save differences to a new migration file
npx supabase db diff -f <migration_name>
```

## Best Practices

1. **Always create migrations for schema changes** - Don't make changes directly in the dashboard for production
2. **Test migrations locally first** - Use `db push --dry-run` to preview changes
3. **Use descriptive migration names** - e.g., `add_invoice_status_column` instead of `update1`
4. **Keep migrations small and focused** - One logical change per migration
5. **Never modify existing migrations** that have been applied to production
6. **Always backup before applying migrations** to production

## Useful Commands Reference

```bash
# Link project
npx supabase link --project-ref vckkkupndydwilnzpjkc

# Pull current schema
npx supabase db pull

# Create new migration
npx supabase migration new <name>

# List migrations
npx supabase migration list

# Push to remote (with preview)
npx supabase db push --dry-run
npx supabase db push

# Generate migration from schema diff
npx supabase db diff -f <name>

# Reset local database
npx supabase db reset

# Dump database
npx supabase db dump > backup.sql
```

## Migration Directory Structure

```
supabase/
├── config.toml           # Supabase project configuration
├── migrations/           # SQL migration files (timestamped)
│   ├── 20231001120000_initial_schema.sql
│   ├── 20231015140000_add_products_table.sql
│   └── 20231020090000_update_invoice_constraints.sql
└── seed.sql             # (Optional) Seed data for local development
```

## Troubleshooting

### "Access token not provided" error

You need to either:
- Run `npx supabase login` (requires browser)
- Or use `--password` flag with the link command
- Or set `SUPABASE_ACCESS_TOKEN` environment variable

### "Migration already applied" error

The migration has already been run on the remote database. Check with:
```bash
npx supabase migration list
```

### Schema drift detected

Your remote database has changes not captured in migrations. Pull them:
```bash
npx supabase db diff -f sync_remote_changes
```

## Resources

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Database Migrations Guide](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli/introduction)
