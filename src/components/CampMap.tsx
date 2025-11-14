"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

export function CampMap() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-[600px] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  // Center on Montreal
  const center: [number, number] = [45.5017, -73.5673];

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border">
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Map markers removed - coordinates no longer available */}
        {/* Map view will show camps by name/borough search instead */}
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-[1000] pointer-events-none">
          <div className="bg-background border rounded-lg p-4 shadow-lg pointer-events-auto">
            <p className="text-sm text-muted-foreground">
              Map markers require coordinates. Please use the camp details to get directions.
            </p>
          </div>
        </div>
      </MapContainer>
    </div>
  );
}
