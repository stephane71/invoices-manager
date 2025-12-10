import { NextRequest, NextResponse } from "next/server";
import { listProducts, upsertProduct } from "@/lib/db";
import { productSchema } from "@/lib/validation";

export async function GET() {
  try {
    const data = await listProducts();
    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = productSchema
      .partial({ id: true, account_id: true })
      .parse(json);
    const created = await upsertProduct(parsed);
    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
