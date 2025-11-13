import { LocalizationProvider } from "@/localization/context";
import { Camp } from "@/types/camp";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CampDetailDialog } from "./CampDetailDialog";

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
  notes: "Great camp with lots of activities",
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
    // Age range will be formatted as "5 years - 10 years" or "5 ans - 10 ans"
    expect(screen.getByText(/^5.*10.*(years|ans)$/)).toBeInTheDocument();
    expect(screen.getByText(/\$200/)).toBeInTheDocument();
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
