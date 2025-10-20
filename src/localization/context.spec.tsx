import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
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

// Mock next/navigation
const mockPush = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => "/",
  useSearchParams: () => mockSearchParams,
}));

describe("LocalizationContext", () => {
  beforeEach(() => {
    localStorageMock.clear();
    mockPush.mockClear();
    mockSearchParams.delete("lang");
  });

  it("should default to French language when no URL param or localStorage", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LocalizationProvider>{children}</LocalizationProvider>
    );

    const { result } = renderHook(() => useLocalization(), { wrapper });

    expect(result.current.language).toBe("fr");
  });

  it("should use URL param when present", () => {
    mockSearchParams.set("lang", "en");

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LocalizationProvider>{children}</LocalizationProvider>
    );

    const { result } = renderHook(() => useLocalization(), { wrapper });

    expect(result.current.language).toBe("en");
    expect(localStorageMock.getItem("language")).toBe("en");
  });

  it("should use localStorage when no URL param", () => {
    localStorageMock.setItem("language", "en");

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LocalizationProvider>{children}</LocalizationProvider>
    );

    const { result } = renderHook(() => useLocalization(), { wrapper });

    expect(result.current.language).toBe("en");
  });

  it("should prioritize URL param over localStorage", () => {
    localStorageMock.setItem("language", "fr");
    mockSearchParams.set("lang", "en");

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LocalizationProvider>{children}</LocalizationProvider>
    );

    const { result } = renderHook(() => useLocalization(), { wrapper });

    expect(result.current.language).toBe("en");
    expect(localStorageMock.getItem("language")).toBe("en");
  });

  it("should change language and update URL", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LocalizationProvider>{children}</LocalizationProvider>
    );

    const { result } = renderHook(() => useLocalization(), { wrapper });

    act(() => {
      result.current.setLanguage("en");
    });

    expect(result.current.language).toBe("en");
    expect(localStorageMock.getItem("language")).toBe("en");
    expect(mockPush).toHaveBeenCalledWith("/?lang=en");
  });

  it("should preserve existing query params when updating language", () => {
    mockSearchParams.set("search", "test");

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LocalizationProvider>{children}</LocalizationProvider>
    );

    const { result } = renderHook(() => useLocalization(), { wrapper });

    act(() => {
      result.current.setLanguage("en");
    });

    expect(mockPush).toHaveBeenCalledWith("/?search=test&lang=en");
  });

  it("should throw error when used outside provider", () => {
    expect(() => {
      renderHook(() => useLocalization());
    }).toThrow("useLocalization must be used within a LocalizationProvider");
  });
});
