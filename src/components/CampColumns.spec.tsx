import { LocalizationProvider } from "@/localization/context";
import { Camp } from "@/types/camp";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CampColumns } from "./CampColumns";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

const mockCamps: Camp[] = [
  {
    name: "Camp Alpha",
    borough: "Plateau",
    ageRange: {
      type: "range",
      allAges: false,
      from: 5,
      to: 10,
    },
    languages: ["English", "French"],
    dates: {
      type: "range",
      yearRound: false,
      fromDate: "2024-07-01",
      toDate: "2024-07-30",
    },
    financialAid: "Available",
    link: "https://example.com",
    phone: {
      number: "514-555-0101",
    },
    notes: "Great camp with swimming",
  },
  {
    name: "Camp Beta",
    borough: null,
    ageRange: {
      type: "range",
      allAges: false,
      from: 8,
      to: 12,
    },
    languages: ["English"],
    dates: {
      type: "range",
      yearRound: false,
      fromDate: "2024-08-01",
      toDate: "2024-08-15",
    },
    financialAid: "Not available",
    link: "https://example.com",
    phone: {
      number: "514-555-0102",
    },
    notes: "Sports camp",
  },
  {
    name: "Camp Gamma",
    borough: "Plateau",
    ageRange: {
      type: "range",
      allAges: false,
      from: 6,
      to: 11,
    },
    languages: ["French"],
    dates: {
      type: "range",
      yearRound: false,
      fromDate: "2024-07-15",
      toDate: "2024-08-15",
    },
    financialAid: "Available",
    link: "https://example.com",
    phone: {
      number: "514-555-0103",
    },
    notes: "Arts and crafts",
  },
];

describe("CampColumns", () => {
  it("should render all camps in a single column", () => {
    render(
      <LocalizationProvider>
        <CampColumns camps={mockCamps} />
      </LocalizationProvider>
    );

    // All camps should be rendered
    expect(screen.getByText("Camp Alpha")).toBeInTheDocument();
    expect(screen.getByText("Camp Beta")).toBeInTheDocument();
    expect(screen.getByText("Camp Gamma")).toBeInTheDocument();
  });

  it("should render camp cards for all camps", () => {
    render(
      <LocalizationProvider>
        <CampColumns camps={mockCamps} />
      </LocalizationProvider>
    );

    expect(screen.getByText("Camp Alpha")).toBeInTheDocument();
    expect(screen.getByText("Camp Beta")).toBeInTheDocument();
    expect(screen.getByText("Camp Gamma")).toBeInTheDocument();
  });

  it("should show no results message when no camps", () => {
    render(
      <LocalizationProvider>
        <CampColumns camps={[]} />
      </LocalizationProvider>
    );

    // Check for "no results" message
    const noResultsMessage = screen.queryByText(
      /Aucun camp trouvé|No camps found/i
    );

    expect(noResultsMessage).toBeInTheDocument();
  });
});
