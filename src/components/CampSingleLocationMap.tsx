"use client";

import { Camp } from "@/types/camp";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useMemo } from "react";

type CampSingleLocationMapProps = {
  camp: Camp;
  height?: string;
  zoom?: number;
  className?: string;
};

/**
 * Map component that shows a single camp location with a marker using Google Maps API
 */
export function CampSingleLocationMap({
  camp,
  height = "200px",
  zoom = 15,
  className = "",
}: CampSingleLocationMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const position = useMemo(() => {
    if (
      camp.latitude != null &&
      camp.longitude != null &&
      camp.latitude !== undefined &&
      camp.longitude !== undefined
    ) {
      return {
        lat: camp.latitude,
        lng: camp.longitude,
      };
    }
    return null;
  }, [camp.latitude, camp.longitude]);

  if (!apiKey) {
    return (
      <div
        className={`w-full overflow-hidden rounded-lg border bg-muted flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <p className="text-muted-foreground text-sm">
          Google Maps API key not configured
        </p>
      </div>
    );
  }

  if (!position) {
    return (
      <div
        className={`w-full overflow-hidden rounded-lg border bg-muted flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <p className="text-muted-foreground text-sm">No coordinates available</p>
      </div>
    );
  }

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  const mapOptions: google.maps.MapOptions = {
    zoom: zoom,
    center: position,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    disableDefaultUI: false,
  };

  return (
    <div
      className={`w-full overflow-hidden rounded-lg border relative ${className}`}
      style={{ height }}
    >
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          options={mapOptions}
          center={position}
          zoom={zoom}
        >
          <Marker position={position} title={camp.name} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

