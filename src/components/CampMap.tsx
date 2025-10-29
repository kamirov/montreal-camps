"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/localization/useTranslation";
import { Camp } from "@/types/camp";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// Fix for default marker icons in react-leaflet
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type CampMapProps = {
  camps: Camp[];
  onViewDetails: (camp: Camp) => void;
};

export function CampMap({ camps, onViewDetails }: CampMapProps) {
  const { t } = useTranslation();
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
        {camps.map((camp) => (
          <Marker key={camp.name} position={camp.coordinates} icon={icon}>
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-semibold mb-1">{camp.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {camp.borough}
                </p>
                <div className="space-y-1 text-sm mb-2">
                  <div>
                    <strong>{t.campFields.ageRange}:</strong> {camp.ageRange}
                  </div>
                  <div>
                    <strong>{t.campFields.cost}:</strong> {camp.cost}
                  </div>
                </div>
                <Badge
                  variant={camp.type === "day" ? "default" : "secondary"}
                  className="mb-2"
                >
                  {camp.type === "day" ? t.campTypes.day : t.campTypes.vacation}
                </Badge>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => onViewDetails(camp)}
                >
                  {t.actions.viewDetails}
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
