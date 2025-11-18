"use client";

import { Camp } from "@/types/camp";

type CampMapWithMarkersProps = {
  camps: Camp[];
  onCampClick: (camp: Camp) => void;
  height?: string;
  zoom?: number;
  className?: string;
};

/**
 * Map component that shows camps with addresses and coordinates as markers on a Google Maps embed
 */
export function CampMapWithMarkers({
  camps,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCampClick, // Kept for API compatibility, though Google Maps embed doesn't support custom click handlers
  height = "500px",
  zoom = 11,
  className = "",
}: CampMapWithMarkersProps) {
  // Filter camps to only those with both address and coordinates
  const campsWithCoordinates = camps.filter(
    (camp) =>
      camp.address &&
      camp.address.trim().length > 0 &&
      camp.latitude != null &&
      camp.longitude != null
  );

  // Center on Montreal (default)
  const center: [number, number] = [45.5017, -73.5673];

  // Calculate center based on markers if we have locations
  let mapCenter: [number, number] = center;
  if (campsWithCoordinates.length > 0) {
    const avgLat =
      campsWithCoordinates.reduce(
        (sum, camp) => sum + (camp.latitude || 0),
        0
      ) / campsWithCoordinates.length;
    const avgLng =
      campsWithCoordinates.reduce(
        (sum, camp) => sum + (camp.longitude || 0),
        0
      ) / campsWithCoordinates.length;
    mapCenter = [avgLat, avgLng];
  }

  // Determine zoom level - use 15 for single location, provided zoom for multiple
  const mapZoom = campsWithCoordinates.length === 1 ? 15 : zoom;

  // Build markers parameter for Google Maps embed API
  // Format: markers=lat1,lng1|label1|lat2,lng2|label2
  // For better visual, we'll use coordinates without labels (simpler)
  const markersParam = campsWithCoordinates
    .map((camp) => `${camp.latitude},${camp.longitude}`)
    .join("|");

  // Build Google Maps Embed URL
  // Use center as q parameter, and markers for all camp locations
  const mapUrl = `https://maps.google.com/maps?q=${mapCenter[0]},${mapCenter[1]}&markers=${markersParam}&z=${mapZoom}&output=embed`;

  if (campsWithCoordinates.length === 0) {
    return (
      <div className={`w-full ${className}`} style={{ height }}>
        <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center border">
          <p className="text-muted-foreground">
            No camps with coordinates available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full relative ${className}`} style={{ height }}>
      <div className="w-full overflow-hidden rounded-lg border" style={{ height }}>
        <iframe
          width="100%"
          height={height}
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={mapUrl}
          title={`Map showing ${campsWithCoordinates.length} camp locations`}
          className="w-full rounded-lg"
        />
      </div>
    </div>
  );
}
