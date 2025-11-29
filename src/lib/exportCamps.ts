import {
  formatAgeRange,
  formatDateRange,
  formatLanguage,
  formatPhone,
} from "@/localization/formatters";
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
    const headers = [
      t.export.columns.name,
      t.export.columns.borough,
      t.export.columns.ageRange,
      t.export.columns.languages,
      t.export.columns.dates,
      t.export.columns.financialAid,
      t.export.columns.link,
      t.export.columns.phone,
      t.export.columns.email,
      t.export.columns.address,
      t.export.columns.notes,
    ];

    const data = camps.map((camp) => ({
      [t.export.columns.name]: camp.name,
      [t.export.columns.borough]: camp.borough || "",
      [t.export.columns.ageRange]: formatAgeRange(camp.ageRange, language),
      [t.export.columns.languages]: camp.languages
        .map((lang) => formatLanguage(lang, t))
        .join(", "),
      [t.export.columns.dates]: formatDateRange(camp.dates, language, t),
      [t.export.columns.financialAid]: camp.financialAid,
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
      { wch: 25 }, // languages
      { wch: 25 }, // dates
      { wch: 30 }, // financialAid
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
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = {
        font: { bold: true },
      };
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, t.export.sheetName);
  }

  // Generate Excel file and trigger download
  const fileName = `${t.export.fileName}_${
    new Date().toISOString().split("T")[0]
  }.xlsx`;
  XLSX.writeFile(workbook, fileName);
}
