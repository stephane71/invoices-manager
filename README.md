This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Supabase Configuration

This project uses Supabase for backend database and storage. For detailed information about the Supabase connection, client usage, and best practices, see [.claude/SUPABASE_CONNECTION.md](./.claude/SUPABASE_CONNECTION.md).

### Database Migrations

This project uses Supabase's official migration system. See [supabase/MIGRATIONS.md](./supabase/MIGRATIONS.md) for detailed documentation.

Quick commands:
```bash
# Link to your Supabase project (first time setup)
npm run db:link

# Pull current database schema
npm run db:pull

# Create a new migration
npm run db:migration:new <migration_name>

# Push migrations to remote database
npm run db:push

# Preview changes before pushing
npm run db:push:dry

# List migration status
npm run db:migration:list
```

### Local Development with Supabase

You can run a complete local Supabase instance for development. See [supabase/LOCAL_DEVELOPMENT.md](./supabase/LOCAL_DEVELOPMENT.md) for detailed instructions.

Quick start:
```bash
# Start local Supabase (includes database, auth, storage, etc.)
npm run supabase:start

# Switch to local environment
npm run env:local

# Run your app
npm run dev

# Access Supabase Studio (manage database)
open http://127.0.0.1:54323

# Switch back to production when done
npm run env:remote

# Stop local Supabase
npm run supabase:stop
```

**Benefits of local development:**
- ✅ Work offline
- ✅ Faster development cycle
- ✅ Test migrations safely
- ✅ Free database resets
- ✅ Email testing with Mailpit

### Environment Switching

Easily toggle between local and remote Supabase environments. See [docs/ENVIRONMENT_SWITCHING.md](./docs/ENVIRONMENT_SWITCHING.md) for full guide.

```bash
# Switch to local development
npm run env:local

# Switch to production/remote
npm run env:remote

# Check current environment
npm run env:status
```

**Key features:**
- 🔄 One-command switching
- 💾 Automatic backups
- ✅ Safe and validated
- 🎨 Visual feedback

**Security Note:** Local development keys in `.env.local.development` are safe to commit. See [docs/SECURITY.md](./docs/SECURITY.md) for details.

## Claude Code Configuration

This project uses Claude Code with MCP servers for enhanced development capabilities. To configure:

1. Create a `.claude/settings.local.json` file (this file is gitignored):
```json
{
  "enableAllProjectMcpServers": true,
  "env": {
    "CONTEXT7_API_KEY": "your-context7-api-key"
  }
}
```

2. Get your Context7 API key from [context7.com](https://context7.com)

**Note:** Never commit `.claude/settings.local.json` as it contains sensitive API keys.

## Getting Started

First, ensure you have a `.env.local` file with the required Supabase environment variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
