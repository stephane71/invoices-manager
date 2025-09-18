import { NextRequest, NextResponse } from "next/server";
import { clientSchema } from "@/lib/validation";
import { deleteClient, getClient, upsertClient } from "@/lib/db";

export async function GET(
  _: NextRequest,
  { params }: RouteContext<"/api/clients/[id]">,
) {
  try {
    const { id } = await params;
    const data = await getClient(id);
    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext<"/api/clients/[id]">,
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = clientSchema.partial().parse(body);
    const updated = await upsertClient({ ...parsed, id });
    return NextResponse.json(updated);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: RouteContext<"/api/clients/[id]">,
) {
  try {
    const { id } = await params;
    await deleteClient(id);
    return new NextResponse(null, { status: 204 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
