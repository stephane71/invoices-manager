import { NextRequest, NextResponse } from "next/server";
import { listClients, upsertClient } from "@/lib/db";
import { handleApiError } from "@/lib/errors";
import { clientCreateSchema } from "@/lib/validation";

export async function GET() {
  try {
    const data = await listClients();
    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    // The discriminated union will automatically choose the right schema based on client_type
    const parsed = clientCreateSchema.parse(json);
    const created = await upsertClient(parsed);
    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    console.log(e);
    const errorResponse = handleApiError(e);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
