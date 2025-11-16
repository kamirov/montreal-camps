import { NextResponse } from "next/server";

async function geocodeWithRetry(
  address: string,
  retries = 3,
  delay = 1000
): Promise<{ lat: number; lng: number } | null> {
  const query = encodeURIComponent(`${address}, Montreal, QC, Canada`);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "MontrealCamps/1.0 (https://montreal-camps.vercel.app)",
        },
        // Add timeout
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(
          `Nominatim API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }

      return null;
    } catch (error: any) {
      const isLastAttempt = attempt === retries;
      const isTimeout =
        error?.name === "TimeoutError" || error?.code === "ECONNREFUSED";

      if (isLastAttempt) {
        console.error(
          `Failed to geocode address after ${retries} attempts:`,
          address,
          error
        );
        return null;
      }

      // Wait before retrying, with exponential backoff
      const waitTime = delay * attempt;
      console.warn(
        `Geocoding attempt ${attempt} failed for "${address}", retrying in ${waitTime}ms...`,
        error?.message || error
      );
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { error: "Address parameter is required" },
      { status: 400 }
    );
  }

  try {
    const result = await geocodeWithRetry(address);

    if (result) {
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Address not found" }, { status: 404 });
  } catch (error) {
    console.error("Error geocoding address:", address, error);
    return NextResponse.json(
      {
        error: "Failed to geocode address",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
