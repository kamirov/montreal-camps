import type { Camp } from "@/lib/validations/camp";
import { Language, Translations } from "./types";

/**
 * Formats a time range from 12-hour to 24-hour format or vice versa based on language
 * English: "8:00 AM - 5:00 PM"
 * French: "8h00 - 17h00"
 */
export function formatTime(timeRange: string, language: Language): string {
  if (!timeRange) return timeRange;

  if (language === "fr") {
    // Convert from 12-hour (English) to 24-hour (French)
    return timeRange.replace(
      /(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i,
      (_, h1, m1, ap1, h2, m2, ap2) => {
        let hour1 = parseInt(h1);
        let hour2 = parseInt(h2);

        if (ap1.toUpperCase() === "PM" && hour1 !== 12) hour1 += 12;
        if (ap1.toUpperCase() === "AM" && hour1 === 12) hour1 = 0;
        if (ap2.toUpperCase() === "PM" && hour2 !== 12) hour2 += 12;
        if (ap2.toUpperCase() === "AM" && hour2 === 12) hour2 = 0;

        return `${hour1}h${m1} - ${hour2}h${m2}`;
      }
    );
  }

  // Return as-is for English
  return timeRange;
}

/**
 * Formats a date range with localized month names
 * Handles both old string format (for backward compatibility) and new structured format
 */
export function formatDateRange(
  dates: Camp["dates"] | string,
  language: Language,
  t: Translations
): string {
  if (!dates) return "";

  // Handle old string format for backward compatibility
  if (typeof dates === "string") {
    // Legacy string parsing logic...
    const monthMap: Record<string, number> = {
      january: 0,
      february: 1,
      march: 2,
      april: 3,
      may: 4,
      june: 5,
      july: 6,
      august: 7,
      september: 8,
      october: 9,
      november: 10,
      december: 11,
    };

    const pattern1 =
      /([A-Za-z]+)\s+(\d{1,2})\s*-\s*([A-Za-z]+)\s+(\d{1,2}),?\s*(\d{4})/i;
    const match = dates.match(pattern1);
    if (match) {
      const [, month1, day1, month2, day2, year] = match;
      const monthIndex1 = monthMap[month1.toLowerCase()];
      const monthIndex2 = monthMap[month2.toLowerCase()];

      if (monthIndex1 !== undefined && monthIndex2 !== undefined) {
        if (language === "fr") {
          return `${day1} ${t.months[monthIndex1]} - ${day2} ${t.months[monthIndex2]} ${year}`;
        } else {
          return `${t.months[monthIndex1]} ${day1} - ${t.months[monthIndex2]} ${day2}, ${year}`;
        }
      }
    }
    return dates;
  }

  // Handle new structured format
  if (dates.type === "yearRound") {
    return language === "fr" ? "Toute l'année" : "Year round";
  }

  if (dates.type === "range") {
    const fromDate = new Date(dates.fromDate);
    const toDate = new Date(dates.toDate);

    const monthIndex1 = fromDate.getMonth();
    const monthIndex2 = toDate.getMonth();
    const day1 = fromDate.getDate();
    const day2 = toDate.getDate();
    const year = fromDate.getFullYear();

    if (language === "fr") {
      return `${day1} ${t.months[monthIndex1]} - ${day2} ${t.months[monthIndex2]} ${year}`;
    } else {
      return `${t.months[monthIndex1]} ${day1} - ${t.months[monthIndex2]} ${day2}, ${year}`;
    }
  }

  return "";
}

/**
 * Formats cost with translated units
 * Handles both old string format and new structured format
 */
export function formatCost(
  cost: Camp["cost"] | string,
  language: Language,
  t: Translations
): string {
  if (!cost) return "";

  // Handle old string format for backward compatibility
  if (typeof cost === "string") {
    if (language === "en") return cost;
    return cost
      .replace(/\/week/gi, `/${t.costUnits.week}`)
      .replace(/\/day/gi, `/${t.costUnits.day}`)
      .replace(/\/month/gi, `/${t.costUnits.month}`);
  }

  // Handle new structured format
  const amount = cost.amount.toFixed(2);
  const period = cost.period;

  const periodTranslations: Record<string, string> = {
    week: language === "fr" ? t.costUnits.week : "week",
    month: language === "fr" ? t.costUnits.month : "month",
    year: language === "fr" ? "an" : "year",
    hour: language === "fr" ? "heure" : "hour",
  };

  return `$${amount}/${periodTranslations[period] || period}`;
}

/**
 * Formats age range
 * Handles structured format: all ages or from-to range
 */
export function formatAgeRange(
  ageRange: Camp["ageRange"],
  language: Language
): string {
  if (ageRange.type === "all") {
    return language === "fr" ? "Tous les âges" : "All ages";
  }

  if (ageRange.type === "range") {
    const suffix = language === "fr" ? " ans" : " years";
    return `${ageRange.from}${suffix} - ${ageRange.to}${suffix}`;
  }

  return "";
}

/**
 * Formats phone number
 * Handles structured format with optional extension
 */
export function formatPhone(phone: Camp["phone"]): string {
  if (typeof phone === "string") {
    // Legacy format
    return phone;
  }

  let formatted = phone.number;
  if (phone.extension) {
    formatted += ` ext. ${phone.extension}`;
  }
  return formatted;
}

/**
 * Translates language names
 * English: "French" -> "French"
 * French: "French" -> "Français"
 */
export function formatLanguage(languageName: string, t: Translations): string {
  const normalized = languageName.toLowerCase();
  const mapping: Record<string, keyof Translations["languageNames"]> = {
    french: "french",
    english: "english",
    spanish: "spanish",
    italian: "italian",
    arabic: "arabic",
  };

  const key = mapping[normalized];
  if (key && t.languageNames[key]) {
    return t.languageNames[key];
  }

  // Return original if no translation found
  return languageName;
}
