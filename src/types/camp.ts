// Re-export types from validation schema (single source of truth)
export type { Camp, CampUpsert } from "@/lib/validations/camp";

export type FilterState = {
  searchQuery: string;
  boroughs: string[];
  selectedLanguages: string[];
};

export type SortOption =
  | "alphabetical"
  | "borough";

export type ViewMode = "search" | "columns";
