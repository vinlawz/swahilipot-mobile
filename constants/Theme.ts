import { useColorScheme } from '@/components/useColorScheme';

export type ColorScheme = 'light' | 'dark';

export const SemanticColors = {
  light: {
    // Brand colors
    primary: '#111827', // Dark navy - main brand color
    primaryLight: '#1f2937', // Lighter navy
    primaryDark: '#0f172a', // Darker navy
    primaryForeground: '#ffffff', // Text on primary

    // Secondary
    secondary: '#2f95dc', // Blue accent
    secondaryLight: '#3fa9e8',
    secondaryDark: '#2176b8',
    secondaryForeground: '#ffffff',

    // Status colors
    success: '#10b981', // Green
    warning: '#f59e0b', // Amber
    error: '#ef4444', // Red
    info: '#3b82f6', // Blue

    // Neutral grays (8-level scale)
    gray0: '#ffffff', // White
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',

    // Semantic backgrounds
    background: '#ffffff',
    backgroundSecondary: '#f9fafb',
    foreground: '#111827',
    foregroundSecondary: '#6b7280',

    // Interactive states
    disabled: '#d1d5db',
    disabledForeground: '#9ca3af',

    // Borders
    border: '#e5e7eb',
    borderLight: '#f3f4f6',
    borderDark: '#d1d5db',

    // Component-specific
    card: '#ffffff',
    cardBorder: '#e5e7eb',
    input: '#ffffff',
    inputBorder: '#d1d5db',
    inputPlaceholder: '#9ca3af',

    // Status badges
    statusLive: '#dc2626', // Red for "live"
    statusLiveBg: '#fee2e2',
  },

  dark: {
    // Brand colors
    primary: '#ffffff', // White for dark mode
    primaryLight: '#f3f4f6',
    primaryDark: '#e5e7eb',
    primaryForeground: '#111827',

    // Secondary
    secondary: '#60a5fa', // Lighter blue for dark mode
    secondaryLight: '#93c5fd',
    secondaryDark: '#3b82f6',
    secondaryForeground: '#111827',

    // Status colors
    success: '#34d399', // Lighter green
    warning: '#fbbf24', // Lighter amber
    error: '#f87171', // Lighter red
    info: '#60a5fa', // Lighter blue

    // Neutral grays (inverted)
    gray0: '#000000',
    gray50: '#111827',
    gray100: '#1f2937',
    gray200: '#374151',
    gray300: '#4b5563',
    gray400: '#6b7280',
    gray500: '#9ca3af',
    gray600: '#d1d5db',
    gray700: '#e5e7eb',
    gray800: '#f3f4f6',
    gray900: '#ffffff',

    // Semantic backgrounds
    background: '#0f172a',
    backgroundSecondary: '#111827',
    foreground: '#ffffff',
    foregroundSecondary: '#d1d5db',

    // Interactive states
    disabled: '#374151',
    disabledForeground: '#6b7280',

    // Borders
    border: '#374151',
    borderLight: '#1f2937',
    borderDark: '#4b5563',

    // Component-specific
    card: '#111827',
    cardBorder: '#374151',
    input: '#1f2937',
    inputBorder: '#374151',
    inputPlaceholder: '#6b7280',

    // Status badges
    statusLive: '#fca5a5', // Lighter red
    statusLiveBg: '#7f1d1d', // Dark red bg
  },
};

// Export for direct use in components
export const Colors = SemanticColors;

// Hook for theme context (to be used throughout app)
export const useTheme = () => {
  const colorScheme = useColorScheme();
  return SemanticColors[colorScheme ?? 'light'];
};
