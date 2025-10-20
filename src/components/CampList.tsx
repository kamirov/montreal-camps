"use client";

import { useTranslation } from "@/localization/useTranslation";
import { Camp } from "@/types/camp";
import { TentTree } from "lucide-react";
import { CampCard } from "./CampCard";

type CampListProps = {
  camps: Camp[];
  onViewDetails: (camp: Camp) => void;
};

export function CampList({ camps, onViewDetails }: CampListProps) {
  const { t } = useTranslation();

  if (camps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center bg-card/30 rounded-xl border-2 border-dashed">
        <div className="bg-muted/50 p-6 rounded-full mb-6">
          <TentTree className="h-16 w-16 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold mb-2">{t.search.noResults}</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {camps.map((camp) => (
        <CampCard key={camp.id} camp={camp} onViewDetails={onViewDetails} />
      ))}
    </div>
  );
}
