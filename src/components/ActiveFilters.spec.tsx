import { LocalizationProvider } from "@/localization/context";
import { FilterState } from "@/types/camp";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ActiveFilters } from "./ActiveFilters";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

describe("ActiveFilters", () => {
  it("should not render when no filters are active", () => {
    const onFilterChange = vi.fn();
    const filters: FilterState = {
      searchQuery: "",
      campType: "all",
      boroughs: [],
      selectedLanguages: [],
    };

    const { container } = render(
      <LocalizationProvider>
        <ActiveFilters filters={filters} onFilterChange={onFilterChange} />
      </LocalizationProvider>
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render borough filter badges", () => {
    const onFilterChange = vi.fn();
    const filters: FilterState = {
      searchQuery: "",
      campType: "all",
      boroughs: ["Plateau", "NDG"],
      selectedLanguages: [],
    };

    render(
      <LocalizationProvider>
        <ActiveFilters filters={filters} onFilterChange={onFilterChange} />
      </LocalizationProvider>
    );

    expect(screen.getByText("Plateau")).toBeInTheDocument();
    expect(screen.getByText("NDG")).toBeInTheDocument();
  });

  it("should remove borough when clicking X", () => {
    const onFilterChange = vi.fn();
    const filters: FilterState = {
      searchQuery: "",
      campType: "all",
      boroughs: ["Plateau"],
      selectedLanguages: [],
    };

    render(
      <LocalizationProvider>
        <ActiveFilters filters={filters} onFilterChange={onFilterChange} />
      </LocalizationProvider>
    );

    const badge = screen.getByText("Plateau");
    const xButton = badge.nextSibling as HTMLElement;
    fireEvent.click(xButton);

    expect(onFilterChange).toHaveBeenCalledWith({
      ...filters,
      boroughs: [],
    });
  });

  it("should clear all filters when clear button is clicked", () => {
    const onFilterChange = vi.fn();
    const filters: FilterState = {
      searchQuery: "",
      campType: "day",
      boroughs: ["Plateau"],
      selectedLanguages: ["English"],
    };

    render(
      <LocalizationProvider>
        <ActiveFilters filters={filters} onFilterChange={onFilterChange} />
      </LocalizationProvider>
    );

    const clearButton = screen.getByText(/Clear All|Tout effacer/);
    fireEvent.click(clearButton);

    expect(onFilterChange).toHaveBeenCalledWith({
      searchQuery: "",
      campType: "day",
      boroughs: [],
      selectedLanguages: [],
    });
  });

  it("should remove language when clicking X", () => {
    const onFilterChange = vi.fn();
    const filters: FilterState = {
      searchQuery: "",
      campType: "all",
      boroughs: [],
      selectedLanguages: ["English"],
    };

    render(
      <LocalizationProvider>
        <ActiveFilters filters={filters} onFilterChange={onFilterChange} />
      </LocalizationProvider>
    );

    const badge = screen.getByText("English");
    const xButton = badge.nextSibling as HTMLElement;
    fireEvent.click(xButton);

    expect(onFilterChange).toHaveBeenCalledWith({
      ...filters,
      selectedLanguages: [],
    });
  });
});
