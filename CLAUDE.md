# CLAUDE.md - AI Assistant Guide for InvoEase

**Last Updated:** 2025-11-25
**Project:** InvoEase - Invoice Management Application
**Version:** 0.1.0

This document provides comprehensive guidance for AI assistants (like Claude) working on the InvoEase codebase. It covers architecture, conventions, patterns, and workflows to help you navigate and contribute effectively.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Core Architectural Patterns](#core-architectural-patterns)
5. [Database Schema & Supabase](#database-schema--supabase)
6. [Authentication & Authorization](#authentication--authorization)
7. [Routing & Navigation](#routing--navigation)
8. [Form Handling & Validation](#form-handling--validation)
9. [API Patterns](#api-patterns)
10. [Component Patterns](#component-patterns)
11. [Code Style Conventions](#code-style-conventions)
12. [Development Workflows](#development-workflows)
13. [Common Tasks](#common-tasks)
14. [Key Files Reference](#key-files-reference)
15. [Troubleshooting](#troubleshooting)

---

## Project Overview

**InvoEase** is a modern full-stack invoice management application built with Next.js 16, React 19, and Supabase. It enables users to:

- Create and manage invoices with line items
- Generate professional PDF invoices
- Manage clients and products
- Track invoice status (draft, sent, paid, overdue)
- Upload product images
- Switch between English and French languages

**Key Characteristics:**
- Single-user-per-account model (account_id = auth.user.id)
- Server-first architecture with Server Components
- Type-safe with TypeScript and Zod validation
- Real-time database with Supabase
- Professional UI with shadcn/ui components

---

## Technology Stack

### Core Framework
- **Next.js 16** - App Router with React Server Components
- **React 19** - Latest React with hooks
- **TypeScript 5** - Strict type checking enabled

### Backend & Database
- **Supabase** - PostgreSQL database, authentication, storage
- **@supabase/ssr** - Server-side rendering support
- **Supabase CLI** - Database migrations and local development

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS
- **shadcn/ui** - Radix UI-based component library
- **Lucide React** - Icon library
- **Geist Font** - Vercel's font family

### Forms & Validation
- **React Hook Form** - Performant form management
- **Zod 4** - Schema validation
- **@hookform/resolvers** - Integration between RHF and Zod

### PDF Generation
- **@pdfme/generator** - PDF creation library
- **@pdfme/schemas** - PDF template schemas

### Internationalization
- **next-intl** - i18n for Next.js (English & French)

### Utilities
- **libphonenumber-js** - Phone number validation
- **clsx + tailwind-merge** - Conditional class names

---

## Directory Structure

```
/invoices-manager
├── src/
│   ├── app/                           # Next.js App Router (pages & API routes)
│   │   ├── (app)/                    # Protected routes group
│   │   │   ├── invoices/             # Invoice management pages
│   │   │   ├── clients/              # Client management pages
│   │   │   ├── products/             # Product management pages
│   │   │   ├── profil/               # User profile page
│   │   │   ├── contact/              # Contact page
│   │   │   └── layout.tsx            # App layout with auth check + sidebar
│   │   ├── (auth)/                   # Public authentication routes
│   │   │   └── sign-in/              # Sign in/up page
│   │   ├── api/                      # REST API endpoints
│   │   │   ├── invoices/             # Invoice CRUD + PDF generation
│   │   │   ├── clients/              # Client CRUD
│   │   │   ├── products/             # Product CRUD
│   │   │   └── profile/              # Profile endpoints
│   │   ├── layout.tsx                # Root layout with i18n
│   │   └── page.tsx                  # Home page (redirects to /invoices)
│   ├── components/                    # React components
│   │   ├── ui/                       # Base shadcn/ui components
│   │   ├── invoices/                 # Invoice-specific components
│   │   ├── clients/                  # Client-specific components
│   │   ├── products/                 # Product-specific components
│   │   └── sidebar-menu-links.tsx    # Navigation component
│   ├── lib/                          # Core utilities and business logic
│   │   ├── db.ts                     # Database query abstraction layer
│   │   ├── supabase/                 # Supabase client setup
│   │   │   ├── client.ts             # Browser client
│   │   │   └── server.ts             # Server-side client
│   │   ├── validation.ts             # Zod schemas for all entities
│   │   ├── storage.ts                # File upload utilities
│   │   ├── utils.ts                  # General utilities
│   │   ├── errors.ts                 # Error handling & API responses
│   │   └── constants.ts              # App constants
│   ├── types/
│   │   └── models.ts                 # TypeScript types for all entities
│   ├── hooks/                        # Custom React hooks
│   │   ├── useCreateNewClientFromNewInvoice.ts
│   │   ├── useMinDelay.ts
│   │   └── use-mobile.ts
│   └── i18n.ts                       # i18n configuration
├── messages/                          # Translation files
│   ├── en.json                       # English translations
│   └── fr.json                       # French translations
├── database/                          # Legacy migrations (deprecated)
│   └── migrations/
├── supabase/                          # Supabase configuration
│   ├── config.toml                   # Supabase CLI config
│   ├── seed.sql                      # Database seeding
│   ├── migrations/                   # Official database migrations
│   ├── LOCAL_DEVELOPMENT.md          # Local dev guide
│   ├── MIGRATIONS.md                 # Migration documentation
│   └── QUICKSTART.md                 # Quick start guide
├── scripts/
│   └── switch-env.sh                 # Environment switcher
├── .claude/                           # Claude Code configuration
│   ├── project.md                    # Project guidelines
│   ├── SUPABASE_CONNECTION.md        # Supabase connection guide
│   └── agents/                       # Custom agents
├── docs/                              # Additional documentation
│   ├── QUICK_REFERENCE.md
│   ├── ENVIRONMENT_SWITCHING.md
│   └── SECURITY.md
├── components.json                    # shadcn/ui configuration
├── next.config.ts                     # Next.js configuration
├── tsconfig.json                      # TypeScript configuration
├── tailwind.config.ts                 # Tailwind configuration
├── .env.local.development             # Local Supabase credentials (safe to commit)
├── .env.local                         # Active environment (gitignored)
└── package.json                       # Dependencies and scripts
```

---

## Core Architectural Patterns

### 1. Account Scoping Pattern

**Critical Concept:** All data is scoped to `account_id`, which equals the authenticated user's ID.

```typescript
// In lib/db.ts
const getCurrentAccountId = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");
  return user.id; // account_id = user.id
};

// All queries automatically filter by account_id
export const getInvoices = async () => {
  const accountId = await getCurrentAccountId();
  const { data } = await supabase
    .from("invoices")
    .select("*")
    .eq("account_id", accountId); // Always filter by account
  return data;
};
```

**Why:** This pattern is future-proof for multi-user accounts while maintaining data isolation.

### 2. Server Components First

**Default to Server Components** for data fetching:

```typescript
// app/(app)/invoices/page.tsx - Server Component
const InvoicesPage = async () => {
  const invoices = await getInvoices(); // Direct database query
  return <InvoicesList invoices={invoices} />;
};
```

Use Client Components only when needed:
- Forms with React Hook Form
- Interactive UI (modals, dropdowns)
- Browser APIs (localStorage, window)
- Real-time updates

### 3. API Route Pattern

REST-style API routes in `app/api/`:

```typescript
// app/api/invoices/route.ts
export const GET = async () => {
  try {
    const invoices = await getInvoices();
    return NextResponse.json(invoices);
  } catch (error) {
    return handleApiError(error);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const validated = invoiceSchema.parse(body);
    const invoice = await createInvoice(validated);
    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
};
```

### 4. Currency Handling

**Always store prices in cents (integers):**

```typescript
// Bad: Storing decimals
{ price: 19.99 } // ❌ Floating point errors

// Good: Store in cents
{ price: 1999 } // ✅ No precision loss

// Display conversion
const displayPrice = (cents: number) => (cents / 100).toFixed(2);
```

### 5. Error Handling Pattern

Standardized error responses with field-level errors:

```typescript
// lib/errors.ts
export type ApiErrorResponse = {
  error: string;
  fields?: Record<string, string>; // Field-specific errors
};

// Usage in API routes
try {
  const validated = schema.parse(data);
} catch (error) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        fields: getZodFieldErrors(error)
      },
      { status: 400 }
    );
  }
}
```

---

## Database Schema & Supabase

### Tables

**invoices**
```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES auth.users(id),
  client_id UUID REFERENCES clients(id),
  number TEXT NOT NULL,
  total_amount INTEGER NOT NULL,  -- In cents
  status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'paid', 'overdue')),
  issue_date DATE NOT NULL,
  due_date DATE,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(account_id, number)  -- Unique invoice numbers per account
);
```

**invoice_items** (Normalized, not JSONB)
```sql
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  description TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit_price INTEGER NOT NULL,  -- In cents
  tax_rate NUMERIC DEFAULT 0,
  line_total INTEGER NOT NULL,  -- In cents
  created_at TIMESTAMP DEFAULT now()
);
```

**clients**
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

**products**
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,  -- In cents
  image_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

**profiles**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### Storage Buckets

**invoices** (Private)
- Purpose: Store generated invoice PDFs
- Access: Authenticated users only (RLS policies)
- Max size: 50MB
- Path pattern: `{account_id}/{invoice_id}.pdf`

**product_images** (Public)
- Purpose: Store product images
- Access: Public read, authenticated write
- Max size: 10MB
- Path pattern: `{account_id}/{product_id}/{filename}`

### Supabase Client Usage

**Server-side** (in Server Components, API routes):
```typescript
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient(); // Uses cookies
const { data: { user } } = await supabase.auth.getUser();
```

**Client-side** (in Client Components):
```typescript
import { createBrowserClient } from "@/lib/supabase/client";

const supabase = createBrowserClient();
const { data: { user } } = await supabase.auth.getUser();
```

**Database Layer** (preferred):
```typescript
import { getInvoices, createInvoice } from "@/lib/db";

// Automatically handles account scoping
const invoices = await getInvoices();
```

---

## Authentication & Authorization

### Sign In/Sign Up

Single page handles both flows: `app/(auth)/sign-in/page.tsx`

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: data.email,
  password: data.password,
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: data.email,
  password: data.password,
});
```

### Protected Routes

All routes under `(app)/` group are protected:

```typescript
// app/(app)/layout.tsx
const AppLayout = async ({ children }) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <div>{/* Sidebar + content */}</div>;
};
```

### Data Isolation

**Account-level isolation** through:
1. `account_id` column on all tables
2. Automatic filtering in `lib/db.ts` functions
3. Row Level Security (RLS) policies on Supabase
4. Storage bucket policies for file access

**Never bypass account scoping** - all queries must filter by account_id.

---

## Routing & Navigation

### Route Groups

- **(app)/** - Protected routes requiring authentication
- **(auth)/** - Public authentication routes

Parentheses prevent the group name from appearing in URLs.

### Key Routes

| Route | Type | Purpose |
|-------|------|---------|
| `/` | Server | Redirects to `/invoices` |
| `/sign-in` | Client | Authentication (sign in/up) |
| `/invoices` | Server | Invoice list |
| `/invoices/new` | Client | Create invoice form |
| `/invoices/[id]` | Client | Invoice detail + PDF download |
| `/clients` | Server | Client list |
| `/clients/new` | Client | Create client form |
| `/clients/[id]` | Client | Edit client form |
| `/products` | Server | Product list with images |
| `/products/new` | Client | Create product form |
| `/products/[id]` | Client | Edit product form |
| `/profil` | Client | User profile settings |
| `/contact` | Server | Contact page |

### API Endpoints

All API routes follow REST conventions:

```
GET    /api/invoices           # List invoices
POST   /api/invoices           # Create invoice
GET    /api/invoices/[id]      # Get invoice
PATCH  /api/invoices/[id]      # Update invoice
DELETE /api/invoices/[id]      # Delete invoice
POST   /api/invoices/[id]/pdf  # Generate PDF

GET    /api/clients            # List clients
POST   /api/clients            # Create client
GET    /api/clients/[id]       # Get client
PATCH  /api/clients/[id]       # Update client
DELETE /api/clients/[id]       # Delete client

GET    /api/products           # List products
POST   /api/products           # Create product
GET    /api/products/[id]      # Get product
PATCH  /api/products/[id]      # Update product
DELETE /api/products/[id]      # Delete product

GET    /api/profile            # Get user profile
PUT    /api/profile            # Update profile
```

### Navigation Component

Sidebar navigation: `src/components/sidebar-menu-links.tsx`

Uses Next.js `<Link>` for client-side navigation.

---

## Form Handling & Validation

### Form Pattern (CRITICAL)

**Always follow this pattern when creating forms:**

#### 1. Create a FieldGroup Component

Location: `src/components/{entity}/{Entity}FieldGroup.tsx`

```typescript
// Example: src/components/clients/ClientFieldGroup.tsx
export const ClientFieldGroup = ({
  control,
  disabled = false,
  children,
}: {
  control: Control<ClientFormData>;
  disabled?: boolean;
  children?: React.ReactNode;
}) => {
  const t = useTranslations("Clients");

  return (
    <FieldGroup>
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              {t("name")}
            </FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              disabled={disabled}
            />
            {fieldState.invalid && (
              <FieldError>
                {fieldState.error?.message ? t(fieldState.error.message) : ""}
              </FieldError>
            )}
          </Field>
        )}
      />

      {/* More fields... */}

      {children && <div className="flex gap-2">{children}</div>}
    </FieldGroup>
  );
};
```

#### 2. Wrap in Form Tag

```typescript
// app/(app)/clients/new/page.tsx
const CreateClientPage = () => {
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: { name: "", email: "", phone: "", address: "" },
  });

  const onSubmit = async (data: ClientFormData) => {
    const response = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    // Handle response...
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <ClientFieldGroup
        control={form.control}
        disabled={form.formState.isSubmitting}
      >
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {t("create")}
        </Button>
      </ClientFieldGroup>
    </form>
  );
};
```

### Validation Schemas

All schemas in `src/lib/validation.ts`:

```typescript
import { z } from "zod";

// Reusable validators
export const emailValidator = z.string().email("invalid_email");
export const phoneValidator = z.string().regex(/^\+?[1-9]\d{1,14}$/, "invalid_phone");

// Entity schemas
export const clientSchema = z.object({
  name: z.string().min(1, "name_required"),
  email: optionalEmail,
  phone: optionalPhone,
  address: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, "name_required"),
  description: z.string().optional(),
  price: z.number().int().min(0, "price_must_be_positive"),
  image_url: z.string().url().optional(),
});

export const invoiceSchema = z.object({
  client_id: z.string().uuid("invalid_client"),
  number: z.string().min(1, "number_required"),
  issue_date: z.string().or(z.date()),
  due_date: z.string().or(z.date()).optional(),
  status: z.enum(["draft", "sent", "paid", "overdue"]),
  items: z.array(invoiceItemSchema).min(1, "at_least_one_item"),
});
```

### Form Component Structure

**Components from shadcn/ui:**
- `Field` - Wrapper for form field
- `FieldLabel` - Label element
- `FieldError` - Error message display
- `FieldGroup` - Groups multiple fields
- `Input`, `Select`, `Textarea` - Form inputs

**React Hook Form integration:**
- `useForm()` - Form hook with Zod resolver
- `Controller` - Controlled component wrapper
- `control` prop - Pass to FieldGroup components
- `fieldState` - Access validation state
- `handleSubmit` - Form submission handler

### Error Handling in Forms

**Client-side validation:**
```typescript
// Automatic with zodResolver
const form = useForm({
  resolver: zodResolver(clientSchema),
});

// Field errors displayed inline
{fieldState.invalid && (
  <FieldError>
    {fieldState.error?.message ? t(fieldState.error.message) : ""}
  </FieldError>
)}
```

**Server-side validation:**
```typescript
// API route
try {
  const validated = clientSchema.parse(body);
  // Process...
} catch (error) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        fields: getZodFieldErrors(error),
      },
      { status: 400 }
    );
  }
}

