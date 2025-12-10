import { NextResponse } from "next/server";
import { getProfile } from "@/lib/db";
import { validateProfileForPdfGeneration } from "@/lib/validation";

/**
 * GET /api/profile/validate
 * Returns profile completeness validation result
 */
export const GET = async () => {
  try {
    const profile = await getProfile();

    // If no profile exists, return incomplete validation
    if (!profile) {
      return NextResponse.json({
        isComplete: false,
        missingFields: ["full_name", "address"],
        warnings: ["email", "phone"],
      });
    }

    const validation = validateProfileForPdfGeneration(profile);

    return NextResponse.json(validation);
  } catch (error) {
    console.error("Profile validation error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
};
