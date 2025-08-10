import { NextRequest, NextResponse } from "next/server";
import { invoiceSchema } from "@/lib/validation";
import { listInvoices, upsertInvoice } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const data = await listInvoices({ search, status, sort: sort || undefined });
    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = invoiceSchema.partial({ id: true }).parse(json);
    const created = await upsertInvoice(parsed);
    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
