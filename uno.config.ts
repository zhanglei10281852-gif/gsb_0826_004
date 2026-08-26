import { createRequire } from "node:module";
import { defineConfig, presetWind, presetIcons } from "unocss";
import type { IconifyJSON } from "@iconify/types";

const require = createRequire(import.meta.url);

export default defineConfig({
  presets: [
    presetWind({ preflight: false }),
    presetIcons({
      scale: 1,
      warn: true,
      collections: {
        mdi: () =>
          Promise.resolve(
            require("@iconify-json/mdi/icons.json") as IconifyJSON,
          ),
        carbon: () =>
          Promise.resolve(
            require("@iconify-json/carbon/icons.json") as IconifyJSON,
          ),
      },
    }),
  ],
  theme: {
    colors: {
      primary: {
        50: "#f5f3ff",
        100: "#ede9fe",
        200: "#ddd6fe",
        300: "#c4b5fd",
        400: "#a78bfa",
        500: "#8b5cf6",
        600: "#7c3aed",
        700: "#6d28d9",
        800: "#5b21b6",
        900: "#4c1d95",
      },
      surface: {
        0: "#ffffff",
        50: "#f8fafc",
        100: "#f1f5f9",
        200: "#e2e8f0",
        300: "#cbd5e1",
        400: "#94a3b8",
        500: "#64748b",
        600: "#475569",
        700: "#334155",
        800: "#1e293b",
        900: "#0f172a",
      },
      success: {
        100: "#dcfce7",
        500: "#22c55e",
        600: "#16a34a",
        700: "#15803d",
      },
      warning: {
        100: "#fef3c7",
        500: "#f59e0b",
        600: "#d97706",
        700: "#b45309",
      },
      error: {
        100: "#fee2e2",
        500: "#ef4444",
        600: "#dc2626",
        700: "#b91c1c",
      },
      info: {
        100: "#dbeafe",
        500: "#3b82f6",
        600: "#2563eb",
        700: "#1d4ed8",
      },
    },
  },
  shortcuts: {
    "nexa-transition": "transition-all duration-200 ease-in-out",
    "nexa-focus-ring":
      "outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2",
    "z-dropdown": "z-[1000]",
    "z-modal": "z-[1100]",
    "z-toast": "z-[1200]",
  },
});
