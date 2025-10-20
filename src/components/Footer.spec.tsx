import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Footer } from "./Footer";

// Mock the translation hook
vi.mock("@/localization/useTranslation", () => ({
  useTranslation: () => ({
    t: {
      footer: {
        madeWithLove: "Made with ❤️ by Andrei Khramtsov",
        sourceCode: "Source code available on GitHub",
      },
    },
  }),
}));

describe("Footer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the footer component", () => {
    render(<Footer />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });

  it("displays the made with love text", () => {
    render(<Footer />);
    expect(
      screen.getByText("Made with ❤️ by Andrei Khramtsov")
    ).toBeInTheDocument();
  });

  it("displays the source code link text", () => {
    render(<Footer />);
    expect(
      screen.getByText("Source code available on GitHub")
    ).toBeInTheDocument();
  });

  it("renders a link to the GitHub repository", () => {
    render(<Footer />);
    const link = screen.getByRole("link", {
      name: /source code available on github/i,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "href",
      "https://github.com/kamirov/montreal-camps"
    );
  });

  it("opens the GitHub link in a new tab", () => {
    render(<Footer />);
    const link = screen.getByRole("link", {
      name: /source code available on github/i,
    });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("displays the GitHub icon", () => {
    render(<Footer />);
    const link = screen.getByRole("link", {
      name: /source code available on github/i,
    });
    // Check for the GitHub icon by looking for the svg element within the link
    const svg = link.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
