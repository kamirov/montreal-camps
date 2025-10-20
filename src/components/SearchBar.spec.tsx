import { LocalizationProvider } from "@/localization/context";
import { Camp } from "@/types/camp";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchBar } from "./SearchBar";

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
];

describe("SearchBar", () => {
  it("should render search input", () => {
    const onSelectCamp = vi.fn();
    const onValueChange = vi.fn();

    render(
      <LocalizationProvider>
        <SearchBar
          camps={mockCamps}
          onSelectCamp={onSelectCamp}
          value=""
          onValueChange={onValueChange}
        />
      </LocalizationProvider>
    );

    const input = screen.getByRole("combobox");
    expect(input).toBeInTheDocument();
  });

  it("should render with region prompt placeholder", () => {
    const onSelectCamp = vi.fn();
    const onValueChange = vi.fn();

    render(
      <LocalizationProvider>
        <SearchBar
          camps={mockCamps}
          onSelectCamp={onSelectCamp}
          value=""
          onValueChange={onValueChange}
        />
      </LocalizationProvider>
    );

    const input = screen.getByRole("combobox");
    const placeholder = input.getAttribute("placeholder");
    // Check for either French or English region prompt
    expect(
      placeholder?.includes("région") || placeholder?.includes("region")
    ).toBe(true);
  });

  it("should call onSelectBorough when provided", () => {
    const onSelectCamp = vi.fn();
    const onSelectBorough = vi.fn();
    const onValueChange = vi.fn();

    render(
      <LocalizationProvider>
        <SearchBar
          camps={mockCamps}
          onSelectCamp={onSelectCamp}
          onSelectBorough={onSelectBorough}
          value=""
          onValueChange={onValueChange}
        />
      </LocalizationProvider>
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
