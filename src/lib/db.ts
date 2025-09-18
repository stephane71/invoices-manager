import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Client, Invoice, Product } from "@/types/models";

export function db() {
  return getSupabaseServerClient();
}

export async function listClients() {
  const supabase = await db();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    throw error;
  }
  return data as Client[];
}

export async function getClient(id: string) {
  const supabase = await db();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    throw error;
  }
  return data as Client;
}

export async function upsertClient(payload: Partial<Client>) {
  const supabase = await db();
  const { data, error } = await supabase
    .from("clients")
    .upsert(payload)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data as Client;
}

export async function deleteClient(id: string) {
  const supabase = await db();
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) {
    throw error;
  }
}

export async function listProducts() {
  const supabase = await db();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    throw error;
  }

  return data as Product[];
}

export async function getProduct(id: string) {
  const supabase = await db();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    throw error;
  }
  return data as Product;
}

export async function upsertProduct(payload: Partial<Product>) {
  const supabase = await db();
  const { data, error } = await supabase
    .from("products")
    .upsert(payload)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data as Product;
}

export async function deleteProduct(id: string) {
  const supabase = await db();
  const { error } = await supabase.from("products").delete().eq("id", id);
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
  let query = supabase.from("invoices").select("*");
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
  return data as Invoice[];
}

export async function getInvoice(id: string) {
  const supabase = await db();
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    throw error;
  }
  return data as Invoice;
}

export async function upsertInvoice(payload: Partial<Invoice>) {
  const supabase = await db();
  // Ensure we never try to upsert the legacy `items` column (moved to invoice_items table)
  const { items, ...rest } = payload as any;
  const { data, error } = await supabase
    .from("invoices")
    .upsert(rest)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data as Invoice;
}

export async function deleteInvoice(id: string) {
  const supabase = await db();
  const { error } = await supabase.from("invoices").delete().eq("id", id);
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

  // 1) Insert the invoice without items
  const { items, ...invoiceFields } = payload as any;

  const { data: invoice, error } = await supabase
    .from("invoices")
    .upsert(invoiceFields)
    .select()
    .single();
  if (error) {
    throw error;
  }

  // 2) Map and bulk insert invoice items
  const rows = (items || []).map((it: any) => ({
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
