import { NextRequest, NextResponse } from "next/server";
import { getProfile, upsertProfile } from "@/lib/db";
import { Profile } from "@/types/models";
import { profileSchema } from "@/lib/validation";
import { handleApiError } from "@/lib/errors";

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
    const parsed = profileSchema.partial({ id: true }).parse(body);
    const data = await upsertProfile(parsed as Partial<Profile>);
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    const errorResponse = handleApiError(err);
    return NextResponse.json(errorResponse, {
      status: errorResponse.error ? toStatus(err) : 400
    });
  }
}
