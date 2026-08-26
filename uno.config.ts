import { defineConfig, presetIcons, presetUno } from "unocss";
import mdi from "@iconify-json/mdi/icons.json";
import carbon from "@iconify-json/carbon/icons.json";

// 与 src/styles/variables.css 中的 CSS 变量保持一致的色板，
// 构建时会被编译进 dist/style.css，消费端无需再配置 UnoCSS。
export default defineConfig({
  presets: [
    presetUno(),
    // 图标集显式声明为本地 JSON，离线可构建，产物内联为 CSS
    presetIcons({
      scale: 1.2,
      warn: true,
      collections: {
        mdi: () => mdi,
        carbon: () => carbon,
      },
    }),
  ],
  content: {
    filesystem: ["src/components/**/*.vue", "src/App.vue"],
  },
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
        50: "#f0fdf4",
        100: "#dcfce7",
        200: "#bbf7d0",
        300: "#86efac",
        400: "#4ade80",
        500: "#22c55e",
        600: "#16a34a",
        700: "#15803d",
        800: "#166534",
        900: "#14532d",
      },
      warning: {
        50: "#fffbeb",
        100: "#fef3c7",
        200: "#fde68a",
        300: "#fcd34d",
        400: "#fbbf24",
        500: "#f59e0b",
        600: "#d97706",
        700: "#b45309",
        800: "#92400e",
        900: "#78350f",
      },
      error: {
        50: "#fef2f2",
        100: "#fee2e2",
        200: "#fecaca",
        300: "#fca5a5",
        400: "#f87171",
        500: "#ef4444",
        600: "#dc2626",
        700: "#b91c1c",
        800: "#991b1b",
        900: "#7f1d1d",
      },
      info: {
        50: "#eff6ff",
        100: "#dbeafe",
        200: "#bfdbfe",
        300: "#93c5fd",
        400: "#60a5fa",
        500: "#3b82f6",
        600: "#2563eb",
        700: "#1d4ed8",
        800: "#1e40af",
        900: "#1e3a8a",
      },
    },
  },
  shortcuts: {
    "nexa-transition": "transition-all duration-200 ease-in-out",
    "nexa-focus-ring":
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-offset-1",
  },
  rules: [
    // z-dropdown / z-modal / z-toast -> 对应 variables.css 中的层级变量
    [/^z-(dropdown|modal|toast)$/, ([, name]) => ({ "z-index": `var(--nexa-z-${name})` })],
  ],
});
