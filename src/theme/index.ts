/**
 * Design tokens shared by every screen. Values are plain data so both the
 * light and dark theme stay derivable from one source.
 */

export const colors = {
  light: {
    text: '#101418',
    textSecondary: '#5A6472',
    background: '#FFFFFF',
    surface: '#F5F7FA',
    border: '#D8DEE7',
    accent: '#1B6CD9',
    accentText: '#FFFFFF',
    danger: '#B3261E',
    success: '#146C43',
    disabled: '#9AA5B1',
  },
  dark: {
    text: '#F2F5F8',
    textSecondary: '#A4AEBB',
    background: '#0E1216',
    surface: '#171C22',
    border: '#2A323B',
    accent: '#7FB2F5',
    accentText: '#0B1220',
    danger: '#F2B8B5',
    success: '#7BD3A5',
    disabled: '#5B6672',
  },
} as const;

export type ColorSchemeName = 'light' | 'dark';
export type ThemeColors = (typeof colors)['light'];

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
} as const;

export const typography = {
  title: { fontSize: 24, fontWeight: '700' as const },
  heading: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  label: { fontSize: 13, fontWeight: '600' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
} as const;

/** Minimum touch target recommended for mobile controls. */
export const MIN_TOUCH_TARGET = 44;
