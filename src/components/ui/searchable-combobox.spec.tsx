import { LocalizationProvider } from "@/localization/context";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchableCombobox } from "./searchable-combobox";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

describe("SearchableCombobox", () => {
  const defaultProps = {
    value: "",
    onChange: vi.fn(),
    options: ["Option 1", "Option 2", "Option 3"],
    placeholder: "Select option...",
  };

  const renderComponent = (props = {}) => {
    return render(
      <LocalizationProvider>
        <SearchableCombobox {...defaultProps} {...props} />
      </LocalizationProvider>
    );
  };

  it("renders with placeholder when no value is selected", () => {
    renderComponent();
    const button = screen.getByRole("combobox");
    expect(button).toHaveTextContent("Select option...");
  });

  it("displays the selected value", () => {
    renderComponent({ value: "Option 1" });
    const button = screen.getByRole("combobox");
    expect(button).toHaveTextContent("Option 1");
  });

  it("opens popover when clicked", async () => {
    renderComponent();
    const button = screen.getByRole("combobox");
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Select option...")
      ).toBeInTheDocument();
    });
  });

  it("filters options when typing", async () => {
    renderComponent();
    const button = screen.getByRole("combobox");
    fireEvent.click(button);

    await waitFor(() => {
      const input = screen.getByPlaceholderText("Select option...");
      fireEvent.change(input, { target: { value: "Option 1" } });
    });

    await waitFor(() => {
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.queryByText("Option 2")).not.toBeInTheDocument();
      expect(screen.queryByText("Option 3")).not.toBeInTheDocument();
    });
  });

  it("shows empty message when no matches found", async () => {
    renderComponent();
    const button = screen.getByRole("combobox");
    fireEvent.click(button);

    await waitFor(() => {
      const input = screen.getByPlaceholderText("Select option...");
      fireEvent.change(input, { target: { value: "NonExistent" } });
    });

    await waitFor(() => {
      expect(
        screen.getByText(/No matches found|Aucun résultat trouvé/)
      ).toBeInTheDocument();
    });
  });

  it("calls onChange when an option is selected", async () => {
    const onChange = vi.fn();
    renderComponent({ onChange });
    const button = screen.getByRole("combobox");
    fireEvent.click(button);

    await waitFor(() => {
      const option1 = screen.getByText("Option 1");
      fireEvent.click(option1);
    });

    expect(onChange).toHaveBeenCalledWith("Option 1");
  });

  it("shows create new option when allowCreateNew is true and value doesn't exist", async () => {
    renderComponent({
      allowCreateNew: true,
      options: ["Option 1", "Option 2"],
    });
    const button = screen.getByRole("combobox");
    fireEvent.click(button);

    await waitFor(() => {
      const input = screen.getByPlaceholderText("Select option...");
      fireEvent.change(input, { target: { value: "New Option" } });
    });

    await waitFor(() => {
      expect(screen.getByText(/Create new|Créer nouveau/)).toBeInTheDocument();
      expect(screen.getByText(/"New Option"/)).toBeInTheDocument();
    });
  });

  it("calls onChange when creating new value", async () => {
    const onChange = vi.fn();
    renderComponent({
      onChange,
      allowCreateNew: true,
      options: ["Option 1"],
    });
    const button = screen.getByRole("combobox");
    fireEvent.click(button);

    await waitFor(() => {
      const input = screen.getByPlaceholderText("Select option...");
      fireEvent.change(input, { target: { value: "New Option" } });
    });

    await waitFor(() => {
      const createNew = screen.getByText(/Create new|Créer nouveau/);
      fireEvent.click(createNew);
    });

    expect(onChange).toHaveBeenCalledWith("New Option");
  });

  it("calls onCreateNew callback when creating new value with callback provided", async () => {
    const onChange = vi.fn();
    const onCreateNew = vi.fn();
    renderComponent({
      onChange,
      onCreateNew,
      allowCreateNew: true,
      options: ["Option 1"],
    });
    const button = screen.getByRole("combobox");
    fireEvent.click(button);

    await waitFor(() => {
      const input = screen.getByPlaceholderText("Select option...");
      fireEvent.change(input, { target: { value: "New Option" } });
    });

    await waitFor(() => {
      const createNew = screen.getByText(/Create new|Créer nouveau/);
      fireEvent.click(createNew);
    });

    expect(onCreateNew).toHaveBeenCalledWith("New Option");
    expect(onChange).toHaveBeenCalledWith("New Option");
  });

  it("does not show create new option when value exists in options", async () => {
    renderComponent({
      allowCreateNew: true,
      options: ["Option 1", "Option 2"],
    });
    const button = screen.getByRole("combobox");
    fireEvent.click(button);

    await waitFor(() => {
      const input = screen.getByPlaceholderText("Select option...");
      fireEvent.change(input, { target: { value: "Option 1" } });
    });

    await waitFor(() => {
      expect(
        screen.queryByText(/Create new|Créer nouveau/)
      ).not.toBeInTheDocument();
    });
  });

  it("is disabled when disabled prop is true", () => {
    renderComponent({ disabled: true });
    const button = screen.getByRole("combobox");
    expect(button).toBeDisabled();
  });

  it("displays all options when popover is opened and no search value", async () => {
    renderComponent();
    const button = screen.getByRole("combobox");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
      expect(screen.getByText("Option 3")).toBeInTheDocument();
    });
  });

  it("shows checkmark next to selected option", async () => {
    renderComponent({ value: "Option 2" });
    const button = screen.getByRole("combobox");
    fireEvent.click(button);

    await waitFor(() => {
      const options = screen.getAllByText("Option 2");
      // The option in the dropdown list (not the button)
      const option2 = options.find(
        (el) => el.getAttribute("role") === "option"
      );
      expect(option2).toBeInTheDocument();
      if (option2) {
        const checkIcon = option2.querySelector('svg[class*="check"]');
        expect(checkIcon).toBeInTheDocument();
        expect(checkIcon).toHaveClass("opacity-100");
      }
    });
  });

  it("uses custom empty message when provided", async () => {
    renderComponent({ emptyMessage: "Custom empty message" });
    const button = screen.getByRole("combobox");
    fireEvent.click(button);

    await waitFor(() => {
      const input = screen.getByPlaceholderText("Select option...");
      fireEvent.change(input, { target: { value: "NonExistent" } });
    });

    await waitFor(() => {
      expect(screen.getByText("Custom empty message")).toBeInTheDocument();
    });
  });
});
