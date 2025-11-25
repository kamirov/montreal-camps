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
 * Map component that shows camps with geocoded addresses as markers on a Google Maps embed
 */
export function CampMapWithMarkers({
  camps,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCampClick, // Kept for API compatibility, though Google Maps embed doesn't support custom click handlers
  height = "500px",
  zoom = 11,
  className = "",
}: CampMapWithMarkersProps) {
  // Filter camps to only those with addresses (coordinates will be removed soon)
  const campsWithAddresses = camps.filter(
    (camp) => camp.address && camp.address.trim().length > 0
  );

  // Calculate center based on the first address if available
  const defaultCenterQuery = "Montreal, QC";
  const mapCenterQuery =
    campsWithAddresses[0]?.address?.trim() || defaultCenterQuery;

  // Determine zoom level - use 15 for single location, provided zoom for multiple
  const mapZoom = campsWithAddresses.length === 1 ? 15 : zoom;

  // Build markers parameter for Google Maps embed API using addresses
  const markersParam = campsWithAddresses
    .map((camp) => encodeURIComponent(camp.address.trim()))
    .join("|");

  // Build Google Maps Embed URL
  // Use center as q parameter, and markers for all camp locations
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    mapCenterQuery
  )}&markers=${markersParam}&z=${mapZoom}&output=embed`;

  if (campsWithAddresses.length === 0) {
    return (
      <div className={`w-full ${className}`} style={{ height }}>
        <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center border">
          <p className="text-muted-foreground">No camps with addresses</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full relative ${className}`} style={{ height }}>
      <div
        className="w-full overflow-hidden rounded-lg border"
        style={{ height }}
      >
        <iframe
          width="100%"
          height={height}
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={mapUrl}
          title={`Map showing ${campsWithAddresses.length} camp locations`}
          className="w-full rounded-lg"
        />
      </div>
    </div>
  );
}
