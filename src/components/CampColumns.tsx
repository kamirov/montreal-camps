"use client";

import { CampCard } from "@/components/CampCard";
import { useTranslation } from "@/localization/useTranslation";
import { Camp } from "@/types/camp";

type CampColumnsProps = {
  camps: Camp[];
};

export function CampColumns({ camps }: CampColumnsProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex-1">
        <div className="flex flex-col h-full">
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
