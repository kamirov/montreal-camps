import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/.next/**",
        "**/*.config.*",
        "**/src/types/**",
        "**/src/data/**",
        "**/src/components/ui/**",
        "**/src/app/**/*.tsx", // Exclude Next.js pages and layouts (tested via E2E)
        "**/src/app/**/*.ts", // Exclude API routes (tested via integration tests)
        "**/vitest.setup.ts",
        "**/*.spec.ts",
        "**/*.spec.tsx",
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 60,
        statements: 60,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
