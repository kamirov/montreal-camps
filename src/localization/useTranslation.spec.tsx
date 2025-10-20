import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LocalizationProvider } from "./context";
import { useTranslation } from "./useTranslation";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

describe("useTranslation", () => {
  it("should return translation object and language", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LocalizationProvider>{children}</LocalizationProvider>
    );

    const { result } = renderHook(() => useTranslation(), { wrapper });

    expect(result.current.t).toBeDefined();
    expect(result.current.language).toBeDefined();
    expect(["en", "fr"]).toContain(result.current.language);
  });

  it("should have all required translation keys", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LocalizationProvider>{children}</LocalizationProvider>
    );

    const { result } = renderHook(() => useTranslation(), { wrapper });

    expect(result.current.t.appName).toBeDefined();
    expect(result.current.t.campTypes).toBeDefined();
    expect(result.current.t.campTypes.day).toBeDefined();
    expect(result.current.t.campTypes.vacation).toBeDefined();
    expect(result.current.t.filters).toBeDefined();
    expect(result.current.t.campFields).toBeDefined();
  });
});
