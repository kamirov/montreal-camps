import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { exportCampsToExcel } from "./exportCamps";
import * as XLSX from "xlsx";
import { en } from "@/localization/en";
import { fr } from "@/localization/fr";
import type { Camp } from "@/types/camp";

// Mock XLSX
vi.mock("xlsx", () => ({
  utils: {
    json_to_sheet: vi.fn(() => ({ "!ref": "A1:L2" })),
    book_new: vi.fn(() => ({})),
    book_append_sheet: vi.fn(),
    decode_range: vi.fn(() => ({
      s: { c: 0, r: 0 },
      e: { c: 11, r: 1 },
    })),
    encode_cell: vi.fn((cell: { r: number; c: number }) =>
      String.fromCharCode(65 + cell.c) + (cell.r + 1)
    ),
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

  it("should call XLSX functions and create separate sheets for day and vacation camps", () => {
    const vacationCamp: Camp = { ...mockCamp, type: "vacation", borough: null };
    const camps = [mockCamp, vacationCamp];
    exportCampsToExcel(camps, { translations: en, language: "en" });

    expect(XLSX.utils.book_new).toHaveBeenCalled();
    
    // Should create two sheets - one for day camps, one for vacation camps
    expect(XLSX.utils.json_to_sheet).toHaveBeenCalledTimes(2);
    expect(XLSX.utils.book_append_sheet).toHaveBeenCalledTimes(2);
    
    // First sheet should be Day Camps
    expect(XLSX.utils.book_append_sheet).toHaveBeenNthCalledWith(
      1,
      expect.any(Object),
      expect.any(Object),
      "Day Camps"
    );
    
    // Second sheet should be Vacation Camps
    expect(XLSX.utils.book_append_sheet).toHaveBeenNthCalledWith(
      2,
      expect.any(Object),
      expect.any(Object),
      "Vacation Camps"
    );
    
    expect(XLSX.writeFile).toHaveBeenCalledWith(
      expect.any(Object),
      expect.stringMatching(/^montreal_camps_\d{4}-\d{2}-\d{2}\.xlsx$/)
    );
  });

  it("should format day camp data with English translations", () => {
    const camps = [mockCamp];
    exportCampsToExcel(camps, { translations: en, language: "en" });

    const jsonToSheetCall = vi.mocked(XLSX.utils.json_to_sheet).mock.calls[0][0];
    expect(jsonToSheetCall).toHaveLength(1);
    
    const exportedCamp = jsonToSheetCall[0];
    expect(exportedCamp).toHaveProperty("Name", "Summer Camp");
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

  it("should format day camp data with French translations", () => {
    const camps = [mockCamp];
    exportCampsToExcel(camps, { translations: fr, language: "fr" });

    const jsonToSheetCall = vi.mocked(XLSX.utils.json_to_sheet).mock.calls[0][0];
    expect(jsonToSheetCall).toHaveLength(1);
    
    const exportedCamp = jsonToSheetCall[0];
    expect(exportedCamp).toHaveProperty("Nom", "Summer Camp");
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

  it("should handle multiple camps and separate by type", () => {
    const camps = [
      mockCamp,
      { ...mockCamp, name: "Winter Camp", type: "vacation" as const, borough: null },
    ];

    exportCampsToExcel(camps, { translations: en, language: "en" });

    // Should have 2 sheets created - one for day camps, one for vacation camps
    expect(vi.mocked(XLSX.utils.json_to_sheet)).toHaveBeenCalledTimes(2);
    
    // Day camps sheet
    const dayCampsCall = vi.mocked(XLSX.utils.json_to_sheet).mock.calls[0][0];
    expect(dayCampsCall).toHaveLength(1);
    expect(dayCampsCall[0]).toHaveProperty("Name", "Summer Camp");
    
    // Vacation camps sheet
    const vacationCampsCall = vi.mocked(XLSX.utils.json_to_sheet).mock.calls[1][0];
    expect(vacationCampsCall).toHaveLength(1);
    expect(vacationCampsCall[0]).toHaveProperty("Name", "Winter Camp");
  });

  it("should handle empty camps array", () => {
    exportCampsToExcel([], { translations: en, language: "en" });

    // No sheets should be created for empty array
    expect(vi.mocked(XLSX.utils.json_to_sheet)).not.toHaveBeenCalled();
    expect(vi.mocked(XLSX.utils.book_append_sheet)).not.toHaveBeenCalled();
  });

  it("should set correct column widths for day camps", () => {
    const camps = [mockCamp];
    exportCampsToExcel(camps, { translations: en, language: "en" });

    const worksheet = vi.mocked(XLSX.utils.json_to_sheet).mock.results[0].value;
    expect(worksheet["!cols"]).toEqual([
      { wch: 30 }, // name
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

  it("should use correct sheet names from translations", () => {
    exportCampsToExcel([mockCamp], { translations: en, language: "en" });
    expect(XLSX.utils.book_append_sheet).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      "Day Camps"
    );

    vi.clearAllMocks();

    exportCampsToExcel([mockCamp], { translations: fr, language: "fr" });
    expect(XLSX.utils.book_append_sheet).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      "Camps de jour"
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

