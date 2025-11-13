import * as XLSX from "xlsx";
import type { Camp } from "@/types/camp";
import type { Translations, Language } from "@/localization/types";
import {
  formatAgeRange,
  formatDateRange,
  formatCost,
  formatPhone,
  formatLanguage,
} from "@/localization/formatters";

export type ExportOptions = {
  translations: Translations;
  language: Language;
};

/**
 * Exports camp data to an Excel file and triggers download
 */
export function exportCampsToExcel(
  camps: Camp[],
  options: ExportOptions
): void {
  const { translations: t, language } = options;

  // Define header order
  const headers = [
    t.export.columns.name,
    t.export.columns.type,
    t.export.columns.borough,
    t.export.columns.ageRange,
    t.export.columns.languages,
    t.export.columns.dates,
    t.export.columns.hours,
    t.export.columns.cost,
    t.export.columns.financialAid,
    t.export.columns.link,
    t.export.columns.phone,
    t.export.columns.notes,
  ];

  // Convert camps to Excel-friendly format
  const data = camps.map((camp) => ({
    [t.export.columns.name]: camp.name,
    [t.export.columns.type]: t.campTypes[camp.type],
    [t.export.columns.borough]: camp.borough,
    [t.export.columns.ageRange]: formatAgeRange(camp.ageRange, language),
    [t.export.columns.languages]: camp.languages
      .map((lang) => formatLanguage(lang, t))
      .join(", "),
    [t.export.columns.dates]: formatDateRange(camp.dates, language, t),
    [t.export.columns.hours]: camp.hours || "",
    [t.export.columns.cost]: formatCost(camp.cost, language, t),
    [t.export.columns.financialAid]: camp.financialAid,
    [t.export.columns.link]: camp.link,
    [t.export.columns.phone]: formatPhone(camp.phone),
    [t.export.columns.notes]: camp.notes || "",
  }));

  // Create worksheet with explicit headers
  const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });

  // Set column widths for better readability
  const columnWidths = [
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
  ];
  worksheet["!cols"] = columnWidths;

  // Create workbook and add worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, t.export.sheetName);

  // Generate Excel file and trigger download
  const fileName = `${t.export.fileName}_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

