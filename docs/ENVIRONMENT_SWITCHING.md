# Environment Switching Guide

This project includes a simple, safe environment switcher that allows you to toggle between local and remote Supabase environments with a single command.

## Quick Start

```bash
# Switch to local development environment
npm run env:local

# Switch to remote/production environment
npm run env:remote

# Check current environment
npm run env:status
```

## How It Works

The environment switcher manages three files:

1. **`.env.local`** - Active environment (used by Next.js)
2. **`.env.local.development`** - Local Supabase configuration (committed to git)
3. **`.env.remote`** - Remote Supabase configuration (gitignored, private)

When you switch environments:
- ✅ Automatically backs up current `.env.local` to `.env.local.backup`
- ✅ Safely copies the target environment to `.env.local`
- ✅ Shows you which environment is active
- ✅ Reminds you to restart your dev server

## File Structure

```
.
├── .env.local              # Active environment (gitignored)
├── .env.local.backup       # Auto-created backup (gitignored)
├── .env.local.development  # Local template (committed)
├── .env.remote             # Remote template (gitignored)
└── scripts/
    └── switch-env.sh       # Switcher script
```

## Commands

### Switch to Local Environment

```bash
npm run env:local
```

**What this does:**
- Backs up current `.env.local`
- Copies `.env.local.development` to `.env.local`
- Configures app to use local Supabase (http://127.0.0.1:54321)

**When to use:**
- Developing new features offline
- Testing migrations locally
- Working without internet connection
- Testing before deploying to production

**Requirements:**
- Local Supabase must be running: `npm run supabase:start`

### Switch to Remote Environment

```bash
npm run env:remote
```

**What this does:**
- Backs up current `.env.local`
- Copies `.env.remote` to `.env.local`
- Configures app to use production Supabase

**When to use:**
- Testing against production data
- Verifying production issues
- Testing production integrations
- Deploying/building for production

### Check Current Environment

```bash
npm run env:status
```

Shows the current `NEXT_PUBLIC_SUPABASE_URL` to verify which environment is active.

## Best Practices

### 1. Always Know Your Environment

Before making database changes, check which environment you're using:
```bash
npm run env:status
```

### 2. Use Local for Development

Default workflow should be:
```bash
# Start local Supabase
npm run supabase:start

# Switch to local
npm run env:local

# Develop!
npm run dev
```

### 3. Test Locally First

Before pushing migrations or making schema changes:
```bash
# Switch to local
npm run env:local

# Test your changes
npm run db:reset

# If it works, push to production
npm run env:remote
npm run db:push
```

### 4. Restart Dev Server After Switching

Environment variables are loaded at startup. After switching:
```bash
# Stop your dev server (Ctrl+C)
# Then restart
npm run dev
```

### 5. Keep `.env.remote` Up to Date

If you change production credentials:
```bash
# Update .env.remote manually
# Or copy from current .env.local
cp .env.local .env.remote
```

## Typical Workflows

### Daily Development Workflow

```bash
# Morning: Start fresh
npm run supabase:start
npm run env:local
npm run dev

# Develop all day...

# Evening: Stop local Supabase
npm run supabase:stop
```

### Testing Against Production

```bash
# Switch to production
npm run env:remote

# Test your feature
npm run dev

# Switch back to local
npm run env:local
```

### Migration Workflow

```bash
# Start local
npm run env:local
npm run supabase:start

# Create migration
npm run db:migration:new add_new_feature

# Edit migration file...

# Test locally
npm run db:reset

# Verify it works...

# Push to production
npm run env:remote
npm run db:push:dry  # Preview
npm run db:push      # Apply
```

## Safety Features

### Automatic Backups

Every time you switch environments, your current `.env.local` is backed up to `.env.local.backup`.

To restore:
```bash
cp .env.local.backup .env.local
```

### Error Checking

The script will error if:
- Required template files don't exist
- Invalid environment specified
- Files are missing

### Visual Feedback

The script uses colors to show:
- 🔵 Blue - Information
- 🟢 Green - Success
- 🟡 Yellow - Warnings
- 🔴 Red - Errors

## Troubleshooting

### "Error: .env.remote file not found"

**Solution:** Create the remote environment file:
```bash
# Copy your current production .env.local
cp .env.local .env.remote
```

### "Error: .env.local.development file not found"

**Solution:** This should exist in the repo. If missing:
```bash
# Recreate it (should already exist)
cp .env.local.development.example .env.local.development
```

### Changes Not Taking Effect

**Solution:** Restart your dev server:
```bash
# Ctrl+C to stop
npm run dev
```

### Accidentally Used Wrong Environment

**Solution:** Restore from backup:
```bash
cp .env.local.backup .env.local
```

Or switch back:
```bash
npm run env:remote  # or env:local
```

## Environment Variables Reference

### Local Environment (`.env.local.development`)

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
SUPABASE_SERVICE_ROLE_KEY=sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz
```

**These are safe to commit** - they only work locally!

### Remote Environment (`.env.remote`)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...  # Your production anon key
SUPABASE_SERVICE_ROLE_KEY=eyJh...      # Your production service role key
```

**Never commit these** - they provide access to production!

## Advanced Usage

### Custom Environment Switch

If you need to temporarily test with different credentials:

1. Edit `.env.local` directly
2. Or create a custom env file and copy it:
   ```bash
   cp .env.custom .env.local
   ```

### Script Location

The switcher script is at: `scripts/switch-env.sh`

You can run it directly:
```bash
./scripts/switch-env.sh local
./scripts/switch-env.sh remote
```

### Adding to CI/CD

The remote environment is automatically used in production builds on Vercel/other platforms through their environment variable configuration.

## Security Notes

✅ **Safe to commit:**
- `.env.local.development` (local credentials only)
- `scripts/switch-env.sh` (switching logic)

❌ **Never commit:**
- `.env.local` (active credentials)
- `.env.local.backup` (backup of credentials)
- `.env.remote` (production credentials)

These are already in `.gitignore`.

## Summary

The environment switcher provides a **simple, safe, and fast** way to switch between local and remote Supabase environments:

✅ One command to switch: `npm run env:local` or `npm run env:remote`
✅ Automatic backups of current environment
✅ Visual feedback and error checking
✅ No manual file editing required
✅ Safe for production credentials

**Remember:** Always check your environment before making database changes!

```bash
npm run env:status  # Quick check!
```
