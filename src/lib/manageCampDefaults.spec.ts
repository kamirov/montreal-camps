import type { CampUpsert } from "@/lib/validations/camp";
import {
  MANAGE_DEFAULT_FINANCIAL_AID,
  withManageDefaults,
} from "@/lib/manageCampDefaults";
import { describe, expect, it } from "vitest";

describe("withManageDefaults", () => {
  it("sets dates to year-round and financial aid to NA", () => {
    const input: CampUpsert = {
      borough: "Verdun",
      ageRange: { type: "all", allAges: true },
      languages: ["English", "French"],
      dates: {
        type: "range",
        yearRound: false,
        fromDate: "2026-07-01",
        toDate: "2026-08-15",
      },
      financialAid: "Sliding scale",
      link: "https://example.com",
      phone: { number: "514-555-0000", extension: "123" },
      email: "test@example.com",
      address: "123 Main St, Montreal",
      notes: "test",
    };

    const result = withManageDefaults(input);

    expect(result.dates).toEqual({ type: "yearRound", yearRound: true });
    expect(result.financialAid).toBe(MANAGE_DEFAULT_FINANCIAL_AID);
    expect(result.borough).toBe(input.borough);
  });
});
