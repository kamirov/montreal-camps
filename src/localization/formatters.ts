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
 * English: "June 24 - August 23, 2024"
 * French: "24 juin - 23 août 2024"
 */
export function formatDateRange(
  dateRange: string,
  language: Language,
  t: Translations
): string {
  if (!dateRange) return dateRange;

  // Handle parenthetical descriptions like "(Spring Break)" first
  const withParens = /^(.*?)(\s*\(.*\))$/;
  const parensMatch = dateRange.match(withParens);
  let parenPart = "";
  let mainDatePart = dateRange;

  if (parensMatch) {
    [, mainDatePart, parenPart] = parensMatch;
  }

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

  // Pattern: "Month Day - Month Day, Year" or "Month Day-Day, Year"
  const pattern1 =
    /([A-Za-z]+)\s+(\d{1,2})\s*-\s*([A-Za-z]+)\s+(\d{1,2}),?\s*(\d{4})/i;
  const pattern2 = /([A-Za-z]+)\s+(\d{1,2})-(\d{1,2}),?\s*(\d{4})/i;
  const pattern3 =
    /([A-Za-z]+)\s+(\d{1,2})-([A-Za-z]+)\s+(\d{1,2}),?\s*(\d{4})/i;

  let match = mainDatePart.match(pattern1);
  if (match) {
    const [, month1, day1, month2, day2, year] = match;
    const monthIndex1 = monthMap[month1.toLowerCase()];
    const monthIndex2 = monthMap[month2.toLowerCase()];

    if (monthIndex1 !== undefined && monthIndex2 !== undefined) {
      if (language === "fr") {
        return `${day1} ${t.months[monthIndex1]} - ${day2} ${t.months[monthIndex2]} ${year}${parenPart}`;
      } else {
        return `${t.months[monthIndex1]} ${day1} - ${t.months[monthIndex2]} ${day2}, ${year}${parenPart}`;
      }
    }
  }

  match = mainDatePart.match(pattern2);
  if (match) {
    const [, month, day1, day2, year] = match;
    const monthIndex = monthMap[month.toLowerCase()];

    if (monthIndex !== undefined) {
      if (language === "fr") {
        return `${day1}-${day2} ${t.months[monthIndex]} ${year}${parenPart}`;
      } else {
        return `${t.months[monthIndex]} ${day1}-${day2}, ${year}${parenPart}`;
      }
    }
  }

  match = mainDatePart.match(pattern3);
  if (match) {
    const [, month1, day1, month2, day2, year] = match;
    const monthIndex1 = monthMap[month1.toLowerCase()];
    const monthIndex2 = monthMap[month2.toLowerCase()];

    if (monthIndex1 !== undefined && monthIndex2 !== undefined) {
      if (language === "fr") {
        return `${day1} ${t.months[monthIndex1]} - ${day2} ${t.months[monthIndex2]} ${year}${parenPart}`;
      } else {
        return `${t.months[monthIndex1]} ${day1} - ${t.months[monthIndex2]} ${day2}, ${year}${parenPart}`;
      }
    }
  }

  // If no pattern matches, return as-is
  return dateRange;
}

/**
 * Formats cost with translated units
 * English: "$180/week"
 * French: "$180/semaine"
 */
export function formatCost(
  cost: string,
  language: Language,
  t: Translations
): string {
  if (!cost) return cost;

  if (language === "en") return cost;

  // Replace cost units with translations
  return cost
    .replace(/\/week/gi, `/${t.costUnits.week}`)
    .replace(/\/day/gi, `/${t.costUnits.day}`)
    .replace(/\/month/gi, `/${t.costUnits.month}`);
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
