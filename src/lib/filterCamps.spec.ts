import { Camp, FilterState } from "@/types/camp";
import { describe, expect, it } from "vitest";
import {
  filterCamps,
  getUniqueBoroughs,
  getUniqueLanguages,
  sortCamps,
} from "./filterCamps";

const mockCamps: Camp[] = [
  {
    name: "Camp Alpha",
    borough: "Plateau",
    ageRange: { type: "range", allAges: false, from: 5, to: 10 },
    languages: ["English", "French"],
    dates: {
      type: "range",
      yearRound: false,
      fromDate: "2024-07-01",
      toDate: "2024-07-30",
    },
    financialAid: "Available",
    link: "http://example.com",
    phone: { number: "514-555-0101", extension: "" },
    notes: "Great camp with swimming",
  },
  {
    name: "Camp Beta",
    borough: null,
    ageRange: { type: "range", allAges: false, from: 8, to: 14 },
    languages: ["French"],
    dates: {
      type: "range",
      yearRound: false,
      fromDate: "2024-03-01",
      toDate: "2024-03-05",
    },
    financialAid: "Contact for information",
    link: "http://example.com",
    phone: { number: "514-555-0102", extension: "" },
    notes: "Indoor activities",
  },
  {
    name: "Camp Gamma",
    borough: "Plateau",
    ageRange: { type: "range", allAges: false, from: 6, to: 12 },
    languages: ["English"],
    dates: {
      type: "range",
      yearRound: false,
      fromDate: "2024-07-15",
      toDate: "2024-08-15",
    },
    financialAid: "Available - Sliding scale",
    link: "http://example.com",
    phone: { number: "514-555-0103", extension: "" },
    notes: "Arts and crafts",
  },
];

describe("filterCamps", () => {
  it("should return all camps when no filters are applied", () => {
    const filters: FilterState = {
      searchQuery: "",
      boroughs: [],
      selectedLanguages: [],
    };
    const result = filterCamps(mockCamps, filters);
    expect(result).toHaveLength(3);
  });

  it("should filter by search query", () => {
    const filters: FilterState = {
      searchQuery: "swimming",
      boroughs: [],
      selectedLanguages: [],
    };
    const result = filterCamps(mockCamps, filters);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Camp Alpha");
  });

  it("should filter by borough", () => {
    const filters: FilterState = {
      searchQuery: "",
      boroughs: ["Plateau"],
      selectedLanguages: [],
    };
    const result = filterCamps(mockCamps, filters);
    // Should only return camps with "Plateau" borough
    expect(result).toHaveLength(2);
    expect(result.every((camp) => camp.borough === "Plateau")).toBe(true);
  });

  it("should filter by language", () => {
    const filters: FilterState = {
      searchQuery: "",
      boroughs: [],
      selectedLanguages: ["English"],
    };
    const result = filterCamps(mockCamps, filters);
    expect(result).toHaveLength(2);
  });
});

describe("sortCamps", () => {
  it("should sort camps alphabetically", () => {
    const result = sortCamps(mockCamps, "alphabetical");
    expect(result[0].name).toBe("Camp Alpha");
    expect(result[1].name).toBe("Camp Beta");
    expect(result[2].name).toBe("Camp Gamma");
  });

  it("should sort camps by borough", () => {
    const result = sortCamps(mockCamps, "borough");
    // Camps with boroughs should come first, sorted alphabetically
    // Camps with null borough should come last
    expect(result[0].borough).toBe("Plateau");
    expect(result[1].borough).toBe("Plateau");
    expect(result[2].borough).toBe(null);
  });
});

describe("getUniqueBoroughs", () => {
  it("should return unique sorted boroughs", () => {
    const result = getUniqueBoroughs(mockCamps);
    // Should only return boroughs from camps (vacation camps don't have boroughs)
    expect(result).toEqual(["Plateau"]);
  });
});

describe("getUniqueLanguages", () => {
  it("should return unique sorted languages", () => {
    const result = getUniqueLanguages(mockCamps);
    expect(result).toEqual(["English", "French"]);
  });
});
