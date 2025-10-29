import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { camps } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { campUpsertSchema } from "@/lib/validations/camp";
import type { Camp } from "@/lib/validations/camp";

type RouteParams = {
  params: Promise<{ name: string }>;
};

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

    // Transform database row to Camp format (coordinates tuple)
    const campData: Camp = {
      name: camp.name,
      type: camp.type as "day" | "vacation",
      borough: camp.borough,
      ageRange: camp.ageRange,
      languages: camp.languages,
      dates: camp.dates,
      hours: camp.hours ?? undefined,
      cost: camp.cost,
      financialAid: camp.financialAid,
      link: camp.link,
      phone: camp.phone,
      notes: camp.notes,
      coordinates: [
        parseFloat(camp.latitude),
        parseFloat(camp.longitude),
      ] as [number, number],
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

    // Transform coordinates tuple to separate lat/lng for database
    const [latitude, longitude] = campData.coordinates;

    // Upsert using Drizzle's insert with onConflictDoUpdate
    await db
      .insert(camps)
      .values({
        name,
        type: campData.type,
        borough: campData.borough,
        ageRange: campData.ageRange,
        languages: campData.languages,
        dates: campData.dates,
        hours: campData.hours ?? null,
        cost: campData.cost,
        financialAid: campData.financialAid,
        link: campData.link,
        phone: campData.phone,
        notes: campData.notes,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      })
      .onConflictDoUpdate({
        target: camps.name,
        set: {
          type: campData.type,
          borough: campData.borough,
          ageRange: campData.ageRange,
          languages: campData.languages,
          dates: campData.dates,
          hours: campData.hours ?? null,
          cost: campData.cost,
          financialAid: campData.financialAid,
          link: campData.link,
          phone: campData.phone,
          notes: campData.notes,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        },
      });

    // Return the created/updated camp
    const [updatedCamp] = await db
      .select()
      .from(camps)
      .where(eq(camps.name, name));

    const response: Camp = {
      name: updatedCamp.name,
      type: updatedCamp.type as "day" | "vacation",
      borough: updatedCamp.borough,
      ageRange: updatedCamp.ageRange,
      languages: updatedCamp.languages,
      dates: updatedCamp.dates,
      hours: updatedCamp.hours ?? undefined,
      cost: updatedCamp.cost,
      financialAid: updatedCamp.financialAid,
      link: updatedCamp.link,
      phone: updatedCamp.phone,
      notes: updatedCamp.notes,
      coordinates: [
        parseFloat(updatedCamp.latitude),
        parseFloat(updatedCamp.longitude),
      ] as [number, number],
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

