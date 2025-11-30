import { Camp, FilterState, SortOption } from "@/types/camp";

export function filterCamps(camps: Camp[], filters: FilterState): Camp[] {
  return camps.filter((camp) => {
    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const ageRangeText =
        camp.ageRange.type === "all"
          ? "all ages"
          : `${camp.ageRange.from}-${camp.ageRange.to}`;
      const searchableText = [
        camp.name,
        camp.borough || "",
        camp.notes,
        ageRangeText,
        ...camp.languages,
      ]
        .join(" ")
        .toLowerCase();

      if (!searchableText.includes(query)) {
        return false;
      }
    }

    // Filter by boroughs
    if (filters.boroughs.length > 0) {
      if (!camp.borough || !filters.boroughs.includes(camp.borough)) {
        return false;
      }
    }

    // Filter by languages
    if (filters.selectedLanguages.length > 0) {
      const hasLanguage = filters.selectedLanguages.some((lang) =>
        camp.languages.some((campLang) =>
          campLang.toLowerCase().includes(lang.toLowerCase())
        )
      );
      if (!hasLanguage) {
        return false;
      }
    }

    return true;
  });
}

export function sortCamps(camps: Camp[], sortBy: SortOption): Camp[] {
  const sorted = [...camps];

  switch (sortBy) {
    case "alphabetical":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case "borough":
      return sorted.sort((a, b) => {
        if (!a.borough && !b.borough) return 0;
        if (!a.borough) return 1;
        if (!b.borough) return -1;
        return a.borough.localeCompare(b.borough);
      });

    default:
      return sorted;
  }
}

export function getUniqueBoroughs(camps: Camp[]): string[] {
  const boroughs = camps
    .map((camp) => camp.borough)
    .filter((borough): borough is string => borough !== null);
  return Array.from(new Set(boroughs)).sort();
}

export function getUniqueLanguages(camps: Camp[]): string[] {
  const allLanguages = camps.flatMap((camp) => camp.languages);
  return Array.from(new Set(allLanguages)).sort();
}
