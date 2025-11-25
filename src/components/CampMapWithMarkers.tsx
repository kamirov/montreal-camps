"use client";

import { Camp } from "@/types/camp";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";

type CampMapWithMarkersProps = {
  camps: Camp[];
  onCampClick: (camp: Camp) => void;
  height?: string;
  zoom?: number;
  className?: string;
};

/**
 * Map component that shows camps with coordinates as markers on a Google Maps
 */
export function CampMapWithMarkers({
  camps,
  onCampClick,
  height = "500px",
  zoom = 11,
  className = "",
}: CampMapWithMarkersProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Filter camps to only those with coordinates
  const campsWithCoordinates = useMemo(
    () =>
      camps.filter(
        (camp) =>
          camp.latitude !== null &&
          camp.latitude !== undefined &&
          camp.longitude !== null &&
          camp.longitude !== undefined
      ),
    [camps]
  );

  // Calculate map center from first camp with coordinates
  const mapCenter = useMemo(() => {
    if (campsWithCoordinates.length > 0) {
      const firstCamp = campsWithCoordinates[0];
      return {
        lat: firstCamp.latitude!,
        lng: firstCamp.longitude!,
      };
    }
    return { lat: 45.5017, lng: -73.5673 }; // Default Montreal center
  }, [campsWithCoordinates]);

  // Determine zoom level - use 15 for single location, provided zoom for multiple
  const mapZoom = campsWithCoordinates.length === 1 ? 15 : zoom;

  // Update map center when camps change
  useEffect(() => {
    if (map && campsWithCoordinates.length > 0) {
      map.setCenter(mapCenter);
    }
  }, [map, mapCenter, campsWithCoordinates]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className={`w-full ${className}`} style={{ height }}>
        <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center border">
          <p className="text-muted-foreground">
            Google Maps API key not configured
          </p>
        </div>
      </div>
    );
  }

  if (campsWithCoordinates.length === 0) {
    return (
      <div className={`w-full ${className}`} style={{ height }}>
        <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center border">
          <p className="text-muted-foreground">No camps with coordinates</p>
        </div>
      </div>
    );
  }

  const mapContainerStyle = {
    width: "100%",
    height: height,
  };

  const mapOptions: google.maps.MapOptions = {
    zoom: mapZoom,
    center: mapCenter,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
  };

  const handleMapLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  return (
    <div className={`w-full relative ${className}`} style={{ height }}>
      <div
        className="w-full overflow-hidden rounded-lg border"
        style={{ height }}
      >
        <LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            options={mapOptions}
            onLoad={handleMapLoad}
          >
            {campsWithCoordinates.map((camp) => {
              if (
                camp.latitude === null ||
                camp.latitude === undefined ||
                camp.longitude === null ||
                camp.longitude === undefined
              ) {
                return null;
              }

              return (
                <Marker
                  key={camp.name}
                  position={{
                    lat: camp.latitude,
                    lng: camp.longitude,
                  }}
                  onClick={() => onCampClick(camp)}
                  title={camp.name}
                />
              );
            })}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}
