import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { secret } = await request.json();

    // Check if ADMIN_SECRET is configured
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) {
      return NextResponse.json(
        { error: "Server configuration error: ADMIN_SECRET not set" },
        { status: 500 }
      );
    }

    // Validate the provided secret
    if (secret === adminSecret) {
      return NextResponse.json({ valid: true });
    }

    return NextResponse.json(
      { valid: false, error: "Invalid secret" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Error validating secret:", error);
    return NextResponse.json(
      { error: "Failed to validate secret" },
      { status: 500 }
    );
  }
}

