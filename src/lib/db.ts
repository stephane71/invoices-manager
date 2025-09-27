import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Client, Invoice, Product, Profile } from "@/types/models";

export function db() {
  return getSupabaseServerClient();
}

// Resolve the current account identifier.
// For now, we scope accounts per authenticated user: account_id === auth.user.id
// This keeps the app single-user-per-account while allowing future multi-user accounts later.
async function getCurrentAccountId() {
  const supabase = await db();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  const user = data?.user;
  if (!user) {
    throw new Error("Not authenticated");
  }
  return user.id;
}

export async function listClients() {
  const supabase = await db();
  const accountId = await getCurrentAccountId();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("account_id", accountId)
    .order("created_at", { ascending: false });
  if (error) {
    throw error;
  }
  return data as Client[];
}

export async function getClient(id: string) {
  const supabase = await db();
  const accountId = await getCurrentAccountId();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .eq("account_id", accountId)
    .single();
  if (error) {
    throw error;
  }
  return data as Client;
}

export async function upsertClient(payload: Partial<Client>) {
  const supabase = await db();
  const accountId = await getCurrentAccountId();
  const { data, error } = await supabase
    .from("clients")
    .upsert({ ...payload, account_id: accountId })
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data as Client;
}

export async function deleteClient(id: string) {
  const supabase = await db();
  const accountId = await getCurrentAccountId();
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id)
    .eq("account_id", accountId);
  if (error) {
    throw error;
  }
}

export async function listProducts() {
  const supabase = await db();
  const accountId = await getCurrentAccountId();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("account_id", accountId)
    .order("created_at", { ascending: false });
  if (error) {
    throw error;
  }

  return data as Product[];
}

export async function getProduct(id: string) {
  const supabase = await db();
  const accountId = await getCurrentAccountId();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("account_id", accountId)
    .single();
  if (error) {
    throw error;
  }
  return data as Product;
}

export async function upsertProduct(payload: Partial<Product>) {
  const supabase = await db();
  const accountId = await getCurrentAccountId();
  const { data, error } = await supabase
    .from("products")
    .upsert({ ...payload, account_id: accountId })
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data as Product;
}

export async function deleteProduct(id: string) {
  const supabase = await db();
  const accountId = await getCurrentAccountId();
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .eq("account_id", accountId);
  if (error) {
    throw error;
  }
}

export async function listInvoices(params?: {
  search?: string;
  status?: string;
  sort?: string;
}) {
  const supabase = await db();
  // Include related client name for better list rendering
  const accountId = await getCurrentAccountId();
  let query = supabase
    .from("invoices")
    .select("*, clients(name)")
    .eq("account_id", accountId);
  if (params?.status) {
    query = query.eq("status", params.status);
  }
  if (params?.search) {
    // naive search on id
    query = query.ilike("id", `%${params.search}%`);
  }
  if (params?.sort === "date_desc") {
    query = query.order("issue_date", { ascending: false });
  } else if (params?.sort === "date_asc") {
    query = query.order("issue_date", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false });
  }
  const { data, error } = await query;
  if (error) {
    throw error;
  }
  return data;
}

export async function getInvoice(id: string) {
  const supabase = await db();
  const accountId = await getCurrentAccountId();
  // 1) Fetch the invoice row
  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*, clients(name)")
    .eq("id", id)
    .eq("account_id", accountId)
    .single();
  if (error) {
    throw error;
  }
  // 2) Fetch related items from the normalized table and map to InvoiceItem shape
  const { data: rawItems, error: itemsError } = await supabase
    .from("invoice_items")
    .select("product_id, description, quantity, unit_price, line_total")
    .eq("invoice_id", id)
    .eq("account_id", accountId)
    .order("created_at", { ascending: true });
  if (itemsError) {
    throw itemsError;
  }
  const items = (rawItems || []).map((it) => ({
    product_id: it.product_id,
    name: it.description,
    quantity: it.quantity,
    price: it.unit_price,
    total: it.line_total,
  }));
  // 3) Return the enriched invoice
  return { ...invoice, items } as Invoice & { clients: Pick<Client, "name"> };
}

export async function upsertInvoice(payload: Partial<Invoice>) {
  const supabase = await db();
  const accountId = await getCurrentAccountId();
  // Ensure we never try to upsert the legacy `items` column (moved to invoice_items table)
  const { items, ...rest } = payload;
  const { data, error } = await supabase
    .from("invoices")
    .upsert({ ...rest, account_id: accountId })
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data as Invoice;
}

export async function updateInvoice(id: string, payload: Partial<Invoice>) {
  const supabase = await db();
  const { data, error } = await supabase
    .from("invoices")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data as Client;
}

export async function deleteInvoice(id: string) {
  const supabase = await db();
  const accountId = await getCurrentAccountId();
  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id)
    .eq("account_id", accountId);
  if (error) {
    throw error;
  }
}

// Creates an invoice and its items into the new `invoice_items` table
export async function createInvoiceWithItems(
  payload: Partial<Invoice> & {
    items: Array<{
      product_id: string;
      name: string;
      quantity: number;
      price: number;
      total: number;
    }>;
  },
) {
  const supabase = await db();
  const accountId = await getCurrentAccountId();

  // 1) Insert the invoice without items
  const { items, ...invoiceFields } = payload;

  const { data: invoice, error } = await supabase
    .from("invoices")
    .upsert({ ...invoiceFields, account_id: accountId })
    .select()
    .single();
  if (error) {
    throw error;
  }

  // 2) Map and bulk insert invoice items
  const rows = (items || []).map((it) => ({
    account_id: accountId,
    invoice_id: invoice.id,
    product_id: it.product_id || null,
    description: it.name,
    quantity: it.quantity,
    unit_price: it.price,
    tax_rate: 20.0,
    line_total: it.total,
  }));

  if (rows.length > 0) {
    const { error: itemsError } = await supabase
      .from("invoice_items")
      .insert(rows);
    if (itemsError) {
      throw itemsError;
    }
  }

  return invoice as Invoice;
}

// Profile handlers
export async function getProfile() {
  const supabase = await db();
  const userId = await getCurrentAccountId();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    throw error;
  }
  return (data || null) as Profile | null;
}

export async function upsertProfile(payload: Partial<Profile>) {
  const supabase = await db();
  const userId = await getCurrentAccountId();
  const row = { id: userId, ...payload };
  const { data, error } = await supabase
    .from("profiles")
    .upsert(row)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data as Profile;
}
