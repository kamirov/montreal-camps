"use client";

import { GoogleMapEmbed } from "@/components/GoogleMapEmbed";
import { Camp } from "@/types/camp";
import { MapPin } from "lucide-react";
import { useState } from "react";

type CampMapWithMarkersProps = {
  camps: Camp[];
  onCampClick: (camp: Camp) => void;
  height?: string;
  zoom?: number;
  className?: string;
};

/**
 * Map component that shows camps with addresses as clickable markers
 * Since Google Maps Embed API doesn't support multiple markers without an API key,
 * we overlay clickable HTML markers on top of the map
 */
export function CampMapWithMarkers({
  camps,
  onCampClick,
  height = "500px",
  zoom = 11,
  className = "",
}: CampMapWithMarkersProps) {
  const [hoveredCamp, setHoveredCamp] = useState<Camp | null>(null);

  // For now, we'll position markers randomly or use a simple grid
  // In a production app, you'd want to geocode addresses to get exact coordinates
  // For this implementation, we'll create clickable markers that open individual maps
  const campsWithAddresses = camps.filter(
    (camp) => camp.address && camp.address.trim().length > 0
  );

  if (campsWithAddresses.length === 0) {
    return (
      <div className={`w-full ${className}`} style={{ height }}>
        <GoogleMapEmbed
          address="Montreal, QC, Canada"
          height={height}
          zoom={zoom}
          className="rounded-lg"
        />
      </div>
    );
  }

  // If there's only one camp, center the map on that address and show a clear marker
  if (campsWithAddresses.length === 1) {
    const camp = campsWithAddresses[0];
    return (
      <div className={`w-full relative ${className}`} style={{ height }}>
        <GoogleMapEmbed
          address={camp.address!}
          height={height}
          zoom={15}
          className="rounded-lg"
        />
        {/* Overlay marker - positioned at center of map */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="relative flex flex-col items-center">
            <MapPin className="h-10 w-10 text-primary fill-primary drop-shadow-2xl animate-pulse" />
            <div className="absolute top-full mt-2 bg-background border-2 border-primary rounded-lg px-3 py-2 shadow-lg pointer-events-auto min-w-[200px]">
              <div className="font-semibold text-sm">{camp.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{camp.address}</div>
              <button
                onClick={() => onCampClick(camp)}
                className="mt-2 text-xs text-primary hover:underline"
              >
                View details →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For multiple camps, show Montreal map with clickable list overlay
  return (
    <div className={`w-full relative ${className}`} style={{ height }}>
      <GoogleMapEmbed
        address="Montreal, QC, Canada"
        height={height}
        zoom={zoom}
        className="rounded-lg"
      />
      {/* Overlay with camp markers list */}
      <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm border rounded-lg p-4 max-w-xs max-h-[80%] overflow-y-auto shadow-lg z-10">
        <h3 className="font-semibold mb-2 text-sm">
          {campsWithAddresses.length} {campsWithAddresses.length === 1 ? "Camp" : "Camps"}
        </h3>
        <div className="space-y-2">
          {campsWithAddresses.map((camp) => (
            <button
              key={camp.name}
              onClick={() => onCampClick(camp)}
              onMouseEnter={() => setHoveredCamp(camp)}
              onMouseLeave={() => setHoveredCamp(null)}
              className="w-full text-left p-2 rounded hover:bg-accent transition-colors text-sm"
            >
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{camp.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {camp.address}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

