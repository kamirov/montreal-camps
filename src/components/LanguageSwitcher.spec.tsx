import { LocalizationProvider } from "@/localization/context";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LanguageSwitcher } from "./LanguageSwitcher";

describe("LanguageSwitcher", () => {
  it("should render language switcher button", () => {
    render(
      <LocalizationProvider>
        <LanguageSwitcher />
      </LocalizationProvider>
    );

    // Should render a button
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    // Button should have some content
    expect(button.textContent).toBeTruthy();
  });
});
