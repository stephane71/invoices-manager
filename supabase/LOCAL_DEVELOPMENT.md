# Local Supabase Development Guide

This guide will help you run the complete Supabase stack locally for development.

## What You Get with Local Supabase

When you run `supabase start`, you get a complete local instance including:

- **PostgreSQL Database** - Running on port 54322
- **PostgREST API** - Auto-generated REST API from your database schema
- **Auth Server** - Complete authentication system
- **Storage** - File storage with S3-compatible API
- **Realtime** - WebSocket support for real-time subscriptions
- **Studio** - Web UI to manage your local database (http://127.0.0.1:54323)
- **Mailpit** - Email testing server (http://127.0.0.1:54324)
- **Edge Functions** - Serverless function runtime

## Quick Start

### 1. Start Local Supabase

```bash
npx supabase start
```

This will:
- Pull Docker images (first time only)
- Start all Supabase services
- Apply migrations from `supabase/migrations/`
- Display all service URLs and credentials

### 2. Switch to Local Environment

**Recommended: Use the environment switcher**
```bash
npm run env:local
```

This automatically:
- Backs up your current `.env.local`
- Switches to local Supabase configuration
- Shows you the active environment

**Alternative: Manual switching**
If you prefer manual control:
```bash
# Backup your production env
mv .env.local .env.local.backup

# Use local env
cp .env.local.development .env.local

# When done developing, restore production
mv .env.local.backup .env.local
```

See [docs/ENVIRONMENT_SWITCHING.md](../docs/ENVIRONMENT_SWITCHING.md) for full details on the environment switcher.

### 3. Start Your Next.js App

```bash
npm run dev
```

Your app now connects to the local Supabase instance!

### 4. Access Local Services

- **Your App**: http://localhost:3000
- **Supabase Studio**: http://127.0.0.1:54323 (manage database, view tables, run SQL)
- **Email Testing**: http://127.0.0.1:54324 (see all emails sent by your app)

### 5. Stop Local Supabase

```bash
npx supabase stop
```

## Local Credentials

### Database Connection
```
Host: 127.0.0.1
Port: 54322
Database: postgres
Username: postgres
Password: postgres
```

Full connection string:
```
postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

### API Keys (Local)
```
Anon Key: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
Service Role Key: sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz
```

**Note**: These are safe to share - they only work locally!

## Working with Local Data

### Creating Storage Buckets

Your app uses storage buckets. Create them in the local instance:

1. Open Studio: http://127.0.0.1:54323
2. Go to **Storage** section
3. Create buckets:
   - `invoices` (for invoice PDFs)
   - `product_images` (for product images)

Or use SQL:
```sql
-- Create invoices bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('invoices', 'invoices', false);

-- Create product images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product_images', 'product_images', true);
```

### Seeding Test Data

Create a seed file for test data:

```bash
# Create seed.sql file
touch supabase/seed.sql
```

Add test data in `supabase/seed.sql`:
```sql
-- Example: Insert test accounts
INSERT INTO accounts (id, name, email) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Test Company Inc.', 'test@example.com'),
  ('22222222-2222-2222-2222-222222222222', 'Demo Corp', 'demo@example.com');

-- Example: Insert test invoices
INSERT INTO invoices (account_id, number, total) VALUES
  ('11111111-1111-1111-1111-111111111111', 'INV-001', 1000.00),
  ('11111111-1111-1111-1111-111111111111', 'INV-002', 2000.00);
```

Reset database with seed data:
```bash
npx supabase db reset
```

## Database Migrations with Local Dev

### Apply Migrations

When you start Supabase locally, it automatically applies all migrations in `supabase/migrations/`.

### Create New Migration

```bash
# Create new migration
npm run db:migration:new add_new_feature

# Edit the file in supabase/migrations/

# Reset local database to apply
npx supabase db reset
```

### Pull Schema from Production

```bash
# Pull current production schema
npm run db:pull

# This creates a new migration file
# Reset local DB to apply it
npx supabase db reset
```

## Useful Commands

```bash
# Start local Supabase
npx supabase start

# Stop local Supabase
npx supabase stop

# Check status
npx supabase status

# Reset database (reapplies all migrations)
npx supabase db reset

# View logs
npx supabase logs

# Open Studio in browser
open http://127.0.0.1:54323
```

## NPM Script Shortcuts

Add these to your workflow:

```bash
# Start local Supabase
npm run supabase:start

# Stop local Supabase
npm run supabase:stop

# Reset local database
npm run db:reset
```

## Troubleshooting

### Port Already in Use

If you get port conflicts:
```bash
# Stop Supabase
npx supabase stop

# Check what's using the port
lsof -i :54321

# Kill the process or change ports in config.toml
```

### Database Not Resetting

```bash
# Force stop and clean
npx supabase stop --no-backup
npx supabase start
```

### Can't Connect to Database

Check Docker is running:
```bash
docker ps
```

You should see several containers with names like:
- `supabase_db_invo-ease`
- `supabase_kong_invo-ease`
- `supabase_studio_invo-ease`

### Migrations Not Applying

```bash
# Reset with migrations
npx supabase db reset

# Check migration status
npm run db:migration:list
```

## Development Workflow

### Recommended Flow

1. **Start Supabase**
   ```bash
   npx supabase start
   ```

2. **Switch to local env**
   ```bash
   cp .env.local.development .env.local
   ```

3. **Run your app**
   ```bash
   npm run dev
   ```

4. **Make changes**
   - Edit code
   - Make schema changes via Studio or SQL
   - Test features

5. **Capture schema changes**
   ```bash
   npm run db:diff -- -f my_changes
   ```

6. **When done**
   ```bash
   # Stop Supabase
   npx supabase stop

   # Restore production env
   mv .env.local.backup .env.local
   ```

## Differences from Production

### What's the Same
- Database schema (via migrations)
- Row Level Security policies
- Storage buckets (once created)
- Edge Functions
- Auth configuration

### What's Different
- **Data** - Local database starts empty (use seed.sql)
- **URLs** - Local URLs (127.0.0.1) instead of supabase.co
- **Emails** - Captured by Mailpit instead of being sent
- **Storage files** - Stored locally, not in cloud
- **Performance** - May be slower depending on your machine

## Tips for Local Development

1. **Use Studio extensively** - http://127.0.0.1:54323
   - View and edit data
   - Run SQL queries
   - Test policies
   - Monitor logs

2. **Check emails in Mailpit** - http://127.0.0.1:54324
   - Test password reset flows
   - Verify email templates
   - Debug auth emails

3. **Reset often**
   ```bash
   npx supabase db reset
   ```
   This ensures your migrations are correct

4. **Keep seed.sql updated**
   - Add common test data
   - Makes development faster
   - Ensures consistent testing

5. **Test migrations before pushing**
   ```bash
   # Test locally first
   npx supabase db reset

   # Then push to production
   npm run db:push
   ```

## Next Steps

- Explore Studio at http://127.0.0.1:54323
- Create storage buckets for your app
- Add seed data to `supabase/seed.sql`
- Start developing with confidence!

## Resources

- [Supabase Local Development Docs](https://supabase.com/docs/guides/cli/local-development)
- [Supabase CLI Commands](https://supabase.com/docs/reference/cli)
- [Config.toml Reference](https://supabase.com/docs/guides/cli/config)
