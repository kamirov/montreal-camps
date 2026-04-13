import type { CampUpsert } from "@/lib/validations/camp";

export type ManageAgeRangeDraft =
  | { type: "all"; allAges: true }
  | { type: "range"; allAges: false; from: string; to: string };

export type ManageCampFormData = Omit<CampUpsert, "ageRange"> & {
  ageRange: ManageAgeRangeDraft;
};

export type ManageAgeRangeErrorCode =
  | "required"
  | "integer"
  | "positive"
  | "order";

export const DEFAULT_MANAGE_AGE_RANGE: Extract<
  ManageAgeRangeDraft,
  { type: "range" }
> = {
  type: "range",
  allAges: false,
  from: "5",
  to: "12",
};

export function toManageAgeRangeDraft(
  ageRange: CampUpsert["ageRange"]
): ManageAgeRangeDraft {
  if (ageRange.type === "all") {
    return ageRange;
  }

  return {
    type: "range",
    allAges: false,
    from: ageRange.from.toString(),
    to: ageRange.to.toString(),
  };
}

export function normalizeManageAgeRange(
  ageRange: ManageAgeRangeDraft
):
  | { success: true; data: CampUpsert["ageRange"] }
  | { success: false; error: ManageAgeRangeErrorCode } {
  if (ageRange.type === "all") {
    return { success: true, data: ageRange };
  }

  const fromValue = ageRange.from.trim();
  const toValue = ageRange.to.trim();

  if (!fromValue || !toValue) {
    return { success: false, error: "required" };
  }

  if (!/^\d+$/.test(fromValue) || !/^\d+$/.test(toValue)) {
    return { success: false, error: "integer" };
  }

  const from = Number.parseInt(fromValue, 10);
  const to = Number.parseInt(toValue, 10);

  if (from < 1 || to < 1) {
    return { success: false, error: "positive" };
  }

  if (to < from) {
    return { success: false, error: "order" };
  }

  return {
    success: true,
    data: {
      type: "range",
      allAges: false,
      from,
      to,
    },
  };
}
