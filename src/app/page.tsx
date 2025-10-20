"use client";

import { ActiveFilters } from "@/components/ActiveFilters";
import { CampDetailDialog } from "@/components/CampDetailDialog";
import { CampFilters } from "@/components/CampFilters";
import { CampList } from "@/components/CampList";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SearchBar } from "@/components/SearchBar";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { camps as allCamps } from "@/data/camps";
import {
  filterCamps,
  getUniqueBoroughs,
  getUniqueLanguages,
  sortCamps,
} from "@/lib/filterCamps";
import { useTranslation } from "@/localization/useTranslation";
import { Camp, FilterState, SortOption, ViewMode } from "@/types/camp";
import { List, Map, Menu, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

// Dynamically import CampMap to avoid SSR issues with Leaflet
const CampMap = dynamic(
  () => import("@/components/CampMap").then((mod) => mod.CampMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    ),
  }
);

export default function Home() {
  const { t, language } = useTranslation();
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    campType: "all",
    boroughs: [],
    hasFinancialAid: null,
    selectedLanguages: [],
  });
  const [sortBy, setSortBy] = useState<SortOption>("alphabetical");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedCamp, setSelectedCamp] = useState<Camp | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handleViewDetails = (camp: Camp) => {
    setSelectedCamp(camp);
    setIsDialogOpen(true);
  };

  const filteredCamps = useMemo(() => {
    const filtered = filterCamps(allCamps, filters);
    return sortCamps(filtered, sortBy);
  }, [filters, sortBy]);

  const availableBoroughs = useMemo(() => getUniqueBoroughs(allCamps), []);
  const availableLanguages = useMemo(() => getUniqueLanguages(allCamps), []);

  const handleSearchSelect = (camp: Camp) => {
    setFilters({ ...filters, searchQuery: "" });
    handleViewDetails(camp);
  };

  return (
    <div className="min-h-screen bg-background">
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

      <div className="container mx-auto px-4 py-8">
        {/* Camp Type Tabs */}
        <div className="mb-8">
          <Tabs
            value={filters.campType}
            onValueChange={(value) =>
              setFilters({
                ...filters,
                campType: value as FilterState["campType"],
              })
            }
          >
            <TabsList className="grid w-full max-w-md grid-cols-3 h-12">
              <TabsTrigger value="all" className="text-base">
                {language === "fr" ? "Tous" : "All Camps"}
              </TabsTrigger>
              <TabsTrigger value="day" className="text-base">
                {t.campTypes.day}
              </TabsTrigger>
              <TabsTrigger value="vacation" className="text-base">
                {t.campTypes.vacation}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            camps={allCamps}
            onSelectCamp={handleSearchSelect}
            value={filters.searchQuery}
            onValueChange={(value) =>
              setFilters({ ...filters, searchQuery: value })
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block">
            <CampFilters
              filters={filters}
              onFilterChange={setFilters}
              availableBoroughs={availableBoroughs}
              availableLanguages={availableLanguages}
            />
          </aside>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden fixed bottom-6 right-6 z-40">
            <Button
              size="lg"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="rounded-full shadow-2xl h-14 w-14 p-0 border-2 border-quebec-blue/30 hover:border-quebec-blue hover:scale-110 transition-all bg-quebec-blue hover:bg-quebec-blue/90"
            >
              {isMobileFilterOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Mobile Filters Overlay */}
          {isMobileFilterOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-30"
              onClick={() => setIsMobileFilterOpen(false)}
            >
              <div
                className="absolute right-0 top-0 h-full w-80 bg-background p-4 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <CampFilters
                  filters={filters}
                  onFilterChange={(newFilters) => {
                    setFilters(newFilters);
                    setIsMobileFilterOpen(false);
                  }}
                  availableBoroughs={availableBoroughs}
                  availableLanguages={availableLanguages}
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Active Filters & Controls */}
            <div className="mb-6 space-y-4 bg-card/50 backdrop-blur-sm rounded-lg p-4 border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="default"
                    onClick={() => setViewMode("list")}
                    className="gap-2 border-quebec-blue hover:border-quebec-blue/80"
                  >
                    <List className="h-4 w-4" />
                    {t.views.list}
                  </Button>
                  <Button
                    variant={viewMode === "map" ? "default" : "outline"}
                    size="default"
                    onClick={() => setViewMode("map")}
                    className="gap-2 border-quebec-blue hover:border-quebec-blue/80"
                  >
                    <Map className="h-4 w-4" />
                    {t.views.map}
                  </Button>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {t.sorting.label}:
                  </span>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as SortOption)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alphabetical">
                        {t.sorting.alphabetical}
                      </SelectItem>
                      <SelectItem value="costLowToHigh">
                        {t.sorting.costLowToHigh}
                      </SelectItem>
                      <SelectItem value="costHighToLow">
                        {t.sorting.costHighToLow}
                      </SelectItem>
                      <SelectItem value="borough">
                        {t.sorting.borough}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between pt-2 border-t">
                <p className="text-sm font-medium">
                  {t.results.showing}{" "}
                  <span className="text-primary font-bold">
                    {filteredCamps.length}
                  </span>{" "}
                  {t.results.camps} {t.results.of}{" "}
                  <span className="font-bold">{allCamps.length}</span>
                </p>
              </div>

              {/* Active Filters */}
              <ActiveFilters filters={filters} onFilterChange={setFilters} />
            </div>

            {/* Content Views */}
            {viewMode === "list" && (
              <CampList
                camps={filteredCamps}
                onViewDetails={handleViewDetails}
              />
            )}
            {viewMode === "map" && (
              <CampMap
                camps={filteredCamps}
                onViewDetails={handleViewDetails}
              />
            )}
          </main>
        </div>
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
