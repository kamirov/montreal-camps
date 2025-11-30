"use client";

import { CampCard } from "@/components/CampCard";
import { useTranslation } from "@/localization/useTranslation";
import { Camp } from "@/types/camp";

type CampColumnsProps = {
  camps: Camp[];
  showSampleNotice?: boolean;
};

export function CampColumns({
  camps,
  showSampleNotice = false,
}: CampColumnsProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 h-full flex flex-col">
      {showSampleNotice && (
        <div className="px-4 py-3 bg-muted/50 border border-muted-foreground/20 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">{t.sampleDataNotice}</p>
        </div>
      )}
      <div className="flex-1">
        <div className="flex flex-col h-full">
          <div className="mb-6 pb-2 sticky top-0 bg-background z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary">
                {t.campTypes.day}
              </h2>
              <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {camps.length}{" "}
                {camps.length === 1
                  ? t.results.campSingular
                  : t.results.campPlural}
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {camps.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                {t.search.noResults}
              </div>
            ) : (
              camps.map((camp) => <CampCard key={camp.name} camp={camp} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
