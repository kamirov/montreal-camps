export type CampType = "day" | "vacation";

export type Camp = {
  id: string;
  type: CampType;
  name: string;
  borough: string;
  ageRange: string;
  languages: string[];
  dates: string;
  hours?: string; // Only for day camps
  cost: string;
  financialAid: string;
  link: string;
  phone: string;
  notes: string;
  coordinates: [number, number]; // [latitude, longitude] for map
};

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

export type ViewMode = "list" | "map" | "search";
