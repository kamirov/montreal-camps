"use client";

import { CampInfoWindowContent } from "@/components/CampInfoWindowContent";
import { Camp } from "@/types/camp";
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";

type CampMapWithMarkersProps = {
  camps: Camp[];
  onCampClick?: (camp: Camp) => void;
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
  const [selectedCamp, setSelectedCamp] = useState<Camp | null>(null);
  const [hoveredCamp, setHoveredCamp] = useState<Camp | null>(null);

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
      <div className={`w-full h-full ${className}`}>
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">
            Google Maps API key not configured
          </p>
        </div>
      </div>
    );
  }

  if (campsWithCoordinates.length === 0) {
    return (
      <div className={`w-full h-full ${className}`}>
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">No camps with coordinates</p>
        </div>
      </div>
    );
  }

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
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
    <div className={`w-full h-full relative ${className}`}>
      <div className="w-full h-full overflow-hidden">
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

              const isSelected = selectedCamp?.name === camp.name;
              const isHovered = hoveredCamp?.name === camp.name;
              // Show hover tooltip only if not selected (to avoid conflicts)
              const showHoverTooltip = isHovered && !isSelected;

              return (
                <div key={camp.name}>
                  <Marker
                    position={{
                      lat: camp.latitude,
                      lng: camp.longitude,
                    }}
                    onMouseOver={() => {
                      if (!isSelected) {
                        setHoveredCamp(camp);
                      }
                    }}
                    onMouseOut={() => {
                      setHoveredCamp(null);
                    }}
                    onClick={() => {
                      // Toggle InfoWindow - close if already open for this camp
                      if (selectedCamp?.name === camp.name) {
                        setSelectedCamp(null);
                      } else {
                        setSelectedCamp(camp);
                        // Clear hover when clicking
                        setHoveredCamp(null);
                      }
                      if (onCampClick) {
                        onCampClick(camp);
                      }
                    }}
                    title={camp.name}
                  />
                  {showHoverTooltip && (
                    <InfoWindow
                      position={{
                        lat: camp.latitude,
                        lng: camp.longitude,
                      }}
                      options={{
                        disableAutoPan: true,
                        pixelOffset: new google.maps.Size(0, -40),
                      }}
                    >
                      <div className="px-2 py-1">
                        <p className="text-sm font-semibold">{camp.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Click to view more information
                        </p>
                      </div>
                    </InfoWindow>
                  )}
                  {isSelected && (
                    <InfoWindow
                      position={{
                        lat: camp.latitude,
                        lng: camp.longitude,
                      }}
                      onCloseClick={() => {
                        setSelectedCamp(null);
                        setHoveredCamp(null);
                      }}
                    >
                      <div style={{ margin: 0, padding: 0 }}>
                        <CampInfoWindowContent camp={camp} />
                      </div>
                    </InfoWindow>
                  )}
                </div>
              );
            })}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}
