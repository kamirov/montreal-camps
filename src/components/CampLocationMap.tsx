"use client";

type CampLocationMapProps = {
  latitude: number;
  longitude: number;
  address?: string;
  height?: string;
  zoom?: number;
  className?: string;
};

/**
 * Small map component showing a single location with a marker using stored coordinates
 * Uses Google Maps Embed API with coordinates
 */
export function CampLocationMap({
  latitude,
  longitude,
  address,
  height = "200px",
  zoom = 15,
  className = "",
}: CampLocationMapProps) {
  // Build Google Maps Embed URL - prefer address to avoid coordinates info box
  // Fall back to coordinates if address is not available
  const mapUrl = address
    ? `https://maps.google.com/maps?q=${encodeURIComponent(
        address
      )}&z=${zoom}&output=embed`
    : `https://maps.google.com/maps?ll=${latitude},${longitude}&z=${zoom}&output=embed&markers=${latitude},${longitude}`;

  const mapTitle =
    address || `Map showing coordinates ${latitude}, ${longitude}`;

  return (
    <div
      className={`w-full overflow-hidden rounded-lg border relative ${className}`}
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
        title={mapTitle}
        className="w-full"
      />
      {/* Overlay to hide the coordinates info box in the top-left corner when using coordinates */}
      {!address && (
        <div
          className="absolute top-0 left-0 w-72 h-20 bg-background pointer-events-none"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
