import { LocalizationProvider } from "@/localization/context";
import { FilterState } from "@/types/camp";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CampFilters } from "./CampFilters";

const mockFilters: FilterState = {
  searchQuery: "",
  campType: "all",
  boroughs: [],
  selectedLanguages: [],
};

const availableBoroughs = ["Plateau", "NDG", "Rosemont"];
const availableLanguages = ["English", "French", "Spanish"];

describe("CampFilters", () => {
  it("should render filter sections", () => {
    const onFilterChange = vi.fn();

    render(
      <LocalizationProvider>
        <CampFilters
          filters={mockFilters}
          onFilterChange={onFilterChange}
          availableBoroughs={availableBoroughs}
          availableLanguages={availableLanguages}
        />
      </LocalizationProvider>
    );

    expect(screen.getByText(/Filters|Filtres/)).toBeInTheDocument();
  });

  it("should call onFilterChange when borough is selected", () => {
    const onFilterChange = vi.fn();

    render(
      <LocalizationProvider>
        <CampFilters
          filters={mockFilters}
          onFilterChange={onFilterChange}
          availableBoroughs={availableBoroughs}
          availableLanguages={availableLanguages}
        />
      </LocalizationProvider>
    );

    const checkbox = screen.getByLabelText(/Plateau/);
    fireEvent.click(checkbox);

    expect(onFilterChange).toHaveBeenCalledWith({
      ...mockFilters,
      boroughs: ["Plateau"],
    });
  });

  it("should display clear all button when filters are active", () => {
    const onFilterChange = vi.fn();
    const filtersWithActive: FilterState = {
      ...mockFilters,
      boroughs: ["Plateau"],
    };

    render(
      <LocalizationProvider>
        <CampFilters
          filters={filtersWithActive}
          onFilterChange={onFilterChange}
          availableBoroughs={availableBoroughs}
          availableLanguages={availableLanguages}
        />
      </LocalizationProvider>
    );

    expect(screen.getByText(/Clear All|Tout effacer/)).toBeInTheDocument();
  });

  it("should clear all filters when clear button is clicked", () => {
    const onFilterChange = vi.fn();
    const filtersWithActive: FilterState = {
      ...mockFilters,
      boroughs: ["Plateau"],
    };

    render(
      <LocalizationProvider>
        <CampFilters
          filters={filtersWithActive}
          onFilterChange={onFilterChange}
          availableBoroughs={availableBoroughs}
          availableLanguages={availableLanguages}
        />
      </LocalizationProvider>
    );

    const clearButton = screen.getByText(/Clear All|Tout effacer/);
    fireEvent.click(clearButton);

    expect(onFilterChange).toHaveBeenCalledWith({
      searchQuery: "",
      campType: "all",
      boroughs: [],
      selectedLanguages: [],
    });
  });

  it("should toggle language selection", () => {
    const onFilterChange = vi.fn();

    render(
      <LocalizationProvider>
        <CampFilters
          filters={mockFilters}
          onFilterChange={onFilterChange}
          availableBoroughs={availableBoroughs}
          availableLanguages={availableLanguages}
        />
      </LocalizationProvider>
    );

    const checkbox = screen.getByLabelText(/English/);
    fireEvent.click(checkbox);

    expect(onFilterChange).toHaveBeenCalledWith({
      ...mockFilters,
      selectedLanguages: ["English"],
    });
  });
});
