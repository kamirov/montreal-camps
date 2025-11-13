import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CostInput } from "./cost-input";

describe("CostInput", () => {
  it("renders with initial amount and period", () => {
    const onAmountChange = vi.fn();
    const onPeriodChange = vi.fn();
    render(
      <CostInput
        amount={100}
        period="week"
        onAmountChange={onAmountChange}
        onPeriodChange={onPeriodChange}
      />
    );

    const input = screen.getByDisplayValue("100");
    expect(input).toBeInTheDocument();
  });

  it("displays dollar sign in the input", () => {
    const onAmountChange = vi.fn();
    const onPeriodChange = vi.fn();
    const { container } = render(
      <CostInput
        amount={100}
        period="week"
        onAmountChange={onAmountChange}
        onPeriodChange={onPeriodChange}
      />
    );

    const dollarSign = container.querySelector(".text-muted-foreground");
    expect(dollarSign?.textContent).toContain("$");
  });

  it("displays forward slash separator", () => {
    const onAmountChange = vi.fn();
    const onPeriodChange = vi.fn();
    const { container } = render(
      <CostInput
        amount={100}
        period="week"
        onAmountChange={onAmountChange}
        onPeriodChange={onPeriodChange}
      />
    );

    expect(container.textContent).toContain("/");
  });

  it("calls onAmountChange when amount is modified", () => {
    const onAmountChange = vi.fn();
    const onPeriodChange = vi.fn();
    render(
      <CostInput
        amount={100}
        period="week"
        onAmountChange={onAmountChange}
        onPeriodChange={onPeriodChange}
      />
    );

    const input = screen.getByDisplayValue("100");
    fireEvent.change(input, { target: { value: "150.50" } });

    expect(onAmountChange).toHaveBeenCalledWith(150.5);
  });

  it("filters non-numeric characters from amount input", () => {
    const onAmountChange = vi.fn();
    const onPeriodChange = vi.fn();
    render(
      <CostInput
        amount={0}
        period="week"
        onAmountChange={onAmountChange}
        onPeriodChange={onPeriodChange}
      />
    );

    const input = screen.getByPlaceholderText("0.00");
    fireEvent.change(input, { target: { value: "abc123.45def" } });

    expect(input).toHaveValue("123.45");
  });

  it("calls onPeriodChange when period is selected", () => {
    const onAmountChange = vi.fn();
    const onPeriodChange = vi.fn();
    render(
      <CostInput
        amount={100}
        period="week"
        onAmountChange={onAmountChange}
        onPeriodChange={onPeriodChange}
      />
    );

    const select = screen.getByRole("combobox");
    fireEvent.click(select);

    const monthOption = screen.getByText("month");
    fireEvent.click(monthOption);

    expect(onPeriodChange).toHaveBeenCalledWith("month");
  });

  it("respects disabled prop", () => {
    const onAmountChange = vi.fn();
    const onPeriodChange = vi.fn();
    render(
      <CostInput
        amount={100}
        period="week"
        onAmountChange={onAmountChange}
        onPeriodChange={onPeriodChange}
        disabled
      />
    );

    const input = screen.getByDisplayValue("100");
    const select = screen.getByRole("combobox");

    expect(input).toBeDisabled();
    expect(select).toBeDisabled();
  });

  it("respects required prop", () => {
    const onAmountChange = vi.fn();
    const onPeriodChange = vi.fn();
    render(
      <CostInput
        amount={100}
        period="week"
        onAmountChange={onAmountChange}
        onPeriodChange={onPeriodChange}
        required
      />
    );

    const input = screen.getByDisplayValue("100");
    expect(input).toBeRequired();
  });

  it("handles empty input", () => {
    const onAmountChange = vi.fn();
    const onPeriodChange = vi.fn();
    render(
      <CostInput
        amount={100}
        period="week"
        onAmountChange={onAmountChange}
        onPeriodChange={onPeriodChange}
      />
    );

    const input = screen.getByDisplayValue("100");
    fireEvent.change(input, { target: { value: "" } });

    expect(onAmountChange).toHaveBeenCalledWith(0);
  });

  it("uses custom period labels when provided", () => {
    const onAmountChange = vi.fn();
    const onPeriodChange = vi.fn();
    render(
      <CostInput
        amount={100}
        period="week"
        onAmountChange={onAmountChange}
        onPeriodChange={onPeriodChange}
        periodLabels={{
          year: "année",
          month: "mois",
          week: "semaine",
          hour: "heure",
        }}
      />
    );

    const select = screen.getByRole("combobox");
    fireEvent.click(select);

    const labels = screen.getAllByText("semaine");
    expect(labels.length).toBeGreaterThan(0);
  });
});

