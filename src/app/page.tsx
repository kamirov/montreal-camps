"use client";

import { CampColumns } from "@/components/CampColumns";
import { CampDetailDialog } from "@/components/CampDetailDialog";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SearchBar } from "@/components/SearchBar";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { camps as allCamps } from "@/data/camps";
import { useTranslation } from "@/localization/useTranslation";
import { Camp, ViewMode } from "@/types/camp";
import { useMemo, useState } from "react";

export default function Home() {
  const { t, language } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>("search");
  const [selectedBorough, setSelectedBorough] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCamp, setSelectedCamp] = useState<Camp | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = (camp: Camp) => {
    setSelectedCamp(camp);
    setIsDialogOpen(true);
  };

  const handleBoroughSelect = (borough: string) => {
    setSelectedBorough(borough);
    setSearchQuery("");
    setViewMode("columns");
  };

  const handleCampSelect = (camp: Camp) => {
    setSelectedBorough(camp.borough);
    setSearchQuery("");
    setViewMode("columns");
    handleViewDetails(camp);
  };

  const filteredCamps = useMemo(() => {
    if (!selectedBorough) return allCamps;
    return allCamps.filter((camp) => camp.borough === selectedBorough);
  }, [selectedBorough]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-header backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">{t.appName}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {language === "fr"
                  ? "Trouvez le camp parfait pour votre famille"
                  : "Find the perfect camp for your family"}
              </p>
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
          /* Centered Search View */
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="w-full max-w-2xl space-y-4">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold mb-2">
                  {t.search.selectLocation}
                </h2>
                <p className="text-muted-foreground">
                  {language === "fr"
                    ? "Commencez par rechercher un camp ou une région"
                    : "Start by searching for a camp or region"}
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
            <div className="container mx-auto px-4 py-6 border-b bg-background/95 backdrop-blur-sm sticky top-[88px] z-40 transition-all duration-300 ease-in-out">
              <div className="max-w-2xl">
                <SearchBar
                  camps={allCamps}
                  onSelectCamp={handleCampSelect}
                  onSelectBorough={handleBoroughSelect}
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                {selectedBorough && (
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {language === "fr" ? "Région: " : "Region: "}
                      <span className="font-semibold text-foreground">
                        {selectedBorough}
                      </span>
                    </p>
                    <button
                      onClick={() => {
                        setSelectedBorough(null);
                        setViewMode("search");
                      }}
                      className="text-sm text-primary hover:underline"
                    >
                      {language === "fr"
                        ? "Changer de région"
                        : "Change region"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Columns Content */}
            <div className="flex-1 container mx-auto px-4 py-6 overflow-hidden">
              <CampColumns
                camps={filteredCamps}
                onViewDetails={handleViewDetails}
              />
            </div>
          </div>
        )}
      </div>

      {/* Camp Detail Dialog */}
      <CampDetailDialog
        camp={selectedCamp}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
