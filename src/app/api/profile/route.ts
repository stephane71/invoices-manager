import { NextRequest, NextResponse } from "next/server";
import { getProfile, upsertProfile } from "@/lib/db";

function toStatus(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("Not authenticated")) {
    return 401;
  }
  return 500;
}

export async function GET() {
  try {
    const data = await getProfile();
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: toStatus(err) },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    // Only allow specific fields
    const payload = {
      full_name: body.full_name ?? undefined,
      email: body.email ?? undefined,
      phone: body.phone ?? undefined,
      address: body.address ?? undefined,
      logo_url: body.logo_url ?? undefined,
    } as const;
    const data = await upsertProfile(payload as any);
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: toStatus(err) },
    );
  }
}
