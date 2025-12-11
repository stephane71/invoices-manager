import { NextRequest, NextResponse } from "next/server";
import { clientSchema } from "@/lib/validation";
import { getClient, upsertClient } from "@/lib/db";
import { handleApiError } from "@/lib/errors";

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
    const errorResponse = handleApiError(e);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
