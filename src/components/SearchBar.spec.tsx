import { LocalizationProvider } from "@/localization/context";
import { Camp } from "@/types/camp";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { SearchBar } from "./SearchBar";

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
    borough: "Plateau Mont-Royal",
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
      fromDate: "2026-07-01",
      toDate: "2026-07-30",
    },
    financialAid: "Available",
    link: "https://example.com/camp-alpha",
    phone: {
      number: "514-555-0101",
    },
    email: "alpha@example.com",
    address: "123 Main St, Montreal, QC",
    latitude: 45.5,
    longitude: -73.6,
    notes: "Great camp with swimming",
  },
  {
    name: "Camp Beta",
    borough: "Rosemont",
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
      fromDate: "2026-08-01",
      toDate: "2026-08-15",
    },
    financialAid: "Not available",
    link: "https://example.com/camp-beta",
    phone: {
      number: "514-555-0102",
    },
    email: "beta@example.com",
    address: "456 Side St, Montreal, QC",
    latitude: 45.4,
    longitude: -73.5,
    notes: "Sports camp",
  },
];

function SearchBarHarness() {
  const [value, setValue] = useState("");

  return (
    <LocalizationProvider>
      <SearchBar
        camps={mockCamps}
        onSelectCamp={vi.fn()}
        onSelectBorough={vi.fn()}
        value={value}
        onValueChange={setValue}
      />
    </LocalizationProvider>
  );
}

describe("SearchBar", () => {
  it("renders the search input", () => {
    render(<SearchBarHarness />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("finds a camp by exact name", async () => {
    render(<SearchBarHarness />);

    const input = screen.getByRole("combobox");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Camp Alpha" } });

    expect(await screen.findByText("Camp Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Camp Beta")).not.toBeInTheDocument();
  });

  it("matches pasted names with extra internal spaces", async () => {
    render(<SearchBarHarness />);

    const input = screen.getByRole("combobox");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Camp  Alpha" } });

    expect(await screen.findByText("Camp Alpha")).toBeInTheDocument();
  });

  it("recovers results immediately after removing an accidental space", async () => {
    render(<SearchBarHarness />);

    const input = screen.getByRole("combobox");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "CampAlpha" } });

    await waitFor(() => {
      expect(screen.queryByText("Camp Alpha")).not.toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: "Camp Alpha" } });

    expect(await screen.findByText("Camp Alpha")).toBeInTheDocument();
  });

  it("finds borough matches using normalized search", async () => {
    render(<SearchBarHarness />);

    const input = screen.getByRole("combobox");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Plateau   Mont-Royal" } });

    const matches = await screen.findAllByText("Plateau Mont-Royal");
    expect(matches.length).toBeGreaterThan(0);
  });
});
