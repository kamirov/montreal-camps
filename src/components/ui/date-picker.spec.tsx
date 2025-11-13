import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DatePicker, DateRangePicker } from "./date-picker";

describe("DatePicker", () => {
  it("renders with initial value", () => {
    const onChange = vi.fn();
    render(<DatePicker value="2024-01-15" onChange={onChange} />);

    const input = screen.getByDisplayValue("2024-01-15");
    expect(input).toBeInTheDocument();
  });

  it("calls onChange when date is selected", () => {
    const onChange = vi.fn();
    render(<DatePicker value="2024-01-15" onChange={onChange} />);

    const input = screen.getByDisplayValue("2024-01-15");
    fireEvent.change(input, { target: { value: "2024-02-20" } });

    expect(onChange).toHaveBeenCalledWith("2024-02-20");
  });

  it("respects disabled prop", () => {
    const onChange = vi.fn();
    render(<DatePicker value="2024-01-15" onChange={onChange} disabled />);

    const input = screen.getByDisplayValue("2024-01-15") as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  it("respects required prop", () => {
    const onChange = vi.fn();
    render(<DatePicker value="2024-01-15" onChange={onChange} required />);

    const input = screen.getByDisplayValue("2024-01-15") as HTMLInputElement;
    expect(input).toBeRequired();
  });

  it("displays label when provided", () => {
    const onChange = vi.fn();
    render(<DatePicker value="2024-01-15" onChange={onChange} label="Start Date" />);

    expect(screen.getByText("Start Date")).toBeInTheDocument();
  });
});

describe("DateRangePicker", () => {
  it("renders with initial from and to dates", () => {
    const onFromDateChange = vi.fn();
    const onToDateChange = vi.fn();
    const { container } = render(
      <DateRangePicker
        fromDate="2024-01-01"
        toDate="2024-12-31"
        onFromDateChange={onFromDateChange}
        onToDateChange={onToDateChange}
      />
    );

    const inputs = container.querySelectorAll('input[type="date"]') as NodeListOf<HTMLInputElement>;
    expect(inputs[0].value).toBe("2024-01-01");
    expect(inputs[1].value).toBe("2024-12-31");
  });

  it("displays dash separator between dates", () => {
    const onFromDateChange = vi.fn();
    const onToDateChange = vi.fn();
    const { container } = render(
      <DateRangePicker
        fromDate="2024-01-01"
        toDate="2024-12-31"
        onFromDateChange={onFromDateChange}
        onToDateChange={onToDateChange}
      />
    );

    const separator = container.querySelector(".text-muted-foreground");
    expect(separator?.textContent).toBe("-");
  });

  it("calls onFromDateChange when from date is changed", () => {
    const onFromDateChange = vi.fn();
    const onToDateChange = vi.fn();
    const { container } = render(
      <DateRangePicker
        fromDate="2024-01-01"
        toDate="2024-12-31"
        onFromDateChange={onFromDateChange}
        onToDateChange={onToDateChange}
      />
    );

    const inputs = container.querySelectorAll('input[type="date"]');
    fireEvent.change(inputs[0], { target: { value: "2024-02-01" } });

    expect(onFromDateChange).toHaveBeenCalledWith("2024-02-01");
  });

  it("calls onToDateChange when to date is changed", () => {
    const onFromDateChange = vi.fn();
    const onToDateChange = vi.fn();
    const { container } = render(
      <DateRangePicker
        fromDate="2024-01-01"
        toDate="2024-12-31"
        onFromDateChange={onFromDateChange}
        onToDateChange={onToDateChange}
      />
    );

    const inputs = container.querySelectorAll('input[type="date"]');
    fireEvent.change(inputs[1], { target: { value: "2024-11-30" } });

    expect(onToDateChange).toHaveBeenCalledWith("2024-11-30");
  });

  it("respects disabled prop", () => {
    const onFromDateChange = vi.fn();
    const onToDateChange = vi.fn();
    const { container } = render(
      <DateRangePicker
        fromDate="2024-01-01"
        toDate="2024-12-31"
        onFromDateChange={onFromDateChange}
        onToDateChange={onToDateChange}
        disabled
      />
    );

    const inputs = container.querySelectorAll('input[type="date"]') as NodeListOf<HTMLInputElement>;
    expect(inputs[0]).toBeDisabled();
    expect(inputs[1]).toBeDisabled();
  });

  it("respects required prop", () => {
    const onFromDateChange = vi.fn();
    const onToDateChange = vi.fn();
    const { container } = render(
      <DateRangePicker
        fromDate="2024-01-01"
        toDate="2024-12-31"
        onFromDateChange={onFromDateChange}
        onToDateChange={onToDateChange}
        required
      />
    );

    const inputs = container.querySelectorAll('input[type="date"]') as NodeListOf<HTMLInputElement>;
    expect(inputs[0]).toBeRequired();
    expect(inputs[1]).toBeRequired();
  });

  it("does not display individual date labels", () => {
    const onFromDateChange = vi.fn();
    const onToDateChange = vi.fn();
    render(
      <DateRangePicker
        fromDate="2024-01-01"
        toDate="2024-12-31"
        onFromDateChange={onFromDateChange}
        onToDateChange={onToDateChange}
        labels={{ from: "From", to: "To" }}
      />
    );

    // Labels should not be rendered even if provided
    expect(screen.queryByText("From")).not.toBeInTheDocument();
    expect(screen.queryByText("To")).not.toBeInTheDocument();
  });
});

