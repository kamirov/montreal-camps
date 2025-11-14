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
      const ageRangeText =
        camp.ageRange.type === "all"
          ? "all ages"
          : `${camp.ageRange.from}-${camp.ageRange.to}`;
      const searchableText = [
        camp.name,
        camp.borough || "", // Include borough only if it exists (day camps only)
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

    // Filter by boroughs (only applies to day camps with boroughs)
    // When borough filter is active, exclude vacation camps entirely
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
      return sorted.sort((a, b) => {
        // Handle null boroughs (vacation camps) - put them at the end
        if (!a.borough && !b.borough) return 0;
        if (!a.borough) return 1;
        if (!b.borough) return -1;
        return a.borough.localeCompare(b.borough);
      });

    default:
      return sorted;
  }
}

function parseCost(cost: { amount: number; period: string }): number {
  // Normalize cost to weekly rate for comparison
  const periodMultipliers: Record<string, number> = {
    hour: 40, // Assume 40 hours per week
    day: 5, // Assume 5 days per week
    week: 1,
    month: 0.25, // Assume 4 weeks per month
  };

  const multiplier = periodMultipliers[cost.period] || 1;
  return cost.amount * multiplier;
}

export function getUniqueBoroughs(camps: Camp[]): string[] {
  // Only get boroughs from day camps (vacation camps don't have boroughs)
  const boroughs = camps
    .filter((camp) => camp.borough !== null)
    .map((camp) => camp.borough as string);
  return Array.from(new Set(boroughs)).sort();
}

export function getUniqueLanguages(camps: Camp[]): string[] {
  const allLanguages = camps.flatMap((camp) => camp.languages);
  return Array.from(new Set(allLanguages)).sort();
}
