import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { exportCampsToExcel } from "./exportCamps";
import * as XLSX from "xlsx";
import { en } from "@/localization/en";
import { fr } from "@/localization/fr";
import type { Camp } from "@/types/camp";

// Mock XLSX
vi.mock("xlsx", () => ({
  utils: {
    json_to_sheet: vi.fn(() => ({})),
    book_new: vi.fn(() => ({})),
    book_append_sheet: vi.fn(),
  },
  writeFile: vi.fn(),
}));

describe("exportCampsToExcel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockCamp: Camp = {
    name: "Summer Camp",
    type: "day",
    borough: "Plateau-Mont-Royal",
    ageRange: {
      type: "range",
      allAges: false,
      from: 5,
      to: 12,
    },
    languages: ["French", "English"],
    dates: {
      type: "range",
      yearRound: false,
      fromDate: "2024-06-15",
      toDate: "2024-08-15",
    },
    hours: "9:00 AM - 5:00 PM",
    cost: {
      amount: 200,
      period: "week",
    },
    financialAid: "Available for low-income families",
    link: "https://example.com",
    phone: {
      number: "514-123-4567",
      extension: "123",
    },
    notes: "Bring lunch",
  };

  it("should call XLSX functions with correct parameters including headers", () => {
    const camps = [mockCamp];
    exportCampsToExcel(camps, { translations: en, language: "en" });

    // Verify headers are explicitly defined
    const expectedHeaders = [
      "Name",
      "Type",
      "Borough",
      "Age Range",
      "Languages",
      "Dates",
      "Hours",
      "Cost",
      "Financial Aid",
      "Website",
      "Phone",
      "Notes",
    ];

    expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith(
      expect.arrayContaining([expect.any(Object)]),
      { header: expectedHeaders }
    );
    expect(XLSX.utils.book_new).toHaveBeenCalled();
    expect(XLSX.utils.book_append_sheet).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      "Camps"
    );
    expect(XLSX.writeFile).toHaveBeenCalledWith(
      expect.any(Object),
      expect.stringMatching(/^montreal_camps_\d{4}-\d{2}-\d{2}\.xlsx$/)
    );
  });

  it("should format camp data with English translations", () => {
    const camps = [mockCamp];
    exportCampsToExcel(camps, { translations: en, language: "en" });

    const jsonToSheetCall = vi.mocked(XLSX.utils.json_to_sheet).mock.calls[0][0];
    expect(jsonToSheetCall).toHaveLength(1);
    
    const exportedCamp = jsonToSheetCall[0];
    expect(exportedCamp).toHaveProperty("Name", "Summer Camp");
    expect(exportedCamp).toHaveProperty("Type", "Day Camps");
    expect(exportedCamp).toHaveProperty("Borough", "Plateau-Mont-Royal");
    expect(exportedCamp).toHaveProperty("Age Range", "5 years - 12 years");
    expect(exportedCamp).toHaveProperty("Languages", "French, English");
    expect(exportedCamp).toHaveProperty("Hours", "9:00 AM - 5:00 PM");
    expect(exportedCamp).toHaveProperty("Cost", "$200.00/week");
    expect(exportedCamp).toHaveProperty("Financial Aid", "Available for low-income families");
    expect(exportedCamp).toHaveProperty("Website", "https://example.com");
    expect(exportedCamp).toHaveProperty("Phone", "514-123-4567 ext. 123");
    expect(exportedCamp).toHaveProperty("Notes", "Bring lunch");
  });

  it("should format camp data with French translations", () => {
    const camps = [mockCamp];
    exportCampsToExcel(camps, { translations: fr, language: "fr" });

    const jsonToSheetCall = vi.mocked(XLSX.utils.json_to_sheet).mock.calls[0][0];
    expect(jsonToSheetCall).toHaveLength(1);
    
    const exportedCamp = jsonToSheetCall[0];
    expect(exportedCamp).toHaveProperty("Nom", "Summer Camp");
    expect(exportedCamp).toHaveProperty("Type", "Camps de jour");
    expect(exportedCamp).toHaveProperty("Arrondissement", "Plateau-Mont-Royal");
    expect(exportedCamp).toHaveProperty("Tranche d'âge", "5 ans - 12 ans");
    expect(exportedCamp).toHaveProperty("Langues", "Français, Anglais");
    expect(exportedCamp).toHaveProperty("Heures", "9:00 AM - 5:00 PM");
    expect(exportedCamp).toHaveProperty("Coût", "$200.00/semaine");
  });

  it("should handle camps with all ages", () => {
    const campWithAllAges: Camp = {
      ...mockCamp,
      ageRange: {
        type: "all",
        allAges: true,
      },
    };

    exportCampsToExcel([campWithAllAges], { translations: en, language: "en" });

    const jsonToSheetCall = vi.mocked(XLSX.utils.json_to_sheet).mock.calls[0][0];
    const exportedCamp = jsonToSheetCall[0];
    expect(exportedCamp).toHaveProperty("Age Range", "All ages");
  });

  it("should handle camps with year-round dates", () => {
    const campYearRound: Camp = {
      ...mockCamp,
      dates: {
        type: "yearRound",
        yearRound: true,
      },
    };

    exportCampsToExcel([campYearRound], { translations: en, language: "en" });

    const jsonToSheetCall = vi.mocked(XLSX.utils.json_to_sheet).mock.calls[0][0];
    const exportedCamp = jsonToSheetCall[0];
    expect(exportedCamp).toHaveProperty("Dates", "Year round");
  });

  it("should handle camps without phone extension", () => {
    const campNoExtension: Camp = {
      ...mockCamp,
      phone: {
        number: "514-123-4567",
      },
    };

    exportCampsToExcel([campNoExtension], { translations: en, language: "en" });

    const jsonToSheetCall = vi.mocked(XLSX.utils.json_to_sheet).mock.calls[0][0];
    const exportedCamp = jsonToSheetCall[0];
    expect(exportedCamp).toHaveProperty("Phone", "514-123-4567");
  });

  it("should handle camps without hours", () => {
    const campNoHours: Camp = {
      ...mockCamp,
      hours: undefined,
    };

    exportCampsToExcel([campNoHours], { translations: en, language: "en" });

    const jsonToSheetCall = vi.mocked(XLSX.utils.json_to_sheet).mock.calls[0][0];
    const exportedCamp = jsonToSheetCall[0];
    expect(exportedCamp).toHaveProperty("Hours", "");
  });

  it("should handle camps without notes", () => {
    const campNoNotes: Camp = {
      ...mockCamp,
      notes: undefined,
    };

    exportCampsToExcel([campNoNotes], { translations: en, language: "en" });

    const jsonToSheetCall = vi.mocked(XLSX.utils.json_to_sheet).mock.calls[0][0];
    const exportedCamp = jsonToSheetCall[0];
    expect(exportedCamp).toHaveProperty("Notes", "");
  });

  it("should handle multiple camps", () => {
    const camps = [
      mockCamp,
      { ...mockCamp, name: "Winter Camp", type: "vacation" as const },
    ];

    exportCampsToExcel(camps, { translations: en, language: "en" });

    const jsonToSheetCall = vi.mocked(XLSX.utils.json_to_sheet).mock.calls[0][0];
    expect(jsonToSheetCall).toHaveLength(2);
    expect(jsonToSheetCall[0]).toHaveProperty("Name", "Summer Camp");
    expect(jsonToSheetCall[1]).toHaveProperty("Name", "Winter Camp");
    expect(jsonToSheetCall[1]).toHaveProperty("Type", "Vacation Camps");
  });

  it("should handle empty camps array", () => {
    exportCampsToExcel([], { translations: en, language: "en" });

    const jsonToSheetCall = vi.mocked(XLSX.utils.json_to_sheet).mock.calls[0][0];
    expect(jsonToSheetCall).toHaveLength(0);
  });

  it("should set correct column widths", () => {
    const camps = [mockCamp];
    exportCampsToExcel(camps, { translations: en, language: "en" });

    const worksheet = vi.mocked(XLSX.utils.json_to_sheet).mock.results[0].value;
    expect(worksheet["!cols"]).toEqual([
      { wch: 30 }, // name
      { wch: 12 }, // type
      { wch: 20 }, // borough
      { wch: 15 }, // ageRange
      { wch: 25 }, // languages
      { wch: 25 }, // dates
      { wch: 20 }, // hours
      { wch: 15 }, // cost
      { wch: 30 }, // financialAid
      { wch: 40 }, // link
      { wch: 20 }, // phone
      { wch: 40 }, // notes
    ]);
  });

  it("should use correct sheet name from translations", () => {
    exportCampsToExcel([mockCamp], { translations: en, language: "en" });
    expect(XLSX.utils.book_append_sheet).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      "Camps"
    );

    vi.clearAllMocks();

    exportCampsToExcel([mockCamp], { translations: fr, language: "fr" });
    expect(XLSX.utils.book_append_sheet).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      "Camps"
    );
  });

  it("should use correct file name pattern from translations", () => {
    exportCampsToExcel([mockCamp], { translations: en, language: "en" });
    expect(XLSX.writeFile).toHaveBeenCalledWith(
      expect.any(Object),
      expect.stringMatching(/^montreal_camps_\d{4}-\d{2}-\d{2}\.xlsx$/)
    );

    vi.clearAllMocks();

    exportCampsToExcel([mockCamp], { translations: fr, language: "fr" });
    expect(XLSX.writeFile).toHaveBeenCalledWith(
      expect.any(Object),
      expect.stringMatching(/^camps_montreal_\d{4}-\d{2}-\d{2}\.xlsx$/)
    );
  });
});

