import { NextRequest, NextResponse } from "next/server";
import { getClient, upsertClient } from "@/lib/db";
import { handleApiError } from "@/lib/errors";
import { clientPartialSchema } from "@/lib/validation";

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
    // The discriminated union will automatically choose the right schema based on client_type
    // Using partial schema allows updating only some fields while maintaining type safety
    const parsed = clientPartialSchema.parse(body);
    const updated = await upsertClient({ ...parsed, id });
    return NextResponse.json(updated);
  } catch (e: unknown) {
    const errorResponse = handleApiError(e);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
