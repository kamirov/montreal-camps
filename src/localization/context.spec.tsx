import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { LocalizationProvider, useLocalization } from "./context";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("LocalizationContext", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("should default to French language", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LocalizationProvider>{children}</LocalizationProvider>
    );

    const { result } = renderHook(() => useLocalization(), { wrapper });

    expect(result.current.language).toBe("fr");
  });

  it("should change language", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LocalizationProvider>{children}</LocalizationProvider>
    );

    const { result } = renderHook(() => useLocalization(), { wrapper });

    act(() => {
      result.current.setLanguage("en");
    });

    expect(result.current.language).toBe("en");
  });

  it("should throw error when used outside provider", () => {
    expect(() => {
      renderHook(() => useLocalization());
    }).toThrow("useLocalization must be used within a LocalizationProvider");
  });
});
