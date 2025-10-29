// Re-export types from validation schema (single source of truth)
export type { Camp, CampType, CampUpsert } from "@/lib/validations/camp";
import type { CampType } from "@/lib/validations/camp";

export type FilterState = {
  searchQuery: string;
  campType: CampType | "all";
  boroughs: string[];
  selectedLanguages: string[];
};

export type SortOption =
  | "alphabetical"
  | "costLowToHigh"
  | "costHighToLow"
  | "borough";

export type ViewMode = "search" | "columns";
