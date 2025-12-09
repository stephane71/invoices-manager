# Quick Reference Card

## Environment Switching

```bash
npm run env:local      # Switch to local Supabase
npm run env:remote     # Switch to remote Supabase
npm run env:status     # Check current environment
```

## Local Supabase

```bash
npm run supabase:start    # Start local instance
npm run supabase:stop     # Stop local instance
npm run supabase:status   # Check status
npm run supabase:logs     # View logs
```

## Database Migrations

```bash
npm run db:link                    # Link to remote project (first time)
npm run db:pull                    # Pull schema from remote
npm run db:migration:new <name>    # Create new migration
npm run db:migration:list          # List all migrations
npm run db:push                    # Push migrations to remote
npm run db:push:dry                # Preview changes (dry run)
npm run db:diff                    # Show schema differences
npm run db:reset                   # Reset local DB (reapply migrations)
```

## Development Workflows

### Local Development (Recommended)

```bash
npm run supabase:start      # Start local Supabase
npm run env:local           # Switch to local environment
npm run dev                 # Start Next.js app
# Develop...
npm run supabase:stop       # Stop when done
```

### Test Against Production

```bash
npm run env:remote          # Switch to production
npm run dev                 # Test your app
npm run env:local           # Switch back to local
```

### Create and Apply Migration

```bash
# Local first
npm run env:local
npm run db:migration:new my_feature
# Edit migration file...
npm run db:reset            # Test locally

# Then production
npm run env:remote
npm run db:push:dry         # Preview
npm run db:push             # Apply
```

## Local URLs

- **App**: http://localhost:3000
- **Supabase Studio**: http://127.0.0.1:54323
- **Email Testing**: http://127.0.0.1:54324
- **API**: http://127.0.0.1:54321
- **Database**: postgresql://postgres:postgres@127.0.0.1:54322/postgres

## File Structure

```
.env.local              # Active environment (auto-managed)
.env.local.development  # Local template (committed)
.env.remote             # Remote template (gitignored)
.env.local.backup       # Auto backup (gitignored)

supabase/
  ├── config.toml       # Supabase configuration
  ├── migrations/       # Database migrations
  ├── seed.sql          # Seed data for local dev
  ├── MIGRATIONS.md     # Migration guide
  ├── QUICKSTART.md     # Quick start
  └── LOCAL_DEVELOPMENT.md  # Local dev guide

docs/
  ├── ENVIRONMENT_SWITCHING.md  # Environment switcher guide
  └── QUICK_REFERENCE.md        # This file

scripts/
  └── switch-env.sh     # Environment switcher script
```

## Safety Checklist

Before `db:push` to production:

- [ ] Tested migration locally (`npm run db:reset`)
- [ ] Reviewed migration SQL carefully
- [ ] Ran dry run (`npm run db:push:dry`)
- [ ] Confirmed on correct environment (`npm run env:status`)
- [ ] Have database backup (Supabase auto-backup)
- [ ] Know how to rollback if needed

## Common Issues

### "Cannot find .env.local"
```bash
npm run env:remote  # Recreate from .env.remote
# or
cp .env.local.backup .env.local
```

### "Port already in use"
```bash
npm run supabase:stop
# Or kill process: lsof -i :54321
```

### "Migration already applied"
```bash
npm run db:migration:list  # Check status
```

### "Changes not taking effect"
```bash
# Restart dev server (Ctrl+C then npm run dev)
```

## Pro Tips

1. **Always check environment before DB changes**
   ```bash
   npm run env:status
   ```

2. **Use local for daily development**
   - Faster iterations
   - Free resets
   - Offline work

3. **Test migrations locally first**
   ```bash
   npm run env:local
   npm run db:reset  # Safe to do many times
   ```

4. **Keep .env.remote updated**
   - If production credentials change
   - Copy from current setup:
     ```bash
     cp .env.local .env.remote
     ```

5. **Use Studio for data management**
   - http://127.0.0.1:54323 (local)
   - Much easier than SQL for simple tasks

6. **Check emails in Mailpit**
   - http://127.0.0.1:54324
   - All local emails captured here

## Documentation

### Development Guides
- **Environment Switching**: [docs/ENVIRONMENT_SWITCHING.md](./ENVIRONMENT_SWITCHING.md)
- **Local Development**: [supabase/LOCAL_DEVELOPMENT.md](../supabase/LOCAL_DEVELOPMENT.md)
- **Database Migrations**: [supabase/MIGRATIONS.md](../supabase/MIGRATIONS.md)
- **Migration Quick Start**: [supabase/QUICKSTART.md](../supabase/QUICKSTART.md)
- **Main README**: [README.md](../README.md)

### Feature Documentation
- **PDF Generation Requirements**: [docs/PDF_GENERATION_REQUIREMENTS.md](./PDF_GENERATION_REQUIREMENTS.md)
- **User Profile Requirements**: [docs/USER_PROFILE_REQUIREMENTS.md](./USER_PROFILE_REQUIREMENTS.md)
