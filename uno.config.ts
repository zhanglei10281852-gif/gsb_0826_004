import {
  defineConfig,
  presetUno,
  presetIcons,
  transformerDirectives,
} from "unocss";

function withAlpha(variable: string) {
  return `rgb(var(${variable}) / <alpha-value>)`;
}

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
    }),
  ],
  transformers: [transformerDirectives()],
  content: {
    pipeline: {
      include: [/\.(vue|ts|js)($|\?)/],
    },
  },
  theme: {
    colors: {
      primary: {
        50: withAlpha("--nexa-primary-50"),
        100: withAlpha("--nexa-primary-100"),
        200: withAlpha("--nexa-primary-200"),
        300: withAlpha("--nexa-primary-300"),
        400: withAlpha("--nexa-primary-400"),
        500: withAlpha("--nexa-primary-500"),
        600: withAlpha("--nexa-primary-600"),
        700: withAlpha("--nexa-primary-700"),
        800: withAlpha("--nexa-primary-800"),
        900: withAlpha("--nexa-primary-900"),
      },
      surface: {
        0: withAlpha("--nexa-surface-0"),
        50: withAlpha("--nexa-surface-50"),
        100: withAlpha("--nexa-surface-100"),
        200: withAlpha("--nexa-surface-200"),
        300: withAlpha("--nexa-surface-300"),
        400: withAlpha("--nexa-surface-400"),
        500: withAlpha("--nexa-surface-500"),
        600: withAlpha("--nexa-surface-600"),
        700: withAlpha("--nexa-surface-700"),
        800: withAlpha("--nexa-surface-800"),
        900: withAlpha("--nexa-surface-900"),
      },
      success: {
        100: withAlpha("--nexa-success-100"),
        500: withAlpha("--nexa-success-500"),
        600: withAlpha("--nexa-success-600"),
        700: withAlpha("--nexa-success-700"),
      },
      warning: {
        100: withAlpha("--nexa-warning-100"),
        500: withAlpha("--nexa-warning-500"),
        600: withAlpha("--nexa-warning-600"),
        700: withAlpha("--nexa-warning-700"),
      },
      error: {
        100: withAlpha("--nexa-error-100"),
        500: withAlpha("--nexa-error-500"),
        600: withAlpha("--nexa-error-600"),
        700: withAlpha("--nexa-error-700"),
      },
      info: {
        100: withAlpha("--nexa-info-100"),
        500: withAlpha("--nexa-info-500"),
        600: withAlpha("--nexa-info-600"),
        700: withAlpha("--nexa-info-700"),
      },
    },
    zIndex: {
      dropdown: "1000",
      modal: "1100",
      toast: "1200",
    },
  },
  shortcuts: {
    "nexa-transition": "transition duration-200 ease-in-out",
    "nexa-focus-ring":
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-offset-2",
  },
});