// Client handling
const response = await fetch("/api/clients", { /* ... */ });
if (!response.ok) {
  const { error, fields } = await response.json();
  // Display field errors
  Object.entries(fields || {}).forEach(([field, message]) => {
    form.setError(field as any, { message });
  });
}
```

---

## API Patterns

### Request/Response Structure

**Successful Response:**
```typescript
// 200 OK or 201 Created
{
  id: "uuid",
  name: "Client Name",
  // ... entity data
}
```

**Error Response:**
```typescript
// 400 Bad Request, 404 Not Found, etc.
{
  error: "Human-readable error message",
  fields?: {
    email: "Invalid email format",
    phone: "Phone number required"
  }
}
```

### Standard CRUD Implementation

**GET (List):**
```typescript
export const GET = async () => {
  try {
    const items = await getItems();
    return NextResponse.json(items);
  } catch (error) {
    return handleApiError(error);
  }
};
```

**POST (Create):**
```typescript
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const validated = schema.parse(body);
    const item = await createItem(validated);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
};
```

**PATCH (Update):**
```typescript
export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await req.json();
    const validated = schema.partial().parse(body);
    const item = await updateItem(params.id, validated);
    return NextResponse.json(item);
  } catch (error) {
    return handleApiError(error);
  }
};
```

**DELETE:**
```typescript
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await deleteItem(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
};
```

### Special Endpoints

**PDF Generation:** `/api/invoices/[id]/pdf`
```typescript
export const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  // 1. Get invoice data
  const invoice = await getInvoiceById(params.id);

  // 2. Generate PDF with pdfme
  const pdf = await generateInvoicePdf(invoice);

  // 3. Upload to Supabase Storage
  const { data } = await supabase.storage
    .from("invoices")
    .upload(`${accountId}/${invoice.id}.pdf`, pdf);

  // 4. Update invoice with pdf_url
  const updated = await updateInvoice(invoice.id, {
    pdf_url: data.path
  });

  return NextResponse.json(updated);
};
```

**File Upload Pattern:**
```typescript
// Parse multipart form data
const formData = await req.formData();
const file = formData.get("file") as File;

