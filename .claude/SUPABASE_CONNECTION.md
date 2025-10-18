# Supabase Connection Guide for AI Tools

This document provides comprehensive information for AI tools (like Claude Code) to understand and work with the Supabase connection in this project.

## Project Overview

This is a Next.js 15 invoice management application ("invo-ease") that uses Supabase as the backend database and storage solution.

## Supabase Configuration

### Environment Variables

The project uses the following Supabase environment variables (configured in `.env.local`):

- `NEXT_PUBLIC_SUPABASE_URL`: The Supabase project URL
  - Current: `https://vckkkupndydwilnzpjkc.supabase.co`
  - This is the public URL for the Supabase project

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anonymous/public key for client-side operations
  - Used for client-side authentication and RLS-protected operations
  - Safe to expose in browser

- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for privileged server-side operations
  - Used only in server-side code (API routes, Server Components)
  - **Never expose this in client-side code**
  - Used for operations like PDF upload to storage buckets

### Storage Buckets

The project uses two Supabase storage buckets:

1. **Invoices Bucket** (`SUPABASE_INVOICES_BUCKET=invoices`)
   - Stores generated invoice PDFs
   - Accessed via service role key for uploads

2. **Product Images Bucket** (`NEXT_PUBLIC_SUPABASE_PRODUCTS_BUCKET=product_images`)
   - Stores product images
   - Public bucket accessible via anon key

## Client Libraries

### Location: `src/lib/supabase/`

The project has two Supabase client implementations:

#### 1. Browser Client (`client.ts`)
```typescript
// Usage: For client-side components
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const supabase = createSupabaseBrowserClient();
```
- Uses `@supabase/ssr` for browser environments
- Uses public anon key
- For Client Components ("use client")

#### 2. Server Client (`server.ts`)
```typescript
// Usage: For server-side operations with cookies
import { getSupabaseServerClient } from "@/lib/supabase/server";

const supabase = await getSupabaseServerClient();
```
- Uses `@supabase/ssr` with Next.js cookies integration
- For Server Components and API routes
- Handles session management via cookies

#### 3. Service Role Client (`server.ts`)
```typescript
// Usage: For privileged server-side operations
import { getSupabaseServiceRoleClient } from "@/lib/supabase/server";

const supabase = getSupabaseServiceRoleClient();
```
- Uses service role key (bypasses RLS)
- **Only for server-side** privileged operations
- Used for storage uploads and admin tasks

## Database Schema

### Key Tables

The application manages:
- **Clients**: Customer information
- **Shops**: Shop/business information
- **Products**: Product catalog with images
- **Invoices**: Invoice records with PDF references
- **Invoice Items**: Line items for invoices

### Important Notes

- The project uses Row Level Security (RLS) for data access control
- All client-side queries must comply with RLS policies
- Service role client bypasses RLS (use cautiously)

## When to Use Which Client

| Scenario | Client to Use | Location |
|----------|--------------|----------|
| Fetching data in a Client Component | Browser Client | `client.ts` |
| Fetching data in a Server Component | Server Client | `server.ts` |
| User authentication operations | Browser/Server Client | Either |
| Uploading files to storage | Service Role Client | `server.ts` |
| Admin operations bypassing RLS | Service Role Client | `server.ts` |

## Common Operations

### Querying Data
```typescript
// In a Server Component
const supabase = await getSupabaseServerClient();
const { data, error } = await supabase
  .from('table_name')
  .select('*');
```

### Uploading to Storage
```typescript
// In API route or Server Action
const supabase = getSupabaseServiceRoleClient();
const { data, error } = await supabase
  .storage
  .from('invoices')
  .upload(path, file);
```

### Authentication
```typescript
// In Client Component
const supabase = createSupabaseBrowserClient();
const { data, error } = await supabase.auth.signIn({
  email, password
});
```

## Development Setup

1. Ensure `.env.local` exists with all required Supabase variables
2. Run `npm install` to install dependencies including:
   - `@supabase/supabase-js` (v2.54.0+)
   - `@supabase/ssr` (v0.6.1+)
3. Start dev server: `npm run dev`

## Security Best Practices

1. **Never commit** the service role key to version control
2. **Never use** service role key in client-side code
3. **Always use** RLS policies for user data protection
4. **Keep** `.env.local` in `.gitignore`
5. **Use** the appropriate client for each use case

## Troubleshooting

### Missing Environment Variables
If you see warnings about missing Supabase env vars:
- Check `.env.local` exists in project root
- Verify all three keys are present: URL, ANON_KEY, SERVICE_ROLE_KEY
- Restart the dev server after adding variables

### RLS Permission Errors
- Ensure you're using the correct client (service role for admin operations)
- Check RLS policies in Supabase dashboard
- Verify user authentication status for protected resources

### Storage Upload Failures
- Use service role client for uploads
- Verify bucket exists and is configured correctly
- Check bucket permissions in Supabase dashboard

## Additional Resources

- Supabase Project Dashboard: https://supabase.com/dashboard/project/vckkkupndydwilnzpjkc
- Supabase Documentation: https://supabase.com/docs
- Next.js App Router with Supabase: https://supabase.com/docs/guides/auth/server-side/nextjs
