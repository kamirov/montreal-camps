import { LocalizationProvider } from "@/localization/context";
import { Camp } from "@/types/camp";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchBar } from "./SearchBar";

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
});
