"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/localization/useTranslation";
import { FilterState } from "@/types/camp";
import { X } from "lucide-react";

type CampFiltersProps = {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableBoroughs: string[];
  availableLanguages: string[];
};

export function CampFilters({
  filters,
  onFilterChange,
  availableBoroughs,
  availableLanguages,
}: CampFiltersProps) {
  const { t } = useTranslation();

  const handleBoroughToggle = (borough: string) => {
    const newBoroughs = filters.boroughs.includes(borough)
      ? filters.boroughs.filter((b) => b !== borough)
      : [...filters.boroughs, borough];
    onFilterChange({ ...filters, boroughs: newBoroughs });
  };

  const handleLanguageToggle = (language: string) => {
    const newLanguages = filters.selectedLanguages.includes(language)
      ? filters.selectedLanguages.filter((l) => l !== language)
      : [...filters.selectedLanguages, language];
    onFilterChange({ ...filters, selectedLanguages: newLanguages });
  };

  const handleClearAll = () => {
    onFilterChange({
      searchQuery: "",
      campType: "all",
      boroughs: [],
      selectedLanguages: [],
    });
  };

  const hasActiveFilters =
    filters.boroughs.length > 0 ||
    filters.selectedLanguages.length > 0 ||
    filters.searchQuery !== "";

  return (
    <Card className="h-fit sticky top-24 border-2">
      <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{t.filters.title}</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4 mr-1" />
              {t.filters.clearAll}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={["boroughs", "languages"]}>
          <AccordionItem value="boroughs">
            <AccordionTrigger>{t.filters.borough}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {availableBoroughs.map((borough) => (
                  <label
                    key={borough}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-accent/50 p-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.boroughs.includes(borough)}
                      onChange={() => handleBoroughToggle(borough)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-sm">{borough}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="languages">
            <AccordionTrigger>{t.filters.languages}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {availableLanguages.map((language) => (
                  <label
                    key={language}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-accent/50 p-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.selectedLanguages.includes(language)}
                      onChange={() => handleLanguageToggle(language)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-sm">{language}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
