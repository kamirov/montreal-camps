import { LocalizationProvider } from "@/localization/context";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ChangeEvent, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ManagePage from "./page";

const {
  getCampsMock,
  getCampMock,
  upsertCampMock,
  deleteCampMock,
  toastMock,
} = vi.hoisted(() => ({
  getCampsMock: vi.fn(),
  getCampMock: vi.fn(),
  upsertCampMock: vi.fn(),
  deleteCampMock: vi.fn(),
  toastMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => "/manage",
  useSearchParams: () => new URLSearchParams("lang=en"),
}));

vi.mock("@/lib/api/camps", () => ({
  getCamps: getCampsMock,
  getCamp: getCampMock,
  upsertCamp: upsertCampMock,
  deleteCamp: deleteCampMock,
}));

vi.mock("@/components/Header", () => ({
  Header: () => <div>Header</div>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    type = "button",
    onClick,
    disabled,
    variant: _variant,
    size: _size,
  }: {
    children: ReactNode;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    disabled?: boolean;
    variant?: string;
    size?: string;
  }) => (
    <button type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/input", () => ({
  Input: ({
    value,
    onChange,
    type = "text",
    required,
    disabled,
    placeholder,
    className,
    "aria-label": ariaLabel,
    inputMode,
  }: {
    value?: string | number;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
    "aria-label"?: string;
    inputMode?: string;
  }) => (
    <input
      aria-label={ariaLabel}
      className={className}
      disabled={disabled}
      inputMode={inputMode}
      placeholder={placeholder}
      required={required}
      type={type}
      value={value ?? ""}
      onChange={onChange}
    />
  ),
}));

vi.mock("@/components/ui/checkbox", () => ({
  Checkbox: ({
    id,
    checked,
    onCheckedChange,
  }: {
    id: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }) => (
    <input
      id={id}
      checked={checked}
      type="checkbox"
      onChange={(event) => onCheckedChange?.(event.target.checked)}
    />
  ),
}));

vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DialogContent: ({
    children,
  }: {
    children: ReactNode;
    onInteractOutside?: (event: Event) => void;
  }) => <div>{children}</div>,
  DialogDescription: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogFooter: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/components/ui/borough-autocomplete", () => ({
  BoroughAutocomplete: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => <input aria-label="Borough" value={value} onChange={(e) => onChange(e.target.value)} />,
}));

vi.mock("@/components/ui/searchable-combobox", () => ({
  SearchableCombobox: ({
    value,
    onChange,
    placeholder,
  }: {
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }) => (
    <input
      aria-label={placeholder}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

vi.mock("@/components/ui/tags-input", () => ({
  TagsInput: () => <div>Tags Input</div>,
}));

vi.mock("@/components/ui/phone-input", () => ({
  PhoneInput: () => <div>Phone Input</div>,
}));

vi.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({
    toast: toastMock,
  }),
}));

vi.mock("lucide-react", () => ({
  ExternalLink: () => <span>ExternalLink</span>,
}));

function renderManagePage() {
  return render(
    <LocalizationProvider>
      <ManagePage />
    </LocalizationProvider>
  );
}

describe("ManagePage age inputs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("adminSecret", "secret");
    localStorage.setItem("language", "en");
    getCampsMock.mockResolvedValue([]);
    getCampMock.mockResolvedValue(null);
    upsertCampMock.mockResolvedValue({
      name: "Freeform Camp",
      borough: "Ahuntsic-Cartierville",
      ageRange: { type: "range", allAges: false, from: 5, to: 5 },
      languages: ["English", "French"],
      dates: { type: "yearRound", yearRound: true },
      financialAid: "NA",
      link: undefined,
      phone: undefined,
      email: "",
      address: "123 Main St",
      notes: "",
    });

    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string | URL | Request) => {
        const url =
          typeof input === "string"
            ? input
            : input instanceof URL
              ? input.toString()
              : input.url;

        if (url === "/api/auth/validate") {
          return {
            ok: true,
            json: async () => ({ valid: true }),
          } as Response;
        }

        if (url.startsWith("/api/geocode")) {
          return {
            ok: true,
            json: async () => ({ lat: 45.5, lng: -73.6 }),
          } as Response;
        }

        throw new Error(`Unhandled fetch: ${url}`);
      })
    );

    window.scrollTo = vi.fn();
  });

  it("keeps freeform age input while editing", async () => {
    renderManagePage();

    await screen.findByText("Manage Camps");
    fireEvent.click(screen.getByRole("button", { name: "Create New Camp" }));
    fireEvent.click(screen.getByLabelText("All ages"));

    const fromInput = screen.getByDisplayValue("5");

    fireEvent.change(fromInput, { target: { value: "1a" } });

    expect(screen.getByDisplayValue("1a")).toBeInTheDocument();
  });

  it("blocks submit and shows a localized error for invalid age input", async () => {
    renderManagePage();

    await screen.findByText("Manage Camps");
    fireEvent.click(screen.getByRole("button", { name: "Create New Camp" }));
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Freeform Camp" },
    });
    fireEvent.change(screen.getByLabelText("Address"), {
      target: { value: "123 Main St" },
    });
    fireEvent.click(screen.getByLabelText("All ages"));
    fireEvent.change(screen.getByDisplayValue("https://"), {
      target: { value: "" },
    });

    const fromInput = screen.getByDisplayValue("5");
    const toInput = screen.getByDisplayValue("12");

    fireEvent.change(fromInput, { target: { value: "abc" } });
    fireEvent.change(toInput, { target: { value: "5" } });

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(upsertCampMock).not.toHaveBeenCalled();
    expect(screen.getByText("Ages must be whole numbers")).toBeInTheDocument();
  });

  it("submits valid freeform ages as numeric values", async () => {
    renderManagePage();

    await screen.findByText("Manage Camps");
    fireEvent.click(screen.getByRole("button", { name: "Create New Camp" }));
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Freeform Camp" },
    });
    fireEvent.change(screen.getByLabelText("Address"), {
      target: { value: "123 Main St" },
    });
    fireEvent.click(screen.getByLabelText("All ages"));
    fireEvent.change(screen.getByDisplayValue("https://"), {
      target: { value: "" },
    });

    const fromInput = screen.getByDisplayValue("5");
    const toInput = screen.getByDisplayValue("12");

    fireEvent.change(fromInput, { target: { value: " 5 " } });
    fireEvent.change(toInput, { target: { value: " 5 " } });

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(upsertCampMock).toHaveBeenCalledWith(
        "Freeform Camp",
        expect.objectContaining({
          ageRange: {
            type: "range",
            allAges: false,
            from: 5,
            to: 5,
          },
        })
      );
    });
  });
});