// Validate file
if (!file || file.size > MAX_SIZE) {
  return NextResponse.json(
    { error: "Invalid file" },
    { status: 400 }
  );
}

// Upload to Supabase Storage
const { data, error } = await uploadFile(file, bucket, path);
```

---

## Component Patterns

### Server Components (Default)

Use for:
- Data fetching pages
- Static content
- SEO-critical pages

```typescript
// app/(app)/clients/page.tsx
const ClientsPage = async () => {
  const clients = await getClients(); // Direct DB query

  return (
    <div>
      <h1>Clients</h1>
      {clients.map(client => (
        <Link key={client.id} href={`/clients/${client.id}`}>
          {client.name}
        </Link>
      ))}
    </div>
  );
};

export default ClientsPage;
```

### Client Components

Add `"use client"` directive when needed:
- Forms and interactive UI
- Browser APIs (window, localStorage)
- Event handlers (onClick, onChange)
- Hooks (useState, useEffect)

```typescript
"use client";

import { useState } from "react";

const InteractiveComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
};
```

### Shadcn UI Components

Base components in `src/components/ui/`:
- Button
- Input
- Select
- Dialog
- Sheet
- Field, FieldLabel, FieldError
- Separator
- Tooltip

**Always use these components** instead of native HTML elements.

### Custom Hooks

Location: `src/hooks/`

**useCreateNewClientFromNewInvoice** - Modal for creating clients from invoice form
**useMinDelay** - Ensures minimum loading duration for UX
**use-mobile** - Detects mobile viewport

```typescript
// Example usage
const { openSheet, ClientCreationSheet } = useCreateNewClientFromNewInvoice({
  onClientCreated: (client) => {
    form.setValue("client_id", client.id);
  },
});
```

---

## Code Style Conventions

### Function Declarations

**ALWAYS use arrow functions:**

```typescript
// ✅ Correct
export const MyComponent = () => {
  return <div>Hello</div>;
};

