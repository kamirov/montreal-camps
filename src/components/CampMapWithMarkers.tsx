"use client";

import { Camp } from "@/types/camp";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

// Function to create icon (must be called client-side)
function createIcon() {
  if (typeof window === "undefined") return null;
  const L = require("leaflet");
  return L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}

type CampMapWithMarkersProps = {
  camps: Camp[];
  onCampClick: (camp: Camp) => void;
  height?: string;
  zoom?: number;
  className?: string;
};

/**
 * Map component that shows camps with addresses and coordinates as markers on a Leaflet map
 */
export function CampMapWithMarkers({
  camps,
  onCampClick,
  height = "500px",
  zoom = 11,
  className = "",
}: CampMapWithMarkersProps) {
  const [isClient, setIsClient] = useState(false);
  const [markerIcon, setMarkerIcon] = useState<any>(null);

  // Filter camps to only those with both address and coordinates
  const campsWithCoordinates = camps.filter(
    (camp) =>
      camp.address &&
      camp.address.trim().length > 0 &&
      camp.latitude != null &&
      camp.longitude != null
  );

  useEffect(() => {
    setIsClient(true);
    // Import leaflet CSS only on client
    import("leaflet/dist/leaflet.css");
    // Create icon only on client
    setMarkerIcon(createIcon());
  }, []);

  if (!isClient) {
    return (
      <div className={`w-full ${className}`} style={{ height }}>
        <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  // Center on Montreal
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

  return (
    <div className={`w-full relative ${className}`} style={{ height }}>
      <MapContainer
        center={mapCenter}
        zoom={campsWithCoordinates.length === 1 ? 15 : zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {campsWithCoordinates.map((camp) => (
          <Marker
            key={camp.name}
            position={[camp.latitude!, camp.longitude!]}
            icon={markerIcon}
          >
            <Popup>
              <div className="p-2">
                <div className="font-semibold text-sm mb-1">{camp.name}</div>
                <div className="text-xs text-muted-foreground mb-2">
                  {camp.address}
                </div>
                <button
                  onClick={() => onCampClick(camp)}
                  className="text-xs text-primary hover:underline"
                >
                  View details →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
