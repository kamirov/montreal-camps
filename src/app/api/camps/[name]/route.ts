import { db } from "@/lib/db";
import { camps } from "@/lib/db/schema";
import type { Camp } from "@/lib/validations/camp";
import { campUpsertSchema } from "@/lib/validations/camp";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ name: string }>;
};

// Helper function to validate admin secret
function validateAdminSecret(request: Request): boolean {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    return false;
  }

  const providedSecret = request.headers.get("x-admin-secret");
  return providedSecret === adminSecret;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { name: encodedName } = await params;
    const name = decodeURIComponent(encodedName);

    const [camp] = await db.select().from(camps).where(eq(camps.name, name));

    if (!camp) {
      return NextResponse.json({ error: "Camp not found" }, { status: 404 });
    }

    // Parse JSONB fields
    const ageRange = camp.ageRange as unknown as
      | { type: "all"; allAges: true }
      | { type: "range"; allAges: false; from: number; to: number };

    const dates = camp.dates as unknown as
      | { type: "yearRound"; yearRound: true }
      | { type: "range"; yearRound: false; fromDate: string; toDate: string };

    // Transform database row to Camp format
    const campData: Camp = {
      name: camp.name,
      borough: camp.borough ?? "",
      ageRange,
      languages: camp.languages,
      dates,
      financialAid: camp.financialAid,
      link: camp.link ?? undefined,
      phone: camp.phone
        ? {
            number: camp.phone,
            extension: camp.phoneExtension ?? undefined,
          }
        : undefined,
      email: camp.email ?? undefined,
      address: camp.address ?? "",
      latitude: camp.latitude ? parseFloat(camp.latitude) : undefined,
      longitude: camp.longitude ? parseFloat(camp.longitude) : undefined,
      notes: camp.notes ?? undefined,
    };

    return NextResponse.json(campData);
  } catch (error) {
    console.error("Error fetching camp:", error);
    return NextResponse.json(
      { error: "Failed to fetch camp" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    // Validate admin secret
    if (!validateAdminSecret(request)) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing admin secret" },
        { status: 401 }
      );
    }

    const { name: encodedName } = await params;
    const name = decodeURIComponent(encodedName);
    const body = await request.json();

    // Validate request body
    const validationResult = campUpsertSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { errors: validationResult.error.format() },
        { status: 400 }
      );
    }

    const campData = validationResult.data;

    // Convert empty email string to null
    const emailValue =
      campData.email && campData.email.trim() !== ""
        ? campData.email.trim()
        : null;

    // Handle coordinates - convert to string for numeric field or null
    const latitudeValue =
      campData.latitude != null ? campData.latitude.toString() : null;
    const longitudeValue =
      campData.longitude != null ? campData.longitude.toString() : null;

    // Handle optional phone and link
    const phoneValue = campData.phone?.number ?? null;
    const phoneExtensionValue = campData.phone?.extension ?? null;
    const linkValue = campData.link && campData.link.trim() !== "" ? campData.link : null;

    // Upsert using Drizzle's insert with onConflictDoUpdate
    await db
      .insert(camps)
      .values({
        name,
        borough: campData.borough,
        ageRange: campData.ageRange as unknown,
        languages: campData.languages,
        dates: campData.dates as unknown,
        financialAid: campData.financialAid,
        link: linkValue,
        phone: phoneValue,
        phoneExtension: phoneExtensionValue,
        email: emailValue,
        address: campData.address ?? null,
        latitude: latitudeValue,
        longitude: longitudeValue,
        notes: campData.notes ?? null,
      })
      .onConflictDoUpdate({
        target: camps.name,
        set: {
          borough: campData.borough,
          ageRange: campData.ageRange as unknown,
          languages: campData.languages,
          dates: campData.dates as unknown,
          financialAid: campData.financialAid,
          link: linkValue,
          phone: phoneValue,
          phoneExtension: phoneExtensionValue,
          email: emailValue,
          address: campData.address ?? null,
          latitude: latitudeValue,
          longitude: longitudeValue,
          notes: campData.notes ?? null,
        },
      });

    // Return the created/updated camp
    const [updatedCamp] = await db
      .select()
      .from(camps)
      .where(eq(camps.name, name));

    const ageRange = updatedCamp.ageRange as unknown as
      | { type: "all"; allAges: true }
      | { type: "range"; allAges: false; from: number; to: number };

    const dates = updatedCamp.dates as unknown as
      | { type: "yearRound"; yearRound: true }
      | { type: "range"; yearRound: false; fromDate: string; toDate: string };

    const response: Camp = {
      name: updatedCamp.name,
      borough: updatedCamp.borough ?? "",
      ageRange,
      languages: updatedCamp.languages,
      dates,
      financialAid: updatedCamp.financialAid,
      link: updatedCamp.link ?? undefined,
      phone: updatedCamp.phone
        ? {
            number: updatedCamp.phone,
            extension: updatedCamp.phoneExtension ?? undefined,
          }
        : undefined,
      email: updatedCamp.email ?? undefined,
      address: updatedCamp.address ?? "",
      latitude: updatedCamp.latitude
        ? parseFloat(updatedCamp.latitude)
        : undefined,
      longitude: updatedCamp.longitude
        ? parseFloat(updatedCamp.longitude)
        : undefined,
      notes: updatedCamp.notes ?? undefined,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error upserting camp:", error);
    return NextResponse.json(
      { error: "Failed to upsert camp" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    // Validate admin secret
    if (!validateAdminSecret(request)) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing admin secret" },
        { status: 401 }
      );
    }

    const { name: encodedName } = await params;
    const name = decodeURIComponent(encodedName);

    const [camp] = await db.select().from(camps).where(eq(camps.name, name));

    if (!camp) {
      return NextResponse.json({ error: "Camp not found" }, { status: 404 });
    }

    await db.delete(camps).where(eq(camps.name, name));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting camp:", error);
    return NextResponse.json(
      { error: "Failed to delete camp" },
      { status: 500 }
    );
  }
}
