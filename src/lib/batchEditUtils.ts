import type { Camp } from "@/lib/validations/camp";

// Format age range to string: "5-12" or "all"
export function formatAgeRange(
  ageRange: Camp["ageRange"]
): string {
  if (ageRange.type === "all") {
    return "all";
  }
  return `${ageRange.from}-${ageRange.to}`;
}

// Parse age range from string: "5-12" or "all"
export function parseAgeRange(
  str: string
): { type: "all"; allAges: true } | { type: "range"; allAges: false; from: number; to: number } | null {
  const trimmed = str.trim().toLowerCase();
  if (trimmed === "all") {
    return { type: "all", allAges: true };
  }
  const match = trimmed.match(/^(\d+)-(\d+)$/);
  if (match) {
    const from = parseInt(match[1]!, 10);
    const to = parseInt(match[2]!, 10);
    if (!isNaN(from) && !isNaN(to) && from > 0 && to > 0 && to >= from) {
      return { type: "range", allAges: false, from, to };
    }
  }
  return null;
}

// Format dates to string: "2024-01-01 to 2024-12-31" or "year-round"
export function formatDates(dates: Camp["dates"]): string {
  if (dates.type === "yearRound") {
    return "year-round";
  }
  return `${dates.fromDate} to ${dates.toDate}`;
}

// Parse dates from string: "2024-01-01 to 2024-12-31" or "year-round"
export function parseDates(
  str: string
):
  | { type: "yearRound"; yearRound: true }
  | { type: "range"; yearRound: false; fromDate: string; toDate: string }
  | null {
  const trimmed = str.trim().toLowerCase();
  if (trimmed === "year-round" || trimmed === "yearround") {
    return { type: "yearRound", yearRound: true };
  }
  const match = trimmed.match(/^(\d{4}-\d{2}-\d{2})\s+to\s+(\d{4}-\d{2}-\d{2})$/);
  if (match) {
    const fromDate = match[1]!;
    const toDate = match[2]!;
    const from = new Date(fromDate);
    const to = new Date(toDate);
    if (!isNaN(from.getTime()) && !isNaN(to.getTime()) && to >= from) {
      return { type: "range", yearRound: false, fromDate, toDate };
    }
  }
  return null;
}

// Format languages array to comma-separated string: "English, French"
export function formatLanguages(languages: string[]): string {
  return languages.join(", ");
}

// Parse languages from comma-separated string
export function parseLanguages(str: string): string[] {
  return str
    .split(",")
    .map((lang) => lang.trim())
    .filter((lang) => lang.length > 0);
}

// Format cost to string: "100/week"
export function formatCost(cost: Camp["cost"]): string {
  return `${cost.amount}/${cost.period}`;
}

// Parse cost from string: "100/week"
export function parseCost(
  str: string
): { amount: number; period: "year" | "month" | "week" | "hour" } | null {
  const trimmed = str.trim();
  const match = trimmed.match(/^(\d+(?:\.\d+)?)\/(year|month|week|hour)$/);
  if (match) {
    const amount = parseFloat(match[1]!);
    const period = match[2] as "year" | "month" | "week" | "hour";
    if (!isNaN(amount) && amount > 0) {
      return { amount, period };
    }
  }
  return null;
}

// Format phone to string: "123-456-7890 ext 123" or "123-456-7890"
export function formatPhone(phone: Camp["phone"]): string {
  if (phone.extension && phone.extension.trim().length > 0) {
    return `${phone.number} ext ${phone.extension}`;
  }
  return phone.number;
}

// Parse phone from string: "123-456-7890 ext 123" or "123-456-7890"
export function parsePhone(
  str: string
): { number: string; extension?: string } | null {
  const trimmed = str.trim();
  const extMatch = trimmed.match(/^(.+?)\s+ext\s+(.+)$/i);
  if (extMatch) {
    return {
      number: extMatch[1]!.trim(),
      extension: extMatch[2]!.trim(),
    };
  }
  if (trimmed.length > 0) {
    return { number: trimmed };
  }
  return null;
}

