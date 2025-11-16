"use client";

type GoogleMapEmbedProps = {
  address: string;
  width?: string;
  height?: string;
  zoom?: number;
  className?: string;
};

/**
 * Google Maps Embed component using iframe
 * Generates a Google Maps embed URL for the given address
 */
export function GoogleMapEmbed({
  address,
  width = "100%",
  height = "400px",
  zoom = 15,
  className = "",
}: GoogleMapEmbedProps) {
  // Encode the address for the URL
  const encodedAddress = encodeURIComponent(address);
  
  // Build the Google Maps Embed URL (no API key required)
  // Using the standard Google Maps embed format with output=embed
  const mapUrl = `https://maps.google.com/maps?q=${encodedAddress}&z=${zoom}&output=embed`;

  return (
    <div className={`w-full overflow-hidden rounded-lg border ${className}`}>
      <iframe
        width={width}
        height={height}
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapUrl}
        title={`Map showing ${address}`}
        className="w-full"
      />
    </div>
  );
}

