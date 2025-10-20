import { LocalizationProvider } from "@/localization/context";
import { Camp } from "@/types/camp";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CampList } from "./CampList";

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
    notes: "Great camp",
    coordinates: [45.5, -73.6],
  },
  {
    id: "2",
    type: "vacation",
    name: "Camp Beta",
    borough: "NDG",
    ageRange: "8-14 years",
    languages: ["French"],
    dates: "March 1-5, 2024",
    cost: "$150/week",
    financialAid: "Not available",
    link: "https://example.com",
    phone: "514-555-0102",
    notes: "Indoor activities",
    coordinates: [45.4, -73.7],
  },
];

describe("CampList", () => {
  it("should render list of camps", () => {
    const onViewDetails = vi.fn();

    render(
      <LocalizationProvider>
        <CampList camps={mockCamps} onViewDetails={onViewDetails} />
      </LocalizationProvider>
    );

    expect(screen.getByText("Camp Alpha")).toBeInTheDocument();
    expect(screen.getByText("Camp Beta")).toBeInTheDocument();
  });

  it("should display empty state when no camps", () => {
    const onViewDetails = vi.fn();

    render(
      <LocalizationProvider>
        <CampList camps={[]} onViewDetails={onViewDetails} />
      </LocalizationProvider>
    );

    expect(
      screen.getByText(/No camps found|Aucun camp trouvé/)
    ).toBeInTheDocument();
  });
});
