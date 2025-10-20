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
  id: "1",
  type: "day",
  name: "Test Camp",
  borough: "Plateau",
  ageRange: "5-10 years",
  languages: ["English", "French"],
  dates: "July 1-30, 2024",
  hours: "9:00 AM - 5:00 PM",
  cost: "$200/week",
  financialAid: "Available - Sliding scale",
  link: "https://example.com",
  phone: "514-555-0101",
  notes: "Great camp",
  coordinates: [45.5, -73.6],
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
    expect(screen.getByText("5-10 years")).toBeInTheDocument();
    expect(screen.getByText(/\$200\/semaine|\$200\/week/)).toBeInTheDocument();
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
