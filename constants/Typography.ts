import { TextStyle } from 'react-native';

export const Typography = {
  // Headings
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5,
  } as TextStyle,

  h2: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: -0.25,
  } as TextStyle,

  h3: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: 0,
  } as TextStyle,

  h4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: 0,
  } as TextStyle,

  // Body text
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0.5,
  } as TextStyle,

  body: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.25,
  } as TextStyle,

  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.4,
  } as TextStyle,

  // Labels
  label: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0.1,
  } as TextStyle,

  labelSmall: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    letterSpacing: 0.5,
  } as TextStyle,

  // Captions
  caption: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.5,
  } as TextStyle,

  // Button text
  button: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0.1,
  } as TextStyle,

  buttonSmall: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0.1,
  } as TextStyle,
};

// Variants for semantic usage
export const TextVariant = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  bodyLarge: 'bodyLarge',
  body: 'body',
  bodySmall: 'bodySmall',
  label: 'label',
  labelSmall: 'labelSmall',
  caption: 'caption',
  button: 'button',
  buttonSmall: 'buttonSmall',
} as const;

export type TextVariantType = keyof typeof TextVariant;
