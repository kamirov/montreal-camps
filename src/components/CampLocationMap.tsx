"use client";

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
 */
export function CampLocationMap({
  latitude,
  longitude,
  address,
  height = "200px",
  zoom = 15,
  className = "",
}: CampLocationMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [markerIcon, setMarkerIcon] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    import("leaflet/dist/leaflet.css");
    setMarkerIcon(createIcon());
  }, []);

  if (!isClient) {
    return (
      <div className={`w-full ${className}`} style={{ height }}>
        <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground text-xs">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden rounded-lg border ${className}`} style={{ height }}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={markerIcon} />
      </MapContainer>
    </div>
  );
}


