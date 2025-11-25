"use client";

import { CampMapWithMarkers } from "@/components/CampMapWithMarkers";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getCamps } from "@/lib/api/camps";
import { useTranslation } from "@/localization/useTranslation";
import { Camp } from "@/types/camp";
import { useEffect, useMemo, useState } from "react";

export default function MapPage() {
  const { t } = useTranslation();
  const [allCamps, setAllCamps] = useState<Camp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCamps() {
      try {
        setIsLoading(true);
        setError(null);
        const camps = await getCamps();
        setAllCamps(camps);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load camps");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCamps();
  }, []);

  // Filter to only camps with coordinates
  const campsWithCoordinates = useMemo(() => {
    return allCamps.filter(
      (camp) =>
        camp.latitude !== null &&
        camp.latitude !== undefined &&
        camp.longitude !== null &&
        camp.longitude !== undefined
    );
  }, [allCamps]);

  return (
    <div className="h-screen bg-background flex flex-col">
      <Header showManageButton />

      {/* Main Content Area - Map fills remaining space */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-destructive/90 text-destructive-foreground border border-destructive/20 rounded-lg px-4 py-3 shadow-lg">
              <p className="text-sm font-medium">
                {t.error?.loadCamps || "Error loading camps"}: {error}
              </p>
            </div>
          </div>
        )}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">
              {t.loading?.camps || "Loading camps..."}
            </p>
          </div>
        ) : (
          <CampMapWithMarkers
            camps={campsWithCoordinates}
            height="100%"
            zoom={11}
            className=""
          />
        )}
      </div>

      <Footer />
    </div>
  );
}
