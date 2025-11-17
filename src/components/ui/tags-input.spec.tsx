import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TagsInput } from "./tags-input";

describe("TagsInput", () => {
  it("renders with placeholder when no tags are present", () => {
    const onChange = vi.fn();
    render(
      <TagsInput
        value={[]}
        onChange={onChange}
        suggestions={[]}
        placeholder="Add items..."
      />
    );

    const input = screen.getByPlaceholderText("Add items...");
    expect(input).toBeInTheDocument();
  });

  it("displays existing tags", () => {
    const onChange = vi.fn();
    render(
      <TagsInput
        value={["English", "French"]}
        onChange={onChange}
        suggestions={[]}
      />
    );

    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("French")).toBeInTheDocument();
  });

  it("adds a tag when Enter is pressed", () => {
    const onChange = vi.fn();
    render(
      <TagsInput
        value={[]}
        onChange={onChange}
        suggestions={[]}
        placeholder="Add items..."
      />
    );

    const input = screen.getByPlaceholderText("Add items...");
    fireEvent.change(input, { target: { value: "Spanish" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onChange).toHaveBeenCalledWith(["Spanish"]);
  });

  it("removes a tag when X button is clicked", () => {
    const onChange = vi.fn();
    render(
      <TagsInput
        value={["English", "French"]}
        onChange={onChange}
        suggestions={[]}
      />
    );

    const removeButtons = screen.getAllByRole("button");
    fireEvent.click(removeButtons[0]);

    expect(onChange).toHaveBeenCalledWith(["French"]);
  });

  it("removes last tag when Backspace is pressed on empty input", () => {
    const onChange = vi.fn();
    render(
      <TagsInput
        value={["English", "French"]}
        onChange={onChange}
        suggestions={[]}
        placeholder="Add items..."
      />
    );

    const input = screen.getByPlaceholderText("");
    fireEvent.keyDown(input, { key: "Backspace" });

    expect(onChange).toHaveBeenCalledWith(["English"]);
  });

  it("shows suggestions when typing", async () => {
    const onChange = vi.fn();
    render(
      <TagsInput
        value={[]}
        onChange={onChange}
        suggestions={["English", "French", "Spanish"]}
        placeholder="Add items..."
      />
    );

    const input = screen.getByPlaceholderText("Add items...");
    fireEvent.change(input, { target: { value: "Eng" } });
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText("English")).toBeInTheDocument();
    });
  });

  it("filters out already selected tags from suggestions", async () => {
    const onChange = vi.fn();
    render(
      <TagsInput
        value={["English"]}
        onChange={onChange}
        suggestions={["English", "French", "Spanish"]}
        placeholder="Add items..."
      />
    );

    const input = screen.getByPlaceholderText("");
    fireEvent.change(input, { target: { value: "Eng" } });
    fireEvent.focus(input);

    await waitFor(() => {
      const suggestionElements = screen.queryAllByText("English");
      // One is the badge, should not be in suggestions dropdown
      expect(suggestionElements).toHaveLength(1);
    });
  });

  it("does not add duplicate tags", () => {
    const onChange = vi.fn();
    render(
      <TagsInput
        value={["English"]}
        onChange={onChange}
        suggestions={[]}
        placeholder="Add items..."
      />
    );

    const input = screen.getByPlaceholderText("");
    fireEvent.change(input, { target: { value: "English" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("trims whitespace from new tags", () => {
    const onChange = vi.fn();
    render(
      <TagsInput
        value={[]}
        onChange={onChange}
        suggestions={[]}
        placeholder="Add items..."
      />
    );

    const input = screen.getByPlaceholderText("Add items...");
    fireEvent.change(input, { target: { value: "  Spanish  " } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onChange).toHaveBeenCalledWith(["Spanish"]);
  });

  it("clears input after adding a tag", () => {
    const onChange = vi.fn();
    render(
      <TagsInput
        value={[]}
        onChange={onChange}
        suggestions={[]}
        placeholder="Add items..."
      />
    );

    const input = screen.getByPlaceholderText("Add items...") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Spanish" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(input.value).toBe("");
  });
});





