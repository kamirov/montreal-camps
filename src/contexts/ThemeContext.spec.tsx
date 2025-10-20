import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider, useTheme } from "./ThemeContext";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock matchMedia
const createMatchMediaMock = (matches: boolean) => {
  return (query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
};

// Test component that uses the theme hook
function TestComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <div data-testid="resolved-theme">{resolvedTheme}</div>
      <button onClick={() => setTheme("light")}>Light</button>
      <button onClick={() => setTheme("dark")}>Dark</button>
      <button onClick={() => setTheme("system")}>System</button>
    </div>
  );
}

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorageMock.clear();
    document.documentElement.className = "";
  });

  it("should throw error when useTheme is used outside ThemeProvider", () => {
    // Suppress console errors for this test
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      "useTheme must be used within a ThemeProvider"
    );

    consoleError.mockRestore();
  });

  it("should initialize with system theme by default", () => {
    window.matchMedia = createMatchMediaMock(false);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("system");
  });

  it("should load theme from localStorage", async () => {
    localStorageMock.setItem("theme", "dark");
    window.matchMedia = createMatchMediaMock(false);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    });
  });

  it("should save theme to localStorage when changed", async () => {
    window.matchMedia = createMatchMediaMock(false);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const lightButton = screen.getByText("Light");
    act(() => {
      lightButton.click();
    });

    await waitFor(() => {
      expect(localStorageMock.getItem("theme")).toBe("light");
    });
  });

  it("should apply light theme to document element", async () => {
    window.matchMedia = createMatchMediaMock(false);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const lightButton = screen.getByText("Light");
    act(() => {
      lightButton.click();
    });

    await waitFor(() => {
      expect(document.documentElement.classList.contains("light")).toBe(true);
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });
  });

  it("should apply dark theme to document element", async () => {
    window.matchMedia = createMatchMediaMock(false);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const darkButton = screen.getByText("Dark");
    act(() => {
      darkButton.click();
    });

    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(document.documentElement.classList.contains("light")).toBe(false);
    });
  });

  it("should respect system preference when theme is system", async () => {
    window.matchMedia = createMatchMediaMock(true);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const systemButton = screen.getByText("System");
    act(() => {
      systemButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId("resolved-theme")).toHaveTextContent("dark");
    });
  });

  it("should set resolvedTheme to light when system preference is light", async () => {
    window.matchMedia = createMatchMediaMock(false);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const systemButton = screen.getByText("System");
    act(() => {
      systemButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId("resolved-theme")).toHaveTextContent("light");
    });
  });

  it("should ignore invalid localStorage values", async () => {
    localStorageMock.setItem("theme", "invalid");
    window.matchMedia = createMatchMediaMock(false);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("theme")).toHaveTextContent("system");
    });
  });
});
