import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { camps } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { campUpsertSchema } from "@/lib/validations/camp";
import type { Camp } from "@/lib/validations/camp";

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

export async function GET(
  _request: Request,
  { params }: RouteParams
) {
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
      type: camp.type as "day" | "vacation",
      borough: camp.borough,
      ageRange,
      languages: camp.languages,
      dates,
      hours: camp.hours ?? undefined,
      cost: {
        amount: parseFloat(camp.costAmount),
        period: camp.costPeriod as "year" | "month" | "week" | "hour",
      },
      financialAid: camp.financialAid,
      link: camp.link,
      phone: {
        number: camp.phone,
        extension: camp.phoneExtension ?? undefined,
      },
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

export async function PUT(
  request: Request,
  { params }: RouteParams
) {
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

    // Upsert using Drizzle's insert with onConflictDoUpdate
    await db
      .insert(camps)
      .values({
        name,
        type: campData.type,
        borough: campData.borough,
        ageRange: campData.ageRange as unknown,
        languages: campData.languages,
        dates: campData.dates as unknown,
        hours: campData.hours ?? null,
        costAmount: campData.cost.amount.toString(),
        costPeriod: campData.cost.period,
        financialAid: campData.financialAid,
        link: campData.link,
        phone: campData.phone.number,
        phoneExtension: campData.phone.extension ?? null,
        notes: campData.notes ?? null,
      })
      .onConflictDoUpdate({
        target: camps.name,
        set: {
          type: campData.type,
          borough: campData.borough,
          ageRange: campData.ageRange as unknown,
          languages: campData.languages,
          dates: campData.dates as unknown,
          hours: campData.hours ?? null,
          costAmount: campData.cost.amount.toString(),
          costPeriod: campData.cost.period,
          financialAid: campData.financialAid,
          link: campData.link,
          phone: campData.phone.number,
          phoneExtension: campData.phone.extension ?? null,
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
      type: updatedCamp.type as "day" | "vacation",
      borough: updatedCamp.borough,
      ageRange,
      languages: updatedCamp.languages,
      dates,
      hours: updatedCamp.hours ?? undefined,
      cost: {
        amount: parseFloat(updatedCamp.costAmount),
        period: updatedCamp.costPeriod as "year" | "month" | "week" | "hour",
      },
      financialAid: updatedCamp.financialAid,
      link: updatedCamp.link,
      phone: {
        number: updatedCamp.phone,
        extension: updatedCamp.phoneExtension ?? undefined,
      },
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

export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
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

