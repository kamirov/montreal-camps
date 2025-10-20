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
    id: "1",
    type: "day",
    name: "Camp Alpha",
    borough: "Plateau",
    ageRange: "5-10 years",
    languages: ["English", "French"],
    dates: "July 1-30, 2024",
    hours: "9:00 AM - 5:00 PM",
    cost: "$200/week",
    financialAid: "Available",
    link: "https://example.com",
    phone: "514-555-0101",
    notes: "Great camp with swimming",
    coordinates: [45.5, -73.6],
  },
  {
    id: "2",
    type: "vacation",
    name: "Camp Beta",
    borough: "Verdun",
    ageRange: "8-12 years",
    languages: ["English"],
    dates: "August 1-15, 2024",
    cost: "$250/week",
    financialAid: "Not available",
    link: "https://example.com",
    phone: "514-555-0102",
    notes: "Sports camp",
    coordinates: [45.4, -73.5],
  },
  {
    id: "3",
    type: "day",
    name: "Camp Gamma",
    borough: "Plateau",
    ageRange: "6-11 years",
    languages: ["French"],
    dates: "July 15-August 15, 2024",
    hours: "8:00 AM - 4:00 PM",
    cost: "$180/week",
    financialAid: "Available",
    link: "https://example.com",
    phone: "514-555-0103",
    notes: "Arts and crafts",
    coordinates: [45.52, -73.58],
  },
];

describe("CampColumns", () => {
  it("should render day and vacation camp columns", () => {
    render(
      <LocalizationProvider>
        <CampColumns camps={mockCamps} />
      </LocalizationProvider>
    );

    // Check for column headers (French is default language)
    const headings = screen.getAllByRole("heading", { level: 2 });
    const headingTexts = headings.map((h) => h.textContent);

    expect(
      headingTexts.includes("Camps de jour") ||
        headingTexts.includes("Day Camps")
    ).toBe(true);
    expect(
      headingTexts.includes("Camps de vacances") ||
        headingTexts.includes("Vacation Camps")
    ).toBe(true);
  });

  it("should display correct camp counts", () => {
    render(
      <LocalizationProvider>
        <CampColumns camps={mockCamps} />
      </LocalizationProvider>
    );

    // 2 day camps, 1 vacation camp
    const dayCampCount = screen.getByText("2 camps");
    const vacationCampCount = screen.getByText("1 camp");

    expect(dayCampCount).toBeInTheDocument();
    expect(vacationCampCount).toBeInTheDocument();
  });

  it("should render camp cards in correct columns", () => {
    render(
      <LocalizationProvider>
        <CampColumns camps={mockCamps} />
      </LocalizationProvider>
    );

    expect(screen.getByText("Camp Alpha")).toBeInTheDocument();
    expect(screen.getByText("Camp Beta")).toBeInTheDocument();
    expect(screen.getByText("Camp Gamma")).toBeInTheDocument();
  });

  it("should show no results message when no camps in a column", () => {
    const onlyDayCamps = mockCamps.filter((camp) => camp.type === "day");

    render(
      <LocalizationProvider>
        <CampColumns camps={onlyDayCamps} />
      </LocalizationProvider>
    );

    // Check for French "no results" message (default language)
    const noResultsMessage =
      screen.queryByText("Aucun camp trouvé correspondant à vos critères") ||
      screen.queryByText("No camps found matching your criteria");

    expect(noResultsMessage).toBeInTheDocument();
  });

  it("should display sample data notice when showSampleNotice is true", () => {
    render(
      <LocalizationProvider>
        <CampColumns camps={mockCamps} showSampleNotice={true} />
      </LocalizationProvider>
    );

    // Check for French sample notice (default language)
    const sampleNotice =
      screen.queryByText(/données d'exemple/i) ||
      screen.queryByText(/sample data/i);

    expect(sampleNotice).toBeInTheDocument();
  });

  it("should not display sample data notice when showSampleNotice is false", () => {
    render(
      <LocalizationProvider>
        <CampColumns camps={mockCamps} showSampleNotice={false} />
      </LocalizationProvider>
    );

    // Check that sample notice is not present
    const sampleNotice =
      screen.queryByText(/données d'exemple/i) ||
      screen.queryByText(/sample data/i);

    expect(sampleNotice).not.toBeInTheDocument();
  });
});
