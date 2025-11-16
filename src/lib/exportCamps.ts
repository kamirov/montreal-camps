import {
  formatAgeRange,
  formatCost,
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
 * Exports camp data to an Excel file with separate sheets for day and vacation camps
 */
export function exportCampsToExcel(
  camps: Camp[],
  options: ExportOptions
): void {
  const { translations: t, language } = options;

  // Separate camps by type
  const dayCamps = camps.filter((camp) => camp.type === "day");
  const vacationCamps = camps.filter((camp) => camp.type === "vacation");

  // Create workbook
  const workbook = XLSX.utils.book_new();

  // Process Day Camps sheet
  if (dayCamps.length > 0) {
    const dayHeaders = [
      t.export.columns.name,
      t.export.columns.borough,
      t.export.columns.ageRange,
      t.export.columns.languages,
      t.export.columns.dates,
      t.export.columns.hours,
      t.export.columns.cost,
      t.export.columns.financialAid,
      t.export.columns.link,
      t.export.columns.phone,
      t.export.columns.email,
      t.export.columns.address,
      t.export.columns.notes,
    ];

    console.log("dayCamps", dayCamps);

    const dayData = dayCamps.map((camp) => ({
      [t.export.columns.name]: camp.name,
      [t.export.columns.borough]: camp.borough || "",
      [t.export.columns.ageRange]: formatAgeRange(camp.ageRange, language),
      [t.export.columns.languages]: camp.languages
        .map((lang) => formatLanguage(lang, t))
        .join(", "),
      [t.export.columns.dates]: formatDateRange(camp.dates, language, t),
      [t.export.columns.hours]: camp.hours ?? "",
      [t.export.columns.cost]: formatCost(camp.cost, language, t),
      [t.export.columns.financialAid]: camp.financialAid,
      [t.export.columns.link]: camp.link,
      [t.export.columns.phone]: formatPhone(camp.phone),
      [t.export.columns.email]: camp.email ?? "",
      [t.export.columns.address]: camp.address ?? "",
      [t.export.columns.notes]: camp.notes ?? "",
    }));

    const dayWorksheet = XLSX.utils.json_to_sheet(dayData, {
      header: dayHeaders,
    });

    dayWorksheet["!cols"] = [
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
      { wch: 30 }, // email
      { wch: 40 }, // address
      { wch: 40 }, // notes
    ];

    // Bold the header row
    const dayRange = XLSX.utils.decode_range(dayWorksheet["!ref"] || "A1");
    for (let col = dayRange.s.c; col <= dayRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!dayWorksheet[cellAddress]) continue;
      dayWorksheet[cellAddress].s = {
        font: { bold: true },
      };
    }

    XLSX.utils.book_append_sheet(workbook, dayWorksheet, t.campTypes.day);
  }

  // Process Vacation Camps sheet
  if (vacationCamps.length > 0) {
    const vacationHeaders = [
      t.export.columns.name,
      t.export.columns.ageRange,
      t.export.columns.languages,
      t.export.columns.dates,
      t.export.columns.cost,
      t.export.columns.financialAid,
      t.export.columns.link,
      t.export.columns.phone,
      t.export.columns.email,
      t.export.columns.address,
      t.export.columns.notes,
    ];

    const vacationData = vacationCamps.map((camp) => ({
      [t.export.columns.name]: camp.name,
      [t.export.columns.ageRange]: formatAgeRange(camp.ageRange, language),
      [t.export.columns.languages]: camp.languages
        .map((lang) => formatLanguage(lang, t))
        .join(", "),
      [t.export.columns.dates]: formatDateRange(camp.dates, language, t),
      [t.export.columns.cost]: formatCost(camp.cost, language, t),
      [t.export.columns.financialAid]: camp.financialAid,
      [t.export.columns.link]: camp.link,
      [t.export.columns.phone]: formatPhone(camp.phone),
      [t.export.columns.email]: camp.email ?? "",
      [t.export.columns.address]: camp.address ?? "",
      [t.export.columns.notes]: camp.notes ?? "",
    }));

    const vacationWorksheet = XLSX.utils.json_to_sheet(vacationData, {
      header: vacationHeaders,
    });

    vacationWorksheet["!cols"] = [
      { wch: 30 }, // name
      { wch: 15 }, // ageRange
      { wch: 25 }, // languages
      { wch: 25 }, // dates
      { wch: 15 }, // cost
      { wch: 30 }, // financialAid
      { wch: 40 }, // link
      { wch: 20 }, // phone
      { wch: 30 }, // email
      { wch: 40 }, // address
      { wch: 40 }, // notes
    ];

    // Bold the header row
    const vacationRange = XLSX.utils.decode_range(
      vacationWorksheet["!ref"] || "A1"
    );
    for (let col = vacationRange.s.c; col <= vacationRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!vacationWorksheet[cellAddress]) continue;
      vacationWorksheet[cellAddress].s = {
        font: { bold: true },
      };
    }

    XLSX.utils.book_append_sheet(
      workbook,
      vacationWorksheet,
      t.campTypes.vacation
    );
  }

  // Generate Excel file and trigger download
  const fileName = `${t.export.fileName}_${
    new Date().toISOString().split("T")[0]
  }.xlsx`;
  XLSX.writeFile(workbook, fileName);
}
