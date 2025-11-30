import { formatAgeRange, formatPhone } from "@/localization/formatters";
import type { Language, Translations } from "@/localization/types";
import type { Camp } from "@/types/camp";
import * as XLSX from "xlsx";

export type ExportOptions = {
  translations: Translations;
  language: Language;
};

/**
 * Exports camp data to an Excel file
 */
export function exportCampsToExcel(
  camps: Camp[],
  options: ExportOptions
): void {
  const { translations: t, language } = options;

  // Create workbook
  const workbook = XLSX.utils.book_new();

  // Process all camps in a single sheet
  if (camps.length > 0) {
    // Sort camps alphabetically by borough, then by name
    const sortedCamps = [...camps].sort((a, b) => {
      // Sort by borough first (null/empty boroughs go to the end)
      const boroughA = a.borough || "";
      const boroughB = b.borough || "";

      // If both boroughs are empty, sort by name
      if (!boroughA && !boroughB) {
        return a.name.localeCompare(b.name, language, {
          sensitivity: "base",
          numeric: true,
        });
      }

      // If only boroughA is empty, it goes to the end
      if (!boroughA) return 1;

      // If only boroughB is empty, it goes to the end
      if (!boroughB) return -1;

      // Both boroughs are non-empty, compare them
      const boroughCompare = boroughA.localeCompare(boroughB, language, {
        sensitivity: "base",
        numeric: true,
      });
      if (boroughCompare !== 0) return boroughCompare;

      // If boroughs are equal, sort by name
      return a.name.localeCompare(b.name, language, {
        sensitivity: "base",
        numeric: true,
      });
    });

    const headers = [
      t.export.columns.name,
      t.export.columns.borough,
      t.export.columns.ageRange,
      t.export.columns.link,
      t.export.columns.phone,
      t.export.columns.email,
      t.export.columns.address,
      t.export.columns.notes,
    ];

    const data = sortedCamps.map((camp) => ({
      [t.export.columns.name]: camp.name,
      [t.export.columns.borough]: camp.borough || "",
      [t.export.columns.ageRange]: formatAgeRange(camp.ageRange, language),
      [t.export.columns.link]: camp.link || "",
      [t.export.columns.phone]: camp.phone ? formatPhone(camp.phone) : "",
      [t.export.columns.email]: camp.email ?? "",
      [t.export.columns.address]: camp.address ?? "",
      [t.export.columns.notes]: camp.notes ?? "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data, {
      header: headers,
    });

    worksheet["!cols"] = [
      { wch: 30 }, // name
      { wch: 20 }, // borough
      { wch: 15 }, // ageRange
      { wch: 40 }, // link
      { wch: 20 }, // phone
      { wch: 30 }, // email
      { wch: 40 }, // address
      { wch: 40 }, // notes
    ];

    // Bold the header row
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      const cell = worksheet[cellAddress];
      if (!cell) continue;

      // Ensure the cell has a style object and set bold
      if (!cell.s) {
        cell.s = {};
      }
      if (!cell.s.font) {
        cell.s.font = {};
      }
      cell.s.font.bold = true;
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, t.export.sheetName);
  }

  // Generate Excel file and trigger download
  const fileName = `${t.export.fileName}_${
    new Date().toISOString().split("T")[0]
  }.xlsx`;
  XLSX.writeFile(workbook, fileName);
}
