import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ThemeSwitcher } from "./ThemeSwitcher";

// Mock the theme context
const mockSetTheme = vi.fn();
vi.mock("@/contexts/ThemeContext", () => ({
  useTheme: () => ({
    theme: "system",
    setTheme: mockSetTheme,
    resolvedTheme: "light",
  }),
}));

// Mock the translation hook
vi.mock("@/localization/useTranslation", () => ({
  useTranslation: () => ({
    t: {
      themeSwitcher: {
        label: "Theme",
        light: "Light",
        dark: "Dark",
        system: "System",
      },
    },
  }),
}));

describe("ThemeSwitcher", () => {
  it("should render the theme switcher button", () => {
    render(<ThemeSwitcher />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should render button with icon", () => {
    render(<ThemeSwitcher />);
    const button = screen.getByRole("button");
    // Button should have an SVG icon
    expect(button.querySelector("svg")).toBeInTheDocument();
  });
});
