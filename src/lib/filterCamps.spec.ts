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
    ageRange: "5-10",
    languages: ["English", "French"],
    dates: "July 1-30",
    hours: "9-5",
    cost: "$200/week",
    financialAid: "Available",
    link: "http://example.com",
    phone: "514-555-0101",
    notes: "Great camp with swimming",
    coordinates: [45.5, -73.6],
  },
  {
    id: "2",
    type: "vacation",
    name: "Camp Beta",
    borough: "NDG",
    ageRange: "8-14",
    languages: ["French"],
    dates: "March 1-5",
    cost: "$150/week",
    financialAid: "Not available",
    link: "http://example.com",
    phone: "514-555-0102",
    notes: "Indoor activities",
    coordinates: [45.4, -73.7],
  },
  {
    id: "3",
    type: "day",
    name: "Camp Gamma",
    borough: "Plateau",
    ageRange: "6-12",
    languages: ["English"],
    dates: "July 15-Aug 15",
    hours: "8-4",
    cost: "$180/week",
    financialAid: "None",
    link: "http://example.com",
    phone: "514-555-0103",
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
      hasFinancialAid: null,
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
      hasFinancialAid: null,
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
      hasFinancialAid: null,
      selectedLanguages: [],
    };
    const result = filterCamps(mockCamps, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("should filter by borough", () => {
    const filters: FilterState = {
      searchQuery: "",
      campType: "all",
      boroughs: ["Plateau"],
      hasFinancialAid: null,
      selectedLanguages: [],
    };
    const result = filterCamps(mockCamps, filters);
    expect(result).toHaveLength(2);
    expect(result.every((camp) => camp.borough === "Plateau")).toBe(true);
  });

  it("should filter by financial aid availability", () => {
    const filters: FilterState = {
      searchQuery: "",
      campType: "all",
      boroughs: [],
      hasFinancialAid: true,
      selectedLanguages: [],
    };
    const result = filterCamps(mockCamps, filters);
    expect(result).toHaveLength(1);
    expect(result[0].financialAid).toContain("Available");
  });

  it("should filter by language", () => {
    const filters: FilterState = {
      searchQuery: "",
      campType: "all",
      boroughs: [],
      hasFinancialAid: null,
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
    expect(result[0].cost).toBe("$150/week");
    expect(result[2].cost).toBe("$200/week");
  });

  it("should sort camps by cost (high to low)", () => {
    const result = sortCamps(mockCamps, "costHighToLow");
    expect(result[0].cost).toBe("$200/week");
    expect(result[2].cost).toBe("$150/week");
  });

  it("should sort camps by borough", () => {
    const result = sortCamps(mockCamps, "borough");
    expect(result[0].borough).toBe("NDG");
    expect(result[1].borough).toBe("Plateau");
  });
});

describe("getUniqueBoroughs", () => {
  it("should return unique sorted boroughs", () => {
    const result = getUniqueBoroughs(mockCamps);
    expect(result).toEqual(["NDG", "Plateau"]);
  });
});

describe("getUniqueLanguages", () => {
  it("should return unique sorted languages", () => {
    const result = getUniqueLanguages(mockCamps);
    expect(result).toEqual(["English", "French"]);
  });
});
