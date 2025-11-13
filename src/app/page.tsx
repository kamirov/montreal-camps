"use client";

import { CampColumns } from "@/components/CampColumns";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getCamps } from "@/lib/api/camps";
import { exportCampsToExcel } from "@/lib/exportCamps";
import { useTranslation } from "@/localization/useTranslation";
import { Camp, ViewMode } from "@/types/camp";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const { t, language } = useTranslation();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("search");
  const [selectedBorough, setSelectedBorough] = useState<string | null>(null);
  const [selectedCampName, setSelectedCampName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleBoroughSelect = (borough: string) => {
    router.push(`/region/${encodeURIComponent(borough)}`);
  };

  const handleCampSelect = (camp: Camp) => {
    router.push(`/camps/${encodeURIComponent(camp.name)}`);
  };

  const handleTitleClick = () => {
    setSelectedBorough(null);
    setSelectedCampName(null);
    setSearchQuery("");
    setViewMode("search");
  };

  const handleExport = () => {
    exportCampsToExcel(allCamps, { translations: t, language });
  };

  const filteredCamps = useMemo(() => {
    // If a specific camp is selected, show only that camp
    if (selectedCampName) {
      const camp = allCamps.find((c) => c.name === selectedCampName);
      return camp ? [camp] : [];
    }
    // Otherwise, filter by borough if one is selected
    if (selectedBorough) {
      return allCamps.filter((camp) => camp.borough === selectedBorough);
    }
    // Default: show all camps
    return allCamps;
  }, [selectedBorough, selectedCampName, allCamps]);

  const selectedCamp = useMemo(
    () => allCamps.find((c) => c.name === selectedCampName),
    [selectedCampName, allCamps]
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showManageButton onTitleClick={handleTitleClick} />

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
        ) : viewMode === "search" ? (
          /* Search View - 1/3 from top on desktop, under header on mobile */
          <div className="flex-1 flex items-start justify-center px-4 pt-[15vh]">
            <div className="w-full max-w-2xl space-y-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold mb-2">
                  {t.search.selectLocation}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <SearchBar
                    camps={allCamps}
                    onSelectCamp={handleCampSelect}
                    onSelectBorough={handleBoroughSelect}
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleExport}
                        className="flex items-center justify-center h-12 w-12 rounded-lg border-2 bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                        aria-label={t.export.tooltip}
                      >
                        <Download className="h-5 w-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t.export.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        ) : (
          /* Columns View */
          <div className="flex-1 flex flex-col">
            {/* Search Bar at Top */}
            <div className="container mx-auto px-4 py-8 bg-background/98 backdrop-blur-sm sticky top-[88px] z-40 transition-all duration-300 ease-in-out">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <SearchBar
                      camps={allCamps}
                      onSelectCamp={handleCampSelect}
                      onSelectBorough={handleBoroughSelect}
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handleExport}
                          className="flex items-center justify-center h-12 w-12 rounded-lg border-2 bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                          aria-label={t.export.tooltip}
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t.export.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {(selectedBorough || selectedCampName) && (
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {selectedCampName && selectedCamp ? (
                        <>
                          <span className="font-semibold text-foreground">
                            {selectedCamp.name}
                          </span>
                          {" • "}
                          {selectedBorough}
                        </>
                      ) : (
                        <>
                          {t.search.regionLabel}
                          <span className="font-semibold text-foreground">
                            {selectedBorough}
                          </span>
                        </>
                      )}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedBorough(null);
                        setSelectedCampName(null);
                        setViewMode("search");
                      }}
                      className="text-sm text-primary hover:underline cursor-pointer"
                    >
                      {t.search.newSearch}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Columns Content */}
            <div className="flex-1 container mx-auto px-4 py-6 overflow-hidden">
              <CampColumns camps={filteredCamps} showSampleNotice />
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
