"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getCamps } from "@/lib/api/camps";
import { getUniqueBoroughs } from "@/lib/filterCamps";
import { useTranslation } from "@/localization/useTranslation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegionsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [boroughs, setBoroughs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCamps() {
      try {
        setIsLoading(true);
        setError(null);
        const camps = await getCamps();
        const uniqueBoroughs = getUniqueBoroughs(camps);
        setBoroughs(uniqueBoroughs);
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
        ) : (
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-semibold mb-6">
              {t.regions.pageTitle}
            </h2>
            <div className="space-y-2">
              {boroughs.map((borough) => (
                <div key={borough} className="py-2 text-foreground">
                  {borough}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
