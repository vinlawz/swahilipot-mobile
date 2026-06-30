export const Spacing = {
  // 8px base grid
  xs: 4,   // Half unit
  sm: 8,   // 1 unit
  md: 12,  // 1.5 units
  lg: 16,  // 2 units
  xl: 24,  // 3 units
  xxl: 32, // 4 units
  xxxl: 48, // 6 units
  huge: 64, // 8 units

  // Container/section padding
  screenPadding: 16,
  cardPadding: 16,
  sectionPadding: 16,

  // Gap between items
  gapSmall: 8,
  gapMedium: 12,
  gapLarge: 16,

  // Common radius values
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999, // For pill-shaped buttons
  },

  // Component-specific
  buttonHeight: {
    sm: 36,
    md: 48,
    lg: 56,
  },

  buttonRadius: 12,
  inputHeight: 48,
  inputRadius: 12,
  cardRadius: 16,
  modalRadius: 24,
} as const;

export default Spacing;