const handleClick = () => {
  console.log("clicked");
};

// ❌ Avoid
export default function MyComponent() {
  return <div>Hello</div>;
}

function handleClick() {
  console.log("clicked");
}
```

### Naming Conventions

- **Files/folders:** kebab-case (`client-field-group.tsx`)
- **Components:** PascalCase (`ClientFieldGroup`)
- **Functions/variables:** camelCase (`getClients`, `clientData`)
- **Database columns:** snake_case (`account_id`, `created_at`)
- **Constants:** SCREAMING_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Types/Interfaces:** PascalCase (`InvoiceFormData`)

### TypeScript

**Always use explicit types:**
```typescript
// ✅ Good
const getClient = async (id: string): Promise<Client | null> => {
  // ...
};

// ❌ Avoid implicit any
const getClient = async (id) => {
  // ...
};
```

**Import types explicitly:**
```typescript
import type { Client, Invoice } from "@/types/models";
```

### Imports

**Order:**
1. React imports
2. Third-party libraries
3. Internal utilities
4. Components
5. Types
6. Styles

```typescript
import { useState } from "react";
import { useTranslations } from "next-intl";
import { getClients } from "@/lib/db";
import { Button } from "@/components/ui/button";
import type { Client } from "@/types/models";
```

### Comments

**Only comment non-obvious logic:**
```typescript
// ✅ Good - explains WHY
// Convert to cents to avoid floating-point precision issues
const priceInCents = Math.round(price * 100);

