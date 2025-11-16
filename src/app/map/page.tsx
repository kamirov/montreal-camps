"use client";

import { CampCard } from "@/components/CampCard";
import { CampDetailDialog } from "@/components/CampDetailDialog";
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
  const [selectedCamp, setSelectedCamp] = useState<Camp | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  // Filter to only camps with addresses
  const campsWithAddresses = useMemo(() => {
    return allCamps.filter((camp) => camp.address && camp.address.trim().length > 0);
  }, [allCamps]);

  const handleCampClick = (camp: Camp) => {
    setSelectedCamp(camp);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedCamp(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showManageButton />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {error && (
          <div className="container mx-auto px-4 py-8">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
              <p className="text-destructive">
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
          <div className="flex-1 container mx-auto px-4 py-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{t.views.map}</h1>
              <p className="text-muted-foreground">
                {campsWithAddresses.length} {campsWithAddresses.length === 1 ? t.results.campSingular : t.results.campPlural} with addresses
              </p>
            </div>

            {/* Map Section */}
            <div className="mb-8">
              <CampMapWithMarkers
                camps={campsWithAddresses}
                onCampClick={handleCampClick}
                height="500px"
                zoom={11}
                className="rounded-lg"
              />
            </div>

            {/* Camps Grid */}
            {campsWithAddresses.length > 0 ? (
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  {campsWithAddresses.length} {campsWithAddresses.length === 1 ? t.results.campSingular : t.results.campPlural} with addresses
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {campsWithAddresses.map((camp) => (
                    <div
                      key={camp.name}
                      onClick={() => handleCampClick(camp)}
                      className="cursor-pointer"
                    >
                      <CampCard camp={camp} showMap={false} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {t.search.noResults || "No camps with addresses found"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />

      {/* Camp Detail Dialog */}
      <CampDetailDialog
        camp={selectedCamp}
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setSelectedCamp(null);
          }
        }}
      />
    </div>
  );
}

