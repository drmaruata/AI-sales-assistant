/**
 * Design tokens shared by every screen. Values are plain data so both the
 * light and dark theme stay derivable from one source.
 */

export const colors = {
  light: {
    text: '#16161D',
    textSecondary: '#6B6B7B',
    textFaint: '#9A96AC',
    background: '#F2EDFC',
    surface: 'rgba(255, 255, 255, 0.72)',
    surfaceStrong: '#FFFFFF',
    field: 'rgba(255, 255, 255, 0.62)',
    border: 'rgba(255, 255, 255, 0.9)',
    hairline: 'rgba(22, 22, 29, 0.08)',
    accent: '#4F46E5',
    accentText: '#FFFFFF',
    accentSoft: '#E7E5FF',
    accentMuted: '#A9A3F2',
    danger: '#D92D20',
    dangerSoft: '#FDE7E4',
    success: '#0F7A4D',
    successSoft: '#D8F4E4',
    warning: '#9A5B00',
    warningSoft: '#FBEBCB',
    sky: '#0E7490',
    skySoft: '#DCF2F8',
    peachSoft: '#FDE8E4',
    disabled: '#B0AAC4',
    tabBar: '#FFFFFF',
  },
  dark: {
    text: '#F4F1FF',
    textSecondary: '#B0A9C9',
    textFaint: '#857DA3',
    background: '#0F0C1D',
    surface: 'rgba(38, 32, 66, 0.78)',
    surfaceStrong: '#241E3D',
    field: 'rgba(48, 41, 82, 0.72)',
    border: 'rgba(139, 133, 255, 0.16)',
    hairline: 'rgba(244, 241, 255, 0.12)',
    accent: '#8B85FF',
    accentText: '#12102A',
    accentSoft: '#2C2752',
    accentMuted: '#6E68C4',
    danger: '#FF9A8F',
    dangerSoft: '#3A1F24',
    success: '#7BD3A5',
    successSoft: '#1C3329',
    warning: '#FFC978',
    warningSoft: '#332916',
    sky: '#7FD4EA',
    skySoft: '#14313B',
    peachSoft: '#3A2220',
    disabled: '#5B5474',
    tabBar: '#1E1936',
  },
} as const;

export type ColorSchemeName = 'light' | 'dark';
export type ThemeColors = { [K in keyof (typeof colors)['light']]: string };

/** Soft lavender canvas from the reference board, top-left to bottom-right. */
export const canvasGradient = {
  light: 'linear-gradient(160deg, #E7E0FC 0%, #F7F3FD 42%, #EFE8FC 72%, #E4DCFA 100%)',
  dark: 'linear-gradient(160deg, #171233 0%, #0F0C1D 48%, #1A1436 100%)',
} as const;

/** Tinted avatar backgrounds, picked deterministically from a name. */
export const avatarTints = {
  light: [
    { background: '#E7E5FF', foreground: '#4F46E5' },
    { background: '#D8F4E4', foreground: '#0F7A4D' },
    { background: '#FDE8E4', foreground: '#C2410C' },
    { background: '#DCF2F8', foreground: '#0E7490' },
  ],
  dark: [
    { background: '#2C2752', foreground: '#B9B4FF' },
    { background: '#1C3329', foreground: '#7BD3A5' },
    { background: '#3A2220', foreground: '#FFB4A2' },
    { background: '#14313B', foreground: '#7FD4EA' },
  ],
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 9999,
} as const;

export const shadows = {
  card: '0 10px 24px rgba(63, 44, 133, 0.07)',
  tabBar: '0 12px 32px rgba(63, 44, 133, 0.14)',
  accent: '0 10px 22px rgba(79, 70, 229, 0.28)',
} as const;

export const typography = {
  display: { fontSize: 32, fontWeight: '800' as const, letterSpacing: -0.8 },
  title: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.6 },
  heading: { fontSize: 18, fontWeight: '700' as const, letterSpacing: -0.2 },
  body: { fontSize: 15, fontWeight: '400' as const },
  label: { fontSize: 13, fontWeight: '600' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
} as const;

/** Minimum touch target recommended for mobile controls. */
export const MIN_TOUCH_TARGET = 44;

/** Bottom padding that keeps scroll content clear of the floating tab bar. */
export const TAB_BAR_CLEARANCE = 112;
