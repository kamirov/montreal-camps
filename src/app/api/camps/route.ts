import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { camps } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { Camp } from "@/lib/validations/camp";

export async function GET() {
  try {
    const allCamps = await db.select().from(camps);

    // Transform database rows to Camp format (coordinates tuple)
    const campsData: Camp[] = allCamps.map((camp) => ({
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
    }));

    return NextResponse.json(campsData);
  } catch (error) {
    console.error("Error fetching camps:", error);
    return NextResponse.json(
      { error: "Failed to fetch camps" },
      { status: 500 }
    );
  }
}

