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

type CampLocation = {
  camp: Camp;
  lat: number;
  lng: number;
};

/**
 * Geocode an address using our API route (which uses Nominatim server-side)
 */
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await fetch(
      `/api/geocode?address=${encodeURIComponent(address)}`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.lat && data.lng) {
      return {
        lat: data.lat,
        lng: data.lng,
      };
    }
    return null;
  } catch (error) {
    console.error("Error geocoding address:", address, error);
    return null;
  }
}

/**
 * Map component that shows camps with addresses as markers on a Leaflet map
 */
export function CampMapWithMarkers({
  camps,
  onCampClick,
  height = "500px",
  zoom = 11,
  className = "",
}: CampMapWithMarkersProps) {
  const [isClient, setIsClient] = useState(false);
  const [campLocations, setCampLocations] = useState<CampLocation[]>([]);
  const [isGeocoding, setIsGeocoding] = useState(true);
  const [geocodingError, setGeocodingError] = useState(false);
  const [markerIcon, setMarkerIcon] = useState<any>(null);

  const campsWithAddresses = camps.filter(
    (camp) => camp.address && camp.address.trim().length > 0
  );

  useEffect(() => {
    setIsClient(true);
    // Import leaflet CSS only on client
    import("leaflet/dist/leaflet.css");
    // Create icon only on client
    setMarkerIcon(createIcon());
  }, []);

  useEffect(() => {
    if (!isClient || campsWithAddresses.length === 0) {
      setIsGeocoding(false);
      return;
    }

    async function geocodeAllCamps() {
      setIsGeocoding(true);
      setGeocodingError(false);
      const locations: CampLocation[] = [];

      // Geocode all addresses with delay to respect rate limits
      let hasError = false;
      for (const camp of campsWithAddresses) {
        if (camp.address) {
          try {
            const coords = await geocodeAddress(camp.address);
            if (coords) {
              locations.push({
                camp,
                lat: coords.lat,
                lng: coords.lng,
              });
            } else {
              hasError = true;
            }
          } catch (error) {
            console.error(`Failed to geocode ${camp.address}:`, error);
            hasError = true;
          }
          // Add a delay to respect Nominatim's rate limit (1 request per second)
          await new Promise((resolve) => setTimeout(resolve, 1100));
        }
      }

      setCampLocations(locations);
      setGeocodingError(hasError && locations.length === 0);
      setIsGeocoding(false);
    }

    geocodeAllCamps();
  }, [isClient, campsWithAddresses]);

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
  if (campLocations.length > 0) {
    const avgLat =
      campLocations.reduce((sum, loc) => sum + loc.lat, 0) /
      campLocations.length;
    const avgLng =
      campLocations.reduce((sum, loc) => sum + loc.lng, 0) /
      campLocations.length;
    mapCenter = [avgLat, avgLng];
  }

  return (
    <div className={`w-full relative ${className}`} style={{ height }}>
      {isGeocoding && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-[1000] flex items-center justify-center rounded-lg">
          <div className="bg-background border rounded-lg p-4 shadow-lg">
            <p className="text-sm text-muted-foreground">
              Geocoding addresses...
            </p>
          </div>
        </div>
      )}
      {geocodingError && campLocations.length === 0 && (
        <div className="absolute top-4 left-4 right-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 z-[1000] shadow-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Unable to geocode addresses. Showing map with clickable address links below.
          </p>
        </div>
      )}
      <MapContainer
        center={mapCenter}
        zoom={campLocations.length === 1 ? 15 : zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {campLocations.map((location) => (
          <Marker
            key={location.camp.name}
            position={[location.lat, location.lng]}
            icon={markerIcon}
          >
            <Popup>
              <div className="p-2">
                <div className="font-semibold text-sm mb-1">
                  {location.camp.name}
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {location.camp.address}
                </div>
                <button
                  onClick={() => onCampClick(location.camp)}
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
