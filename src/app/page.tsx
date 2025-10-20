"use client";

import { CampColumns } from "@/components/CampColumns";
import { Footer } from "@/components/Footer";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SearchBar } from "@/components/SearchBar";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { camps as allCamps } from "@/data/camps";
import { useTranslation } from "@/localization/useTranslation";
import { Camp, ViewMode } from "@/types/camp";
import { useMemo, useState } from "react";

export default function Home() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>("search");
  const [selectedBorough, setSelectedBorough] = useState<string | null>(null);
  const [selectedCampId, setSelectedCampId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleBoroughSelect = (borough: string) => {
    setSelectedBorough(borough);
    setSelectedCampId(null);
    setSearchQuery("");
    setViewMode("columns");
  };

  const handleCampSelect = (camp: Camp) => {
    setSelectedBorough(camp.borough);
    setSelectedCampId(camp.id);
    setSearchQuery("");
    setViewMode("columns");
  };

  const handleTitleClick = () => {
    setSelectedBorough(null);
    setSelectedCampId(null);
    setSearchQuery("");
    setViewMode("search");
  };

  const filteredCamps = useMemo(() => {
    // If a specific camp is selected, show only that camp
    if (selectedCampId) {
      const camp = allCamps.find((c) => c.id === selectedCampId);
      return camp ? [camp] : [];
    }
    // Otherwise, filter by borough if one is selected
    if (selectedBorough) {
      return allCamps.filter((camp) => camp.borough === selectedBorough);
    }
    // Default: show all camps
    return allCamps;
  }, [selectedBorough, selectedCampId]);

  const selectedCamp = useMemo(
    () => allCamps.find((c) => c.id === selectedCampId),
    [selectedCampId]
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-header backdrop-blur-sm sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1
                onClick={handleTitleClick}
                className="text-3xl font-bold text-primary cursor-pointer transition-all duration-200 hover:scale-105 hover:text-primary/90 active:scale-95 select-none"
              >
                {t.appName}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {viewMode === "search" ? (
          /* Search View - 1/3 from top on desktop, under header on mobile */
          <div className="flex-1 flex items-start justify-center px-4 pt-[15vh]">
            <div className="w-full max-w-2xl space-y-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold mb-2">
                  {t.search.selectLocation}
                </h2>
              </div>
              <div className="mb-4 px-4 py-3 bg-muted/50 border border-muted-foreground/20 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  {t.sampleDataNotice}
                </p>
              </div>
              <SearchBar
                camps={allCamps}
                onSelectCamp={handleCampSelect}
                onSelectBorough={handleBoroughSelect}
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
            </div>
          </div>
        ) : (
          /* Columns View */
          <div className="flex-1 flex flex-col">
            {/* Search Bar at Top */}
            <div className="container mx-auto px-4 py-8 bg-background/98 backdrop-blur-sm sticky top-[88px] z-40 transition-all duration-300 ease-in-out">
              <div className="max-w-2xl">
                <SearchBar
                  camps={allCamps}
                  onSelectCamp={handleCampSelect}
                  onSelectBorough={handleBoroughSelect}
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                {(selectedBorough || selectedCampId) && (
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {selectedCampId && selectedCamp ? (
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
                        setSelectedCampId(null);
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
