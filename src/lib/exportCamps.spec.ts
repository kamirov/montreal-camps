import { en } from "@/localization/en";
import { fr } from "@/localization/fr";
import type { Camp } from "@/types/camp";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as XLSX from "xlsx";
import { exportCampsToExcel } from "./exportCamps";

// Mock XLSX
vi.mock("xlsx", () => ({
  utils: {
    json_to_sheet: vi.fn(() => ({ "!ref": "A1:G2" })),
    book_new: vi.fn(() => ({})),
    book_append_sheet: vi.fn(),
    decode_range: vi.fn(() => ({
      s: { c: 0, r: 0 },
      e: { c: 6, r: 1 },
    })),
    encode_cell: vi.fn(
      (cell: { r: number; c: number }) =>
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
    financialAid: "Available for low-income families",
    link: "https://example.com",
    phone: {
      number: "514-123-4567",
      extension: "123",
    },
    notes: "Bring lunch",
  };

  it("should call XLSX functions and create a single sheet for all camps", () => {
    const camps = [mockCamp];
    exportCampsToExcel(camps, { translations: en, language: "en" });

    expect(XLSX.utils.book_new).toHaveBeenCalled();

    // Should create one sheet for all camps
    expect(XLSX.utils.json_to_sheet).toHaveBeenCalledTimes(1);
    expect(XLSX.utils.book_append_sheet).toHaveBeenCalledTimes(1);

    // Sheet should be named "Camps"
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

    const jsonToSheetCall = vi.mocked(XLSX.utils.json_to_sheet).mock
      .calls[0][0];
    expect(jsonToSheetCall).toHaveLength(1);

    const exportedCamp = jsonToSheetCall[0];
    expect(exportedCamp).toHaveProperty("Name", "Summer Camp");
    expect(exportedCamp).toHaveProperty("Borough", "Plateau-Mont-Royal");
    expect(exportedCamp).toHaveProperty("Age Range", "5 years - 12 years");
    expect(exportedCamp).toHaveProperty("Website", "https://example.com");
    expect(exportedCamp).toHaveProperty("Phone", "(514) 123-4567 ext. 123");
    expect(exportedCamp).not.toHaveProperty("Notes");
  });

  it("should format camp data with French translations", () => {
    const camps = [mockCamp];
    exportCampsToExcel(camps, { translations: fr, language: "fr" });

    const jsonToSheetCall = vi.mocked(XLSX.utils.json_to_sheet).mock
      .calls[0][0];
    expect(jsonToSheetCall).toHaveLength(1);

    const exportedCamp = jsonToSheetCall[0];
    expect(exportedCamp).toHaveProperty("Nom", "Summer Camp");
    expect(exportedCamp).toHaveProperty("Arrondissement", "Plateau-Mont-Royal");
    expect(exportedCamp).toHaveProperty("Tranche d'âge", "5 ans - 12 ans");
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

    const jsonToSheetCall = vi.mocked(XLSX.utils.json_to_sheet).mock
      .calls[0][0];
    const exportedCamp = jsonToSheetCall[0];
    expect(exportedCamp).toHaveProperty("Age Range", "All ages");
  });

  it("should handle camps without phone extension", () => {
    const campNoExtension: Camp = {
      ...mockCamp,
      phone: {
        number: "514-123-4567",
      },
    };

    exportCampsToExcel([campNoExtension], { translations: en, language: "en" });

    const jsonToSheetCall = vi.mocked(XLSX.utils.json_to_sheet).mock
      .calls[0][0];
    const exportedCamp = jsonToSheetCall[0];
    expect(exportedCamp).toHaveProperty("Phone", "(514) 123-4567");
  });

  it("should not include notes column in export", () => {
    const campWithNotes: Camp = {
      ...mockCamp,
      notes: "Some notes",
    };

    exportCampsToExcel([campWithNotes], { translations: en, language: "en" });

    const jsonToSheetCall = vi.mocked(XLSX.utils.json_to_sheet).mock
      .calls[0][0];
    const exportedCamp = jsonToSheetCall[0];
    expect(exportedCamp).not.toHaveProperty("Notes");
  });

  it("should handle multiple camps in a single sheet", () => {
    const camps = [
      mockCamp,
      {
        ...mockCamp,
        name: "Winter Camp",
        borough: "",
      },
    ];

    exportCampsToExcel(camps, { translations: en, language: "en" });

    // Should have 1 sheet created for all camps
    expect(vi.mocked(XLSX.utils.json_to_sheet)).toHaveBeenCalledTimes(1);

    // All camps should be in the same sheet
    const campsCall = vi.mocked(XLSX.utils.json_to_sheet).mock.calls[0][0];
    expect(campsCall).toHaveLength(2);
    // With sorting, Summer Camp (has borough) should come before Winter Camp (no borough)
    expect(campsCall[0]).toHaveProperty("Name", "Summer Camp");
    expect(campsCall[1]).toHaveProperty("Name", "Winter Camp");
  });

  it("should sort camps alphabetically by borough, then by name", () => {
    const camps = [
      {
        ...mockCamp,
        name: "Zebra Camp",
        borough: "Ahuntsic-Cartierville",
      },
      {
        ...mockCamp,
        name: "Alpha Camp",
        borough: "Ahuntsic-Cartierville",
      },
      {
        ...mockCamp,
        name: "Winter Camp",
        borough: "",
      },
      {
        ...mockCamp,
        name: "Beta Camp",
        borough: "Plateau-Mont-Royal",
      },
    ];

    exportCampsToExcel(camps, { translations: en, language: "en" });

    const campsCall = vi.mocked(XLSX.utils.json_to_sheet).mock.calls[0][0];
    expect(campsCall).toHaveLength(4);

    // First should be Alpha Camp (same borough, but alphabetically first)
    expect(campsCall[0]).toHaveProperty("Name", "Alpha Camp");
    expect(campsCall[0]).toHaveProperty("Borough", "Ahuntsic-Cartierville");

    // Second should be Zebra Camp (same borough, but alphabetically second)
    expect(campsCall[1]).toHaveProperty("Name", "Zebra Camp");
    expect(campsCall[1]).toHaveProperty("Borough", "Ahuntsic-Cartierville");

    // Third should be Beta Camp (different borough, alphabetically after Ahuntsic)
    expect(campsCall[2]).toHaveProperty("Name", "Beta Camp");
    expect(campsCall[2]).toHaveProperty("Borough", "Plateau-Mont-Royal");

    // Last should be Winter Camp (no borough, goes to the end)
    expect(campsCall[3]).toHaveProperty("Name", "Winter Camp");
    expect(campsCall[3]).toHaveProperty("Borough", "");
  });

  it("should handle empty camps array", () => {
    exportCampsToExcel([], { translations: en, language: "en" });

    // No sheets should be created for empty array
    expect(vi.mocked(XLSX.utils.json_to_sheet)).not.toHaveBeenCalled();
    expect(vi.mocked(XLSX.utils.book_append_sheet)).not.toHaveBeenCalled();
  });

  it("should set correct column widths for camps", () => {
    const camps = [mockCamp];
    exportCampsToExcel(camps, { translations: en, language: "en" });

    const worksheet = vi.mocked(XLSX.utils.json_to_sheet).mock.results[0].value;
    expect(worksheet["!cols"]).toEqual([
      { wch: 30 }, // name
      { wch: 20 }, // borough
      { wch: 15 }, // ageRange
      { wch: 40 }, // link
      { wch: 20 }, // phone
      { wch: 30 }, // email
      { wch: 40 }, // address
    ]);
  });

  it("should use correct sheet names from translations", () => {
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