// ❌ Unnecessary - obvious WHAT
// Set the name variable to the user's name
const name = user.name;
```

---

## Development Workflows

### Initial Setup

```bash
# Clone repository
git clone <repo-url>
cd invoices-manager

# Install dependencies
npm install

# Start local Supabase
npm run supabase:start

# Switch to local environment
npm run env:local

# Run development server
npm run dev
```

Access:
- App: http://localhost:3000
- Supabase Studio: http://127.0.0.1:54323
- Mailpit (email testing): http://127.0.0.1:54324

### Environment Switching

**Local Development:**
```bash
npm run env:local      # Switch to local Supabase
npm run supabase:start # Start local Supabase instance
```

**Production:**
```bash
npm run env:remote     # Switch to production Supabase
```

**Check Current:**
```bash
npm run env:status     # Show current environment
```

### Database Migrations

**Create Migration:**
```bash
npm run db:migration:new <name>
# Creates: supabase/migrations/<timestamp>_<name>.sql
```

**Apply to Remote:**
```bash
npm run db:push:dry    # Preview changes
npm run db:push        # Apply migrations
```

**Pull from Remote:**
```bash
npm run db:pull        # Download current schema
```

**Reset Local:**
```bash
npm run db:reset       # Reset local DB and rerun migrations
```

### Testing Workflow

Currently no automated testing. When adding:

1. Install testing framework
   ```bash
   npm install -D vitest @testing-library/react
   ```

2. Add test script to package.json
   ```json
   "test": "vitest",
   "test:ui": "vitest --ui"
   ```

3. Create tests adjacent to source files
   ```
   src/lib/utils.ts
   src/lib/utils.test.ts
   ```

---

## Common Tasks

### Adding a New Feature

1. **Plan database changes**
   - Create migration: `npm run db:migration:new add_feature_table`
   - Write SQL in `supabase/migrations/<timestamp>_add_feature_table.sql`
   - Test locally: `npm run db:reset`

2. **Add types**
   - Define in `src/types/models.ts`

3. **Add validation**
   - Create Zod schema in `src/lib/validation.ts`

4. **Create database functions**
   - Add CRUD functions to `src/lib/db.ts`

5. **Create API routes**
   - `src/app/api/feature/route.ts` (GET, POST)
   - `src/app/api/feature/[id]/route.ts` (GET, PATCH, DELETE)

6. **Create UI components**
   - FieldGroup: `src/components/feature/FeatureFieldGroup.tsx`
   - List view: `src/app/(app)/feature/page.tsx`
   - Create form: `src/app/(app)/feature/new/page.tsx`
   - Edit form: `src/app/(app)/feature/[id]/page.tsx`

7. **Add navigation**
   - Update `src/components/sidebar-menu-links.tsx`

8. **Add translations**
   - Add keys to `messages/en.json` and `messages/fr.json`

### Adding a New Form Field

1. **Update Zod schema**
   ```typescript
   // src/lib/validation.ts
   export const clientSchema = z.object({
     // ... existing fields
     newField: z.string().min(1, "new_field_required"),
   });
   ```

2. **Update TypeScript type**
   ```typescript
   // src/types/models.ts
   export type Client = {
     // ... existing fields
     newField: string;
   };
   ```

3. **Add to FieldGroup**
   ```typescript
   // src/components/clients/ClientFieldGroup.tsx
   <Controller
     name="newField"
     control={control}
     render={({ field, fieldState }) => (
       <Field data-invalid={fieldState.invalid}>
         <FieldLabel>{t("newField")}</FieldLabel>
         <Input {...field} />
         {fieldState.invalid && (
           <FieldError>{fieldState.error?.message}</FieldError>
         )}
       </Field>
     )}
   />
   ```

4. **Add translations**
   ```json
   // messages/en.json
   {
     "Clients": {
       "newField": "New Field",
       "new_field_required": "New field is required"
     }
   }
   ```

5. **Create database migration**
   ```sql
   -- supabase/migrations/<timestamp>_add_new_field.sql
   ALTER TABLE clients ADD COLUMN new_field TEXT;
   ```

### Debugging

**Check Supabase logs:**
```bash
npm run supabase:logs
```

**Check Supabase status:**
```bash
npm run supabase:status
```

**View database in Studio:**
```bash
# Local: http://127.0.0.1:54323
# Remote: https://supabase.com/dashboard/project/vckkkupndydwilnzpjkc
```

**Test authentication:**
```typescript
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
console.log("Current user:", user);
```

---

## Key Files Reference

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts, metadata |
| `next.config.ts` | Next.js configuration |
| `tsconfig.json` | TypeScript configuration |
| `tailwind.config.ts` | Tailwind CSS configuration |
| `components.json` | shadcn/ui configuration |
| `supabase/config.toml` | Supabase CLI configuration |

### Core Application Files

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout with i18n |
| `src/app/(app)/layout.tsx` | Protected routes layout |
| `src/lib/db.ts` | Database abstraction layer |
| `src/lib/supabase/server.ts` | Server-side Supabase client |
| `src/lib/supabase/client.ts` | Browser Supabase client |
| `src/lib/validation.ts` | All Zod schemas |
| `src/lib/errors.ts` | Error handling utilities |
| `src/types/models.ts` | TypeScript type definitions |

### Environment Files

| File | Purpose | Commit? |
|------|---------|---------|
| `.env.local.development` | Local Supabase credentials | ✅ Yes (safe) |
| `.env.local` | Active environment | ❌ No (gitignored) |
| `.env.remote` | Production credentials | ❌ No (gitignored) |

---

## Troubleshooting

### Common Issues

**"User not authenticated" errors:**
- Check if user is signed in: visit `/sign-in`
- Verify Supabase client setup
- Check auth cookies are being sent

**Database queries failing:**
- Verify `account_id` is being set correctly
- Check RLS policies in Supabase Studio
- Ensure migrations are applied: `npm run db:push`

**Form validation not working:**
- Verify Zod schema is correct
- Check `zodResolver` is configured
- Ensure field names match schema keys

**PDF generation failing:**
- Check `PDFME_FONT_URL` is accessible
- Verify invoice has all required data
- Check service role key permissions

**Environment variables not loading:**
- Verify `.env.local` exists
- Restart dev server: `npm run dev`
- Check variable names start with `NEXT_PUBLIC_` for client-side

**Supabase connection issues:**
- Check Supabase is running: `npm run supabase:status`
- Verify environment: `npm run env:status`
- Restart Supabase: `npm run supabase:stop && npm run supabase:start`

### Getting Help

1. **Documentation:**
   - `.claude/SUPABASE_CONNECTION.md` - Supabase setup
   - `supabase/LOCAL_DEVELOPMENT.md` - Local dev guide
   - `docs/QUICK_REFERENCE.md` - Quick reference

2. **Logs:**
   - Next.js: Console output from `npm run dev`
   - Supabase: `npm run supabase:logs`
   - Browser: DevTools Console

3. **Supabase Studio:**
   - Local: http://127.0.0.1:54323
   - View tables, run queries, check RLS policies

---

## Additional Resources

- **Next.js 16 Docs:** https://nextjs.org/docs
- **React 19 Docs:** https://react.dev
- **Supabase Docs:** https://supabase.com/docs
- **shadcn/ui Docs:** https://ui.shadcn.com
- **React Hook Form:** https://react-hook-form.com
- **Zod:** https://zod.dev

---

**Last Updated:** 2025-11-25
**Maintained By:** Development Team
**Questions?** Check documentation in `.claude/` and `docs/` directories.
