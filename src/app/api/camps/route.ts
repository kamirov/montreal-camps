import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { camps } from "@/lib/db/schema";
import type { Camp } from "@/lib/validations/camp";

export async function GET() {
  try {
    const allCamps = await db.select().from(camps);

    // Transform database rows to Camp format
    const campsData: Camp[] = allCamps.map((camp) => {
      // Parse JSONB fields
      const ageRange = camp.ageRange as unknown as
        | { type: "all"; allAges: true }
        | { type: "range"; allAges: false; from: number; to: number };
      
      const dates = camp.dates as unknown as
        | { type: "yearRound"; yearRound: true }
        | { type: "range"; yearRound: false; fromDate: string; toDate: string };

      return {
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
        email: camp.email ?? undefined,
        address: camp.address ?? undefined,
        latitude: camp.latitude ? parseFloat(camp.latitude) : undefined,
        longitude: camp.longitude ? parseFloat(camp.longitude) : undefined,
        notes: camp.notes ?? undefined,
      };
    });

    return NextResponse.json(campsData);
  } catch (error) {
    console.error("Error fetching camps:", error);
    return NextResponse.json(
      { error: "Failed to fetch camps" },
      { status: 500 }
    );
  }
}

