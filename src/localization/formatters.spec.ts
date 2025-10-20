import { describe, expect, it } from "vitest";
import { en } from "./en";
import {
  formatCost,
  formatDateRange,
  formatLanguage,
  formatTime,
} from "./formatters";
import { fr } from "./fr";

describe("formatters", () => {
  describe("formatTime", () => {
    it("should keep 12-hour format for English", () => {
      expect(formatTime("8:00 AM - 5:00 PM", "en")).toBe("8:00 AM - 5:00 PM");
      expect(formatTime("9:00 AM - 4:00 PM", "en")).toBe("9:00 AM - 4:00 PM");
    });

    it("should convert to 24-hour format for French", () => {
      expect(formatTime("8:00 AM - 5:00 PM", "fr")).toBe("8h00 - 17h00");
      expect(formatTime("9:00 AM - 4:00 PM", "fr")).toBe("9h00 - 16h00");
      expect(formatTime("7:30 AM - 5:30 PM", "fr")).toBe("7h30 - 17h30");
    });

    it("should handle noon and midnight correctly", () => {
      expect(formatTime("12:00 PM - 5:00 PM", "fr")).toBe("12h00 - 17h00");
      expect(formatTime("12:00 AM - 5:00 AM", "fr")).toBe("0h00 - 5h00");
    });

    it("should handle afternoon times correctly", () => {
      expect(formatTime("1:00 PM - 6:00 PM", "fr")).toBe("13h00 - 18h00");
      expect(formatTime("8:30 AM - 4:30 PM", "fr")).toBe("8h30 - 16h30");
    });

    it("should handle empty or undefined input", () => {
      expect(formatTime("", "en")).toBe("");
      expect(formatTime("", "fr")).toBe("");
    });
  });

  describe("formatDateRange", () => {
    it("should keep English format for English locale", () => {
      const result = formatDateRange("June 24 - August 23, 2024", "en", en);
      expect(result).toBe("June 24 - August 23, 2024");
    });

    it("should convert to French format for French locale", () => {
      const result = formatDateRange("June 24 - August 23, 2024", "fr", fr);
      expect(result).toBe("24 juin - 23 août 2024");
    });

    it("should handle single month date ranges", () => {
      const result = formatDateRange("March 4-8, 2024", "fr", fr);
      expect(result).toBe("4-8 mars 2024");
    });

    it("should handle single month date ranges in English", () => {
      const result = formatDateRange("March 4-8, 2024", "en", en);
      expect(result).toBe("March 4-8, 2024");
    });

    it("should handle parenthetical descriptions", () => {
      const result = formatDateRange(
        "March 4-8, 2024 (Spring Break)",
        "fr",
        fr
      );
      expect(result).toBe("4-8 mars 2024 (Spring Break)");
    });

    it("should handle date ranges with hyphen separator", () => {
      const result = formatDateRange("July 1 - August 20, 2024", "fr", fr);
      expect(result).toBe("1 juillet - 20 août 2024");
    });

    it("should handle various months", () => {
      expect(formatDateRange("December 23-30, 2024", "fr", fr)).toBe(
        "23-30 décembre 2024"
      );
      expect(formatDateRange("January 5 - February 15, 2025", "fr", fr)).toBe(
        "5 janvier - 15 février 2025"
      );
    });

    it("should handle empty or undefined input", () => {
      expect(formatDateRange("", "en", en)).toBe("");
      expect(formatDateRange("", "fr", fr)).toBe("");
    });

    it("should return original if pattern doesn't match", () => {
      const invalidDate = "Some random text";
      expect(formatDateRange(invalidDate, "fr", fr)).toBe(invalidDate);
    });
  });

  describe("formatCost", () => {
    it("should keep English cost units for English", () => {
      expect(formatCost("$180/week", "en", en)).toBe("$180/week");
      expect(formatCost("$150/day", "en", en)).toBe("$150/day");
    });

    it("should translate cost units to French", () => {
      expect(formatCost("$180/week", "fr", fr)).toBe("$180/semaine");
      expect(formatCost("$150/day", "fr", fr)).toBe("$150/jour");
      expect(formatCost("$500/month", "fr", fr)).toBe("$500/mois");
    });

    it("should handle different case variations", () => {
      expect(formatCost("$180/Week", "fr", fr)).toBe("$180/semaine");
      expect(formatCost("$150/DAY", "fr", fr)).toBe("$150/jour");
    });

    it("should handle costs without units", () => {
      expect(formatCost("$180", "fr", fr)).toBe("$180");
      expect(formatCost("Free", "fr", fr)).toBe("Free");
    });

    it("should handle empty or undefined input", () => {
      expect(formatCost("", "en", en)).toBe("");
      expect(formatCost("", "fr", fr)).toBe("");
    });
  });

  describe("formatLanguage", () => {
    it("should keep English language names for English", () => {
      expect(formatLanguage("French", en)).toBe("French");
      expect(formatLanguage("English", en)).toBe("English");
      expect(formatLanguage("Spanish", en)).toBe("Spanish");
      expect(formatLanguage("Italian", en)).toBe("Italian");
      expect(formatLanguage("Arabic", en)).toBe("Arabic");
    });

    it("should translate language names to French", () => {
      expect(formatLanguage("French", fr)).toBe("Français");
      expect(formatLanguage("English", fr)).toBe("Anglais");
      expect(formatLanguage("Spanish", fr)).toBe("Espagnol");
      expect(formatLanguage("Italian", fr)).toBe("Italien");
      expect(formatLanguage("Arabic", fr)).toBe("Arabe");
    });

    it("should handle case-insensitive language names", () => {
      expect(formatLanguage("french", fr)).toBe("Français");
      expect(formatLanguage("ENGLISH", fr)).toBe("Anglais");
      expect(formatLanguage("SpAnIsH", fr)).toBe("Espagnol");
    });

    it("should return original if language not found", () => {
      expect(formatLanguage("Mandarin", fr)).toBe("Mandarin");
      expect(formatLanguage("Unknown", en)).toBe("Unknown");
    });

    it("should handle empty input", () => {
      expect(formatLanguage("", en)).toBe("");
      expect(formatLanguage("", fr)).toBe("");
    });
  });
});
