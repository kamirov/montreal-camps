"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { darkModeMapStyles } from "@/lib/googleMapsStyles";
import { Camp } from "@/types/camp";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";

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
  const { resolvedTheme } = useTheme();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || "",
  });

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

  // Define mapOptions before any early returns to follow Rules of Hooks
  const mapOptions: google.maps.MapOptions = useMemo(
    () => ({
      zoom: zoom,
      center: position,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      disableDefaultUI: false,
      styles: resolvedTheme === "dark" ? darkModeMapStyles : undefined,
    }),
    [zoom, position, resolvedTheme]
  );

  // Update map styles when theme changes
  useEffect(() => {
    if (!map) return;

    const styles = resolvedTheme === "dark" ? darkModeMapStyles : undefined;
    map.setOptions({ styles });
  }, [map, resolvedTheme]);

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
        <p className="text-muted-foreground text-sm">
          No coordinates available
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        className={`w-full overflow-hidden rounded-lg border bg-muted flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <p className="text-muted-foreground text-sm">
          Error loading Google Maps
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={`w-full overflow-hidden rounded-lg border bg-muted flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <p className="text-muted-foreground text-sm">Loading map...</p>
      </div>
    );
  }

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  const handleMapLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  return (
    <div
      className={`w-full overflow-hidden rounded-lg border relative ${className}`}
      style={{ height }}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        options={mapOptions}
        center={position}
        zoom={zoom}
        onLoad={handleMapLoad}
      >
        <Marker position={position} title={camp.name} />
      </GoogleMap>
    </div>
  );
}


