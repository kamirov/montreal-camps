import { LocalizationProvider } from "@/localization/context";
import { Camp } from "@/types/camp";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CampDetailDialog } from "./CampDetailDialog";

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
  notes: "Great camp with lots of activities",
  coordinates: [45.5, -73.6],
};

describe("CampDetailDialog", () => {
  it("should not render when camp is null", () => {
    const onOpenChange = vi.fn();

    const { container } = render(
      <LocalizationProvider>
        <CampDetailDialog
          camp={null}
          open={false}
          onOpenChange={onOpenChange}
        />
      </LocalizationProvider>
    );

    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });

  it("should render camp details when open", () => {
    const onOpenChange = vi.fn();

    render(
      <LocalizationProvider>
        <CampDetailDialog
          camp={mockCamp}
          open={true}
          onOpenChange={onOpenChange}
        />
      </LocalizationProvider>
    );

    expect(screen.getByText("Test Camp")).toBeInTheDocument();
    expect(screen.getByText("Plateau")).toBeInTheDocument();
    expect(screen.getByText("5-10 years")).toBeInTheDocument();
    expect(screen.getByText(/\$200\/semaine|\$200\/week/)).toBeInTheDocument();
  });

  it("should display camp notes", () => {
    const onOpenChange = vi.fn();

    render(
      <LocalizationProvider>
        <CampDetailDialog
          camp={mockCamp}
          open={true}
          onOpenChange={onOpenChange}
        />
      </LocalizationProvider>
    );

    expect(
      screen.getByText("Great camp with lots of activities")
    ).toBeInTheDocument();
  });

  it("should have action buttons", () => {
    const onOpenChange = vi.fn();

    render(
      <LocalizationProvider>
        <CampDetailDialog
          camp={mockCamp}
          open={true}
          onOpenChange={onOpenChange}
        />
      </LocalizationProvider>
    );

    // Check for action buttons
    expect(screen.getByText(/Call|Appeler/)).toBeInTheDocument();
    expect(
      screen.getByText(/Visit Website|Visiter le site/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Get Directions|Obtenir/)).toBeInTheDocument();
  });
});
