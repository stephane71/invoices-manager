export type UUID = string;

export type Product = {
  id: UUID;
  name: string;
  description?: string | null;
  price: number; // in major currency units
  image_url?: string | null;
  created_at?: string;
};

export type Client = {
  id: UUID;
  name: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  created_at?: string;
};

export type InvoiceItem = {
  product_id: UUID;
  name: string;
  quantity: number;
  price: number; // unit price
  total: number; // quantity * price
};

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export type Invoice = {
  id: UUID;
  client_id: UUID;
  items: InvoiceItem[];
  total_amount: number;
  status: InvoiceStatus;
  issue_date: string; // ISO date
  due_date: string; // ISO date
  pdf_url?: string | null;
  created_at?: string;
  number: string;
};

export type Profile = {
  id: UUID; // equals auth.users.id
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  logo_url?: string | null;
  currency?: string | null;
  created_at?: string;
  updated_at?: string;
};
