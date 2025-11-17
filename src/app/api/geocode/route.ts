import { NextResponse } from "next/server";

async function geocodeWithRetry(
  address: string,
  retries = 3,
  delay = 1000
): Promise<{ lat: number; lng: number } | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error("Google Maps API key not configured");
    return null;
  }

  // Add Montreal, QC, Canada to improve accuracy
  const query = encodeURIComponent(`${address}, Montreal, QC, Canada`);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${apiKey}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        // Add timeout
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(
          `Google Maps API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Check for API errors
      if (data.status === "OK" && data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return {
          lat: location.lat,
          lng: location.lng,
        };
      }

      // Handle different error statuses
      if (data.status === "ZERO_RESULTS") {
        return null; // Address not found
      }

      if (data.status === "REQUEST_DENIED") {
        console.error("Google Maps API request denied:", data.error_message);
        throw new Error(data.error_message || "API request denied");
      }

      if (data.status === "OVER_QUERY_LIMIT") {
        // Wait longer before retrying for rate limit
        const waitTime = delay * attempt * 2;
        if (attempt < retries) {
          console.warn(`Rate limit hit, waiting ${waitTime}ms before retry...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }
      }

      throw new Error(`Geocoding failed with status: ${data.status}`);
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
