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
    id: "1",
    type: "day",
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
    hours: "9-5",
    cost: { amount: 200, period: "week" },
    financialAid: "Available",
    link: "http://example.com",
    phone: { number: "514-555-0101", extension: "" },
    notes: "Great camp with swimming",
    coordinates: [45.5, -73.6],
  },
  {
    id: "2",
    type: "vacation",
    name: "Camp Beta",
    borough: null, // Vacation camps don't have boroughs
    ageRange: { type: "range", allAges: false, from: 8, to: 14 },
    languages: ["French"],
    dates: {
      type: "range",
      yearRound: false,
      fromDate: "2024-03-01",
      toDate: "2024-03-05",
    },
    cost: { amount: 150, period: "week" },
    financialAid: "Contact for information",
    link: "http://example.com",
    phone: { number: "514-555-0102", extension: "" },
    notes: "Indoor activities",
    coordinates: [45.4, -73.7],
  },
  {
    id: "3",
    type: "day",
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
    hours: "8-4",
    cost: { amount: 180, period: "week" },
    financialAid: "Available - Sliding scale",
    link: "http://example.com",
    phone: { number: "514-555-0103", extension: "" },
    notes: "Arts and crafts",
    coordinates: [45.52, -73.58],
  },
];

describe("filterCamps", () => {
  it("should return all camps when no filters are applied", () => {
    const filters: FilterState = {
      searchQuery: "",
      campType: "all",
      boroughs: [],
      selectedLanguages: [],
    };
    const result = filterCamps(mockCamps, filters);
    expect(result).toHaveLength(3);
  });

  it("should filter by camp type", () => {
    const filters: FilterState = {
      searchQuery: "",
      campType: "day",
      boroughs: [],
      selectedLanguages: [],
    };
    const result = filterCamps(mockCamps, filters);
    expect(result).toHaveLength(2);
    expect(result.every((camp) => camp.type === "day")).toBe(true);
  });

  it("should filter by search query", () => {
    const filters: FilterState = {
      searchQuery: "swimming",
      campType: "all",
      boroughs: [],
      selectedLanguages: [],
    };
    const result = filterCamps(mockCamps, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("should filter by borough (only day camps)", () => {
    const filters: FilterState = {
      searchQuery: "",
      campType: "all",
      boroughs: ["Plateau"],
      selectedLanguages: [],
    };
    const result = filterCamps(mockCamps, filters);
    // Should only return day camps with "Plateau" borough (vacation camps excluded)
    expect(result).toHaveLength(2);
    expect(result.every((camp) => camp.borough === "Plateau")).toBe(true);
    expect(result.every((camp) => camp.type === "day")).toBe(true);
  });

  it("should filter by language", () => {
    const filters: FilterState = {
      searchQuery: "",
      campType: "all",
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

  it("should sort camps by cost (low to high)", () => {
    const result = sortCamps(mockCamps, "costLowToHigh");
    expect(result[0].cost.amount).toBe(150);
    expect(result[2].cost.amount).toBe(200);
  });

  it("should sort camps by cost (high to low)", () => {
    const result = sortCamps(mockCamps, "costHighToLow");
    expect(result[0].cost.amount).toBe(200);
    expect(result[2].cost.amount).toBe(150);
  });

  it("should sort camps by borough", () => {
    const result = sortCamps(mockCamps, "borough");
    // Day camps with boroughs should come first, sorted alphabetically
    // Vacation camps (null borough) should come last
    expect(result[0].borough).toBe("Plateau");
    expect(result[1].borough).toBe("Plateau");
    expect(result[2].borough).toBe(null); // Vacation camp
  });
});

describe("getUniqueBoroughs", () => {
  it("should return unique sorted boroughs (only from day camps)", () => {
    const result = getUniqueBoroughs(mockCamps);
    // Should only return boroughs from day camps (vacation camps don't have boroughs)
    expect(result).toEqual(["Plateau"]);
  });
});

describe("getUniqueLanguages", () => {
  it("should return unique sorted languages", () => {
    const result = getUniqueLanguages(mockCamps);
    expect(result).toEqual(["English", "French"]);
  });
});
