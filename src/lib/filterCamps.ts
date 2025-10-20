import { Camp, FilterState, SortOption } from "@/types/camp";

export function filterCamps(camps: Camp[], filters: FilterState): Camp[] {
  return camps.filter((camp) => {
    // Filter by camp type
    if (filters.campType !== "all" && camp.type !== filters.campType) {
      return false;
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchableText = [
        camp.name,
        camp.borough,
        camp.notes,
        camp.ageRange,
        ...camp.languages,
      ]
        .join(" ")
        .toLowerCase();

      if (!searchableText.includes(query)) {
        return false;
      }
    }

    // Filter by boroughs
    if (
      filters.boroughs.length > 0 &&
      !filters.boroughs.includes(camp.borough)
    ) {
      return false;
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

    case "costLowToHigh":
      return sorted.sort((a, b) => {
        const costA = parseCost(a.cost);
        const costB = parseCost(b.cost);
        return costA - costB;
      });

    case "costHighToLow":
      return sorted.sort((a, b) => {
        const costA = parseCost(a.cost);
        const costB = parseCost(b.cost);
        return costB - costA;
      });

    case "borough":
      return sorted.sort((a, b) => a.borough.localeCompare(b.borough));

    default:
      return sorted;
  }
}

function parseCost(costString: string): number {
  // Extract the first number from the cost string (e.g., "$180/week" -> 180)
  const match = costString.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

export function getUniqueBoroughs(camps: Camp[]): string[] {
  const boroughs = camps.map((camp) => camp.borough);
  return Array.from(new Set(boroughs)).sort();
}

export function getUniqueLanguages(camps: Camp[]): string[] {
  const allLanguages = camps.flatMap((camp) => camp.languages);
  return Array.from(new Set(allLanguages)).sort();
}
