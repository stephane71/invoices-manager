import { NextRequest, NextResponse } from "next/server";
import { clientSchema } from "@/lib/validation";
import { listClients, upsertClient } from "@/lib/db";
import { handleApiError } from "@/lib/errors";

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
    const parsed = clientSchema.partial({ id: true }).parse(json);
    const created = await upsertClient(parsed);
    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    const errorResponse = handleApiError(e);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
