import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Client, Product, Invoice } from "@/types/models";

export function db() {
  return getSupabaseServerClient();
}

export async function listClients() {
  const supabase = db();
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
  const supabase = db();
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
  const supabase = db();
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
  const supabase = db();
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) {
    throw error;
  }
}

export async function listProducts() {
  const supabase = db();
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
  const supabase = db();
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
  const supabase = db();
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
  const supabase = db();
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
  const supabase = db();
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
  const supabase = db();
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
  const supabase = db();
  const { data, error } = await supabase
    .from("invoices")
    .upsert(payload)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data as Invoice;
}

export async function deleteInvoice(id: string) {
  const supabase = db();
  const { error } = await supabase.from("invoices").delete().eq("id", id);
  if (error) {
    throw error;
  }
}
