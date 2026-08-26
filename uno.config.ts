import {
  defineConfig,
  presetUno,
  presetIcons,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno({ preflight: false }),
    presetIcons({
      scale: 1.2,
      warn: true,
      collections: {
        mdi: () => import('@iconify-json/mdi/icons.json').then((i) => i.default),
        carbon: () => import('@iconify-json/carbon/icons.json').then((i) => i.default),
      },
    }),
  ],
  theme: {
    colors: {
      primary: {
        50: '#f5f3ff',
        100: '#ede9fe',
        200: '#ddd6fe',
        300: '#c4b5fd',
        400: '#a78bfa',
        500: '#8b5cf6',
        600: '#7c3aed',
        700: '#6d28d9',
        800: '#5b21b6',
        900: '#4c1d95',
      },
      surface: {
        0: '#ffffff',
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
      },
      success: {
        100: '#dcfce7',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
      },
      warning: {
        100: '#fef3c7',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
      },
      error: {
        100: '#fee2e2',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
      },
      info: {
        100: '#dbeafe',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
      },
    },
    zIndex: {
      dropdown: '1000',
      modal: '1100',
      toast: '1200',
    },
  },
  shortcuts: {
    'nexa-transition': 'transition-all duration-200 ease-in-out',
    'nexa-focus-ring': 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
  },
  safelist: [
    'i-mdi-loading',
    'i-mdi-eye',
    'i-mdi-eye-off',
    'i-mdi-dots-horizontal',
    'i-mdi-chevron-right',
    'i-mdi-check',
    'i-mdi-close',
    'i-mdi-alert',
    'i-mdi-information',
    'i-carbon-user',
  ],
})
