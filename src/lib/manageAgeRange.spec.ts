import {
  normalizeManageAgeRange,
  toManageAgeRangeDraft,
} from "@/lib/manageAgeRange";
import { describe, expect, it } from "vitest";

describe("toManageAgeRangeDraft", () => {
  it("converts numeric ranges to string draft values", () => {
    expect(
      toManageAgeRangeDraft({
        type: "range",
        allAges: false,
        from: 5,
        to: 12,
      })
    ).toEqual({
      type: "range",
      allAges: false,
      from: "5",
      to: "12",
    });
  });
});

describe("normalizeManageAgeRange", () => {
  it("passes through all ages", () => {
    expect(
      normalizeManageAgeRange({
        type: "all",
        allAges: true,
      })
    ).toEqual({
      success: true,
      data: {
        type: "all",
        allAges: true,
      },
    });
  });

  it("converts valid integer strings to numbers", () => {
    expect(
      normalizeManageAgeRange({
        type: "range",
        allAges: false,
        from: "5",
        to: "12",
      })
    ).toEqual({
      success: true,
      data: {
        type: "range",
        allAges: false,
        from: 5,
        to: 12,
      },
    });
  });

  it("ignores surrounding whitespace", () => {
    expect(
      normalizeManageAgeRange({
        type: "range",
        allAges: false,
        from: " 5 ",
        to: " 5 ",
      })
    ).toEqual({
      success: true,
      data: {
        type: "range",
        allAges: false,
        from: 5,
        to: 5,
      },
    });
  });

  it("rejects empty values", () => {
    expect(
      normalizeManageAgeRange({
        type: "range",
        allAges: false,
        from: "",
        to: "5",
      })
    ).toEqual({
      success: false,
      error: "required",
    });
  });

  it("rejects non-integer values", () => {
    expect(
      normalizeManageAgeRange({
        type: "range",
        allAges: false,
        from: "5.5",
        to: "abc",
      })
    ).toEqual({
      success: false,
      error: "integer",
    });
  });

  it("rejects non-positive values", () => {
    expect(
      normalizeManageAgeRange({
        type: "range",
        allAges: false,
        from: "0",
        to: "5",
      })
    ).toEqual({
      success: false,
      error: "positive",
    });
  });

  it("rejects ranges where to is less than from", () => {
    expect(
      normalizeManageAgeRange({
        type: "range",
        allAges: false,
        from: "10",
        to: "5",
      })
    ).toEqual({
      success: false,
      error: "order",
    });
  });
});
