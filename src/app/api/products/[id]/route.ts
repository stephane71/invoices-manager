import { NextRequest, NextResponse } from "next/server";
import { productSchema } from "@/lib/validation";
import { getProduct, upsertProduct } from "@/lib/db";

export async function GET(
  _: NextRequest,
  { params }: RouteContext<"/api/products/[id]">,
) {
  try {
    const { id } = await params;
    const data = await getProduct(id);
    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext<"/api/products/[id]">,
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = productSchema.partial().parse(body);
    const updated = await upsertProduct({ ...parsed, id });
    return NextResponse.json(updated);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
