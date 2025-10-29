"use client";

import { CampColumns } from "@/components/CampColumns";
import { Footer } from "@/components/Footer";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SearchBar } from "@/components/SearchBar";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { getCamps } from "@/lib/api/camps";
import { useTranslation } from "@/localization/useTranslation";
import { Camp } from "@/types/camp";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type RegionPageProps = {
  params: Promise<{ regionName: string }>;
};

export default function RegionPage({ params }: RegionPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [regionName, setRegionName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [allCamps, setAllCamps] = useState<Camp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      const decodedName = decodeURIComponent(resolvedParams.regionName);
      setRegionName(decodedName);
      setSearchQuery(decodedName);
    }
    resolveParams();
  }, [params]);

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

  const handleTitleClick = () => {
    router.push("/");
  };

  const handleCampSelect = (camp: Camp) => {
    router.push(`/camps/${encodeURIComponent(camp.name)}`);
  };

  const handleBoroughSelect = (borough: string) => {
    router.push(`/region/${encodeURIComponent(borough)}`);
  };

  const filteredCamps = useMemo(() => {
    if (!regionName) return [];
    return allCamps.filter((camp) => camp.borough === regionName);
  }, [regionName, allCamps]);

  const hasResults = filteredCamps.length > 0;

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
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/manage")}
              >
                {t.manage.button}
              </Button>
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

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
                {hasResults ? (
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {t.search.regionLabel}
                      <span className="font-semibold text-foreground">
                        {regionName}
                      </span>
                    </p>
                    <button
                      onClick={() => {
                        router.push("/");
                      }}
                      className="text-sm text-primary hover:underline cursor-pointer"
                    >
                      {t.search.newSearch}
                    </button>
                  </div>
                ) : (
                  <div className="mt-3">
                    <p className="text-sm text-destructive">
                      {t.regions.notFound}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Columns Content */}
            <div className="flex-1 container mx-auto px-4 py-6 overflow-hidden">
              {hasResults ? (
                <CampColumns camps={filteredCamps} showSampleNotice />
              ) : (
                <div className="flex items-center justify-center h-40">
                  <p className="text-muted-foreground">{t.regions.notFound}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
