"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/localization/useTranslation";
import { FilterState } from "@/types/camp";
import { X } from "lucide-react";

type ActiveFiltersProps = {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
};

export function ActiveFilters({ filters, onFilterChange }: ActiveFiltersProps) {
  const { t } = useTranslation();

  const removeBorough = (borough: string) => {
    onFilterChange({
      ...filters,
      boroughs: filters.boroughs.filter((b) => b !== borough),
    });
  };

  const removeLanguage = (language: string) => {
    onFilterChange({
      ...filters,
      selectedLanguages: filters.selectedLanguages.filter(
        (l) => l !== language
      ),
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      searchQuery: "",
      campType: filters.campType,
      boroughs: [],
      selectedLanguages: [],
    });
  };

  const hasActiveFilters =
    filters.boroughs.length > 0 || filters.selectedLanguages.length > 0;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.boroughs.map((borough) => (
        <Badge
          key={borough}
          variant="secondary"
          className="gap-1.5 px-3 py-1.5 text-sm border border-primary/20"
        >
          {borough}
          <X
            className="h-3.5 w-3.5 cursor-pointer hover:text-destructive transition-colors"
            onClick={() => removeBorough(borough)}
          />
        </Badge>
      ))}
      {filters.selectedLanguages.map((language) => (
        <Badge
          key={language}
          variant="secondary"
          className="gap-1.5 px-3 py-1.5 text-sm border border-primary/20"
        >
          {language}
          <X
            className="h-3.5 w-3.5 cursor-pointer hover:text-destructive transition-colors"
            onClick={() => removeLanguage(language)}
          />
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={clearAllFilters}
        className="hover:bg-destructive/10 hover:text-destructive"
      >
        {t.filters.clearAll}
      </Button>
    </div>
  );
}
