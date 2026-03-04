import type { CampUpsert } from "@/lib/validations/camp";

export const MANAGE_DEFAULT_FINANCIAL_AID = "NA";

export function getManageDefaultDates(): CampUpsert["dates"] {
  return { type: "yearRound", yearRound: true };
}

export function withManageDefaults(campData: CampUpsert): CampUpsert {
  return {
    ...campData,
    dates: getManageDefaultDates(),
    financialAid: MANAGE_DEFAULT_FINANCIAL_AID,
  };
}
