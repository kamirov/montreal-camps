import { LocalizationProvider } from "@/localization/context";
import { Camp } from "@/types/camp";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CampCard } from "./CampCard";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

const mockCamp: Camp = {
  name: "Test Camp",
  type: "day",
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
  hours: "9:00 AM - 5:00 PM",
  cost: {
    amount: 200,
    period: "week",
  },
  financialAid: "Available - Sliding scale",
  link: "https://example.com",
  phone: {
    number: "514-555-0101",
  },
  notes: "Great camp",
};

describe("CampCard", () => {
  it("should render camp information", () => {
    render(
      <LocalizationProvider>
        <CampCard camp={mockCamp} />
      </LocalizationProvider>
    );

    expect(screen.getByText("Test Camp")).toBeInTheDocument();
    expect(screen.getByText("Plateau")).toBeInTheDocument();
    // Age range will be formatted as "5 years - 10 years" or "5 ans - 10 ans"
    expect(screen.getByText(/^5.*10.*(years|ans)$/)).toBeInTheDocument();
    expect(screen.getByText(/\$200/)).toBeInTheDocument();
  });

  it("should display financial aid information", () => {
    render(
      <LocalizationProvider>
        <CampCard camp={mockCamp} />
      </LocalizationProvider>
    );

    expect(screen.getByText("Available - Sliding scale")).toBeInTheDocument();
  });

  it("should display phone number", () => {
    render(
      <LocalizationProvider>
        <CampCard camp={mockCamp} />
      </LocalizationProvider>
    );

    expect(screen.getByText("514-555-0101")).toBeInTheDocument();
  });

  it("should display notes", () => {
    render(
      <LocalizationProvider>
        <CampCard camp={mockCamp} />
      </LocalizationProvider>
    );

    expect(screen.getByText("Great camp")).toBeInTheDocument();
  });

  it("should display action buttons", () => {
    render(
      <LocalizationProvider>
        <CampCard camp={mockCamp} />
      </LocalizationProvider>
    );

    const buttons = screen.getAllByRole("button");
    // Should have 3 action buttons: Call, Visit Website, Get Directions
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });

  it("should display camp type badge", () => {
    const campWithoutHours = { ...mockCamp, hours: undefined };
    render(
      <LocalizationProvider>
        <CampCard camp={campWithoutHours} />
      </LocalizationProvider>
    );

    expect(screen.getByText(/Day Camps|Camps de jour/)).toBeInTheDocument();
  });

  it("should display languages", () => {
    render(
      <LocalizationProvider>
        <CampCard camp={mockCamp} />
      </LocalizationProvider>
    );

    expect(screen.getByText(/English|Anglais/)).toBeInTheDocument();
    expect(screen.getByText(/French|Français/)).toBeInTheDocument();
  });
});
