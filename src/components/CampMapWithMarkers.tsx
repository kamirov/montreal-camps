"use client";

import { CampInfoWindowContent } from "@/components/CampInfoWindowContent";
import { Camp } from "@/types/camp";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { GoogleMap, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const markersRef = useRef<google.maps.Marker[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const onCampClickRef = useRef(onCampClick);

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

  // Update onCampClick ref when it changes
  useEffect(() => {
    onCampClickRef.current = onCampClick;
  }, [onCampClick]);

  // Update map center when camps change
  useEffect(() => {
    if (map && campsWithCoordinates.length > 0) {
      map.setCenter(mapCenter);
    }
  }, [map, mapCenter, campsWithCoordinates]);

  // Set up markers and clustering
  useEffect(() => {
    if (!map || campsWithCoordinates.length === 0) return;

    // Clear existing markers and clusterer
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
      clustererRef.current = null;
    }
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current = [];

    // Create native Google Maps markers
    const markers = campsWithCoordinates
      .filter(
        (camp) =>
          camp.latitude !== null &&
          camp.latitude !== undefined &&
          camp.longitude !== null &&
          camp.longitude !== undefined
      )
      .map((camp) => {
        const marker = new google.maps.Marker({
          position: {
            lat: camp.latitude!,
            lng: camp.longitude!,
          },
          map: map,
          title: camp.name,
        });

        // Add click event listener
        marker.addListener("click", () => {
          // Toggle InfoWindow - close if already open for this camp
          setSelectedCamp((prev) => {
            if (prev?.name === camp.name) {
              return null;
            }
            return camp;
          });
          // Clear hover when clicking
          setHoveredCamp(null);

          if (onCampClickRef.current) {
            onCampClickRef.current(camp);
          }
        });

        // Add hover event listeners
        marker.addListener("mouseover", () => {
          // Only show hover if no camp is selected or a different camp is selected
          // We'll check selectedCamp state in the render, but set hover here
          setHoveredCamp(camp);
        });

        marker.addListener("mouseout", () => {
          setHoveredCamp(null);
        });

        return marker;
      });

    markersRef.current = markers;

    // Create marker clusterer
    if (markers.length > 0) {
      clustererRef.current = new MarkerClusterer({
        markers,
        map,
      });
    }

    // Cleanup function
    return () => {
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
        clustererRef.current = null;
      }
      markers.forEach((marker) => {
        marker.setMap(null);
      });
    };
  }, [map, campsWithCoordinates]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || "",
    libraries: ["places"],
  });

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

  if (loadError) {
    return (
      <div className={`w-full h-full ${className}`}>
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">Error loading Google Maps</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`w-full h-full ${className}`}>
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <p className="text-muted-foreground">Loading map...</p>
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
    <div className={`w-full h-full relative ${className}`}>
      <div className="w-full h-full overflow-hidden">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          options={mapOptions}
          onLoad={handleMapLoad}
        >
          {/* Hover tooltip */}
          {hoveredCamp &&
            selectedCamp?.name !== hoveredCamp.name &&
            hoveredCamp.latitude !== null &&
            hoveredCamp.latitude !== undefined &&
            hoveredCamp.longitude !== null &&
            hoveredCamp.longitude !== undefined && (
              <InfoWindow
                position={{
                  lat: hoveredCamp.latitude,
                  lng: hoveredCamp.longitude,
                }}
                options={{
                  disableAutoPan: true,
                  pixelOffset: new google.maps.Size(0, -40),
                }}
              >
                <div className="px-2 py-1">
                  <p className="text-sm font-semibold">{hoveredCamp.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Click to view more information
                  </p>
                </div>
              </InfoWindow>
            )}

          {/* Selected camp info window */}
          {selectedCamp &&
            selectedCamp.latitude !== null &&
            selectedCamp.latitude !== undefined &&
            selectedCamp.longitude !== null &&
            selectedCamp.longitude !== undefined && (
              <InfoWindow
                position={{
                  lat: selectedCamp.latitude,
                  lng: selectedCamp.longitude,
                }}
                onCloseClick={() => {
                  setSelectedCamp(null);
                  setHoveredCamp(null);
                }}
              >
                <div style={{ margin: 0, padding: 0 }}>
                  <CampInfoWindowContent camp={selectedCamp} />
                </div>
              </InfoWindow>
            )}
        </GoogleMap>
      </div>
    </div>
  );
}
