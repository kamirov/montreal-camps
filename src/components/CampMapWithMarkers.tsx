"use client";

import { CampInfoWindowContent } from "@/components/CampInfoWindowContent";
import { CampSelectionDialog } from "@/components/CampSelectionDialog";
import { useTheme } from "@/contexts/ThemeContext";
import { darkModeMapStyles } from "@/lib/googleMapsStyles";
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
  const { resolvedTheme } = useTheme();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedCamp, setSelectedCamp] = useState<Camp | null>(null);
  const [hoveredCamp, setHoveredCamp] = useState<Camp | null>(null);
  const [hoveredLocationKey, setHoveredLocationKey] = useState<string | null>(
    null
  );
  const [selectionDialogOpen, setSelectionDialogOpen] = useState(false);
  const [campsAtLocation, setCampsAtLocation] = useState<Camp[]>([]);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markerCoordMapRef = useRef<Map<google.maps.Marker, string>>(new Map());
  const onCampClickRef = useRef(onCampClick);
  const zoomLockRef = useRef<number | null>(null);
  const centerLockRef = useRef<google.maps.LatLng | null>(null);
  const isHoveringRef = useRef(false);
  const hoveredCampNameRef = useRef<string | null>(null);

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

  // Group camps by coordinates (using string key for exact matches)
  const campsByCoordinates = useMemo(() => {
    const grouped = new Map<string, Camp[]>();
    campsWithCoordinates.forEach((camp) => {
      const key = `${camp.latitude},${camp.longitude}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(camp);
    });
    return grouped;
  }, [campsWithCoordinates]);

  // Get unique coordinates for marker creation
  const uniqueCoordinates = useMemo(() => {
    return Array.from(campsByCoordinates.keys()).map((key) => {
      const [lat, lng] = key.split(",").map(Number);
      return { key, lat, lng };
    });
  }, [campsByCoordinates]);

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

  // Update map center when camps change (but not during hover)
  useEffect(() => {
    if (map && campsWithCoordinates.length > 0 && !isHoveringRef.current) {
      map.setCenter(mapCenter);
    }
  }, [map, mapCenter, campsWithCoordinates]);

  // Update map styles when theme changes
  useEffect(() => {
    if (!map) return;

    const styles = resolvedTheme === "dark" ? darkModeMapStyles : undefined;
    map.setOptions({ styles });
  }, [map, resolvedTheme]);

  // Prevent zoom and center changes during hover
  useEffect(() => {
    if (!map) return;

    const handleZoomChanged = () => {
      if (isHoveringRef.current && zoomLockRef.current !== null) {
        const currentZoom = map.getZoom();
        if (currentZoom !== zoomLockRef.current) {
          map.setZoom(zoomLockRef.current);
        }
      }
    };

    const handleCenterChanged = () => {
      if (isHoveringRef.current && centerLockRef.current !== null) {
        const currentCenter = map.getCenter();
        if (currentCenter && centerLockRef.current) {
          const latDiff = Math.abs(
            currentCenter.lat() - centerLockRef.current.lat()
          );
          const lngDiff = Math.abs(
            currentCenter.lng() - centerLockRef.current.lng()
          );
          // Only reset if the change is significant (more than a tiny floating point difference)
          if (latDiff > 0.0001 || lngDiff > 0.0001) {
            map.setCenter(centerLockRef.current);
          }
        }
      }
    };

    const zoomListener = map.addListener("zoom_changed", handleZoomChanged);
    const centerListener = map.addListener(
      "center_changed",
      handleCenterChanged
    );

    return () => {
      google.maps.event.removeListener(zoomListener);
      google.maps.event.removeListener(centerListener);
    };
  }, [map]);

  // Set up markers and clustering
  useEffect(() => {
    if (!map || uniqueCoordinates.length === 0) return;

    // Clear existing markers and clusterer
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
      clustererRef.current = null;
    }
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current = [];
    markerCoordMapRef.current.clear();

    // Create native Google Maps markers - one per unique coordinate
    const markers = uniqueCoordinates.map((coord) => {
      const campsAtCoord = campsByCoordinates.get(coord.key) || [];
      const firstCamp = campsAtCoord[0];

      // Use the first camp's name for the marker title, or show count if multiple
      const title =
        campsAtCoord.length > 1
          ? `${campsAtCoord.length} camps at this location`
          : firstCamp.name;

      const marker = new google.maps.Marker({
        position: {
          lat: coord.lat,
          lng: coord.lng,
        },
        map: map,
        title: title,
      });

      // Store the coordinate key with the marker
      markerCoordMapRef.current.set(marker, coord.key);

      // Add click event listener
      marker.addListener("click", () => {
        const campsAtThisLocation = campsByCoordinates.get(coord.key) || [];

        // If multiple camps at this location, show selection dialog
        if (campsAtThisLocation.length > 1) {
          setCampsAtLocation(campsAtThisLocation);
          setSelectionDialogOpen(true);
          setHoveredCamp(null);
        } else {
          // Single camp - show InfoWindow directly
          const camp = campsAtThisLocation[0];
          setSelectedCamp((prev) => {
            if (prev?.name === camp.name) {
              return null;
            }
            return camp;
          });
          setHoveredCamp(null);

          if (onCampClickRef.current) {
            onCampClickRef.current(camp);
          }
        }
      });

      // Add hover event listeners - show all camps on hover
      marker.addListener("mouseover", () => {
        const campsAtThisLocation = campsByCoordinates.get(coord.key) || [];
        if (campsAtThisLocation.length > 0) {
          // Lock zoom level and center to prevent InfoWindow from causing changes
          if (map && zoomLockRef.current === null) {
            const currentZoom = map.getZoom();
            zoomLockRef.current = currentZoom ?? mapZoom;
            const currentCenter = map.getCenter();
            if (currentCenter) {
              centerLockRef.current = new google.maps.LatLng(
                currentCenter.lat(),
                currentCenter.lng()
              );
            }
            isHoveringRef.current = true;
          }
          // Store the first camp for backward compatibility and the location key
          setHoveredCamp(campsAtThisLocation[0]);
          setHoveredLocationKey(coord.key);
          hoveredCampNameRef.current = campsAtThisLocation[0].name;
        }
      });

      marker.addListener("mouseout", () => {
        setHoveredCamp(null);
        setHoveredLocationKey(null);
        hoveredCampNameRef.current = null;
        // Unlock zoom and center after a short delay to allow InfoWindow to close
        setTimeout(() => {
          if (hoveredCampNameRef.current === null) {
            isHoveringRef.current = false;
            zoomLockRef.current = null;
            centerLockRef.current = null;
          }
        }, 100);
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
    const coordMap = markerCoordMapRef.current;
    return () => {
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
        clustererRef.current = null;
      }
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      coordMap.clear();
    };
  }, [map, uniqueCoordinates, campsByCoordinates, mapZoom]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || "",
    libraries: ["places"],
  });

  // Define mapOptions before any early returns to follow Rules of Hooks
  const mapOptions: google.maps.MapOptions = useMemo(
    () => ({
      zoom: mapZoom,
      center: mapCenter,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
      styles: resolvedTheme === "dark" ? darkModeMapStyles : undefined,
    }),
    [mapZoom, mapCenter, resolvedTheme]
  );

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

  const handleMapLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  const handleSelectCampFromDialog = (camp: Camp) => {
    setSelectedCamp(camp);
    setHoveredCamp(null);
    if (onCampClickRef.current) {
      onCampClickRef.current(camp);
    }
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
            hoveredLocationKey &&
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
                <div className="px-2 py-2">
                  {(() => {
                    const campsAtHoveredLocation =
                      campsByCoordinates.get(hoveredLocationKey) || [];
                    if (campsAtHoveredLocation.length === 1) {
                      return (
                        <>
                          <p className="text-sm font-semibold">
                            {campsAtHoveredLocation[0].name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Click to view more information
                          </p>
                        </>
                      );
                    }
                    return (
                      <>
                        <p className="text-sm font-semibold mb-2">
                          {campsAtHoveredLocation.length} camps at this location
                        </p>
                        <ul className="space-y-1 max-h-[200px] overflow-y-auto">
                          {campsAtHoveredLocation.map((camp) => (
                            <li key={camp.name} className="text-xs">
                              <span className="font-medium">{camp.name}</span>
                              {camp.borough && (
                                <span className="text-muted-foreground ml-1">
                                  • {camp.borough}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                        <p className="text-xs text-muted-foreground mt-2">
                          Click to select a camp
                        </p>
                      </>
                    );
                  })()}
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
                  {(() => {
                    const selectedCampKey = `${selectedCamp.latitude},${selectedCamp.longitude}`;
                    const campsAtSelectedLocation =
                      campsByCoordinates.get(selectedCampKey) || [];
                    const hasMultipleCamps = campsAtSelectedLocation.length > 1;

                    return (
                      <CampInfoWindowContent
                        camp={selectedCamp}
                        showViewOtherCampsButton={hasMultipleCamps}
                        onViewOtherCamps={() => {
                          setSelectedCamp(null);
                          setHoveredCamp(null);
                          setCampsAtLocation(campsAtSelectedLocation);
                          setSelectionDialogOpen(true);
                        }}
                      />
                    );
                  })()}
                </div>
              </InfoWindow>
            )}
        </GoogleMap>
      </div>

      {/* Camp selection dialog for duplicate coordinates */}
      <CampSelectionDialog
        open={selectionDialogOpen}
        onOpenChange={setSelectionDialogOpen}
        camps={campsAtLocation}
        onSelectCamp={handleSelectCampFromDialog}
      />
    </div>
  );
}
