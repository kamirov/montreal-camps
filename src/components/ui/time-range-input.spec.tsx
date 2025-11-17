import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TimeRangeInput } from "./time-range-input";

describe("TimeRangeInput", () => {
  it("renders with default values when no value is provided", () => {
    const onChange = vi.fn();
    render(<TimeRangeInput value="" onChange={onChange} />);

    const inputs = screen.getAllByRole("spinbutton");
    expect(inputs).toHaveLength(4);
  });

  it("parses and displays time range correctly", () => {
    const onChange = vi.fn();
    render(<TimeRangeInput value="09:30 - 17:45" onChange={onChange} />);

    const inputs = screen.getAllByRole("spinbutton") as HTMLInputElement[];
    expect(inputs[0].value).toBe("9");
    expect(inputs[1].value).toBe("30");
    expect(inputs[2].value).toBe("17");
    expect(inputs[3].value).toBe("45");
  });

  it("calls onChange when from hours are modified", () => {
    const onChange = vi.fn();
    render(<TimeRangeInput value="09:00 - 17:00" onChange={onChange} />);

    const inputs = screen.getAllByRole("spinbutton");
    fireEvent.change(inputs[0], { target: { value: "10" } });

    expect(onChange).toHaveBeenCalledWith("10:00 - 17:00");
  });

  it("calls onChange when from minutes are modified", () => {
    const onChange = vi.fn();
    render(<TimeRangeInput value="09:00 - 17:00" onChange={onChange} />);

    const inputs = screen.getAllByRole("spinbutton");
    fireEvent.change(inputs[1], { target: { value: "30" } });

    expect(onChange).toHaveBeenCalledWith("09:30 - 17:00");
  });

  it("calls onChange when to hours are modified", () => {
    const onChange = vi.fn();
    render(<TimeRangeInput value="09:00 - 17:00" onChange={onChange} />);

    const inputs = screen.getAllByRole("spinbutton");
    fireEvent.change(inputs[2], { target: { value: "18" } });

    expect(onChange).toHaveBeenCalledWith("09:00 - 18:00");
  });

  it("calls onChange when to minutes are modified", () => {
    const onChange = vi.fn();
    render(<TimeRangeInput value="09:00 - 17:00" onChange={onChange} />);

    const inputs = screen.getAllByRole("spinbutton");
    fireEvent.change(inputs[3], { target: { value: "45" } });

    expect(onChange).toHaveBeenCalledWith("09:00 - 17:45");
  });

  it("displays separators correctly", () => {
    const onChange = vi.fn();
    const { container } = render(
      <TimeRangeInput value="09:00 - 17:00" onChange={onChange} />
    );

    const separators = container.querySelectorAll(".text-muted-foreground");
    expect(separators).toHaveLength(3); // 2 "h" labels and 1 "-"
  });

  it("respects disabled prop", () => {
    const onChange = vi.fn();
    render(<TimeRangeInput value="09:00 - 17:00" onChange={onChange} disabled />);

    const inputs = screen.getAllByRole("spinbutton") as HTMLInputElement[];
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it("respects required prop", () => {
    const onChange = vi.fn();
    render(<TimeRangeInput value="09:00 - 17:00" onChange={onChange} required />);

    const inputs = screen.getAllByRole("spinbutton") as HTMLInputElement[];
    inputs.forEach((input) => {
      expect(input).toBeRequired();
    });
  });

  it("handles empty string value", () => {
    const onChange = vi.fn();
    render(<TimeRangeInput value="" onChange={onChange} />);

    const inputs = screen.getAllByRole("spinbutton") as HTMLInputElement[];
    expect(inputs[0].value).toBe("9");
    expect(inputs[1].value).toBe("0");
    expect(inputs[2].value).toBe("17");
    expect(inputs[3].value).toBe("0");
  });

  it("formats time values with leading zeros in output", () => {
    const onChange = vi.fn();
    render(<TimeRangeInput value="09:00 - 17:00" onChange={onChange} />);

    const inputs = screen.getAllByRole("spinbutton");
    fireEvent.change(inputs[0], { target: { value: "5" } });

    expect(onChange).toHaveBeenCalledWith("05:00 - 17:00");
  });
});





