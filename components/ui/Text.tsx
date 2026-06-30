import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Theme';
import { Typography, TextVariantType } from '@/constants/Typography';
import { useColorScheme } from '@/components/useColorScheme';

interface TextProps extends RNTextProps {
  variant?: TextVariantType;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | string;
  weight?: '400' | '500' | '600' | '700';
}

const Text = React.forwardRef<RNText, TextProps>(
  (
    {
      variant = 'body',
      color = 'foreground',
      weight,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const variantStyle = Typography[variant];

    const getColorValue = (): string => {
      if (color.startsWith('#')) return color;
      if (color.startsWith('rgb')) return color;

      const colorMap: Record<string, string> = {
        primary: theme.primary,
        secondary: theme.secondary,
        success: theme.success,
        error: theme.error,
        warning: theme.warning,
        foreground: theme.foreground,
        foregroundSecondary: theme.foregroundSecondary,
        disabled: theme.disabled,
      };

      return colorMap[color] || theme.foreground;
    };

    const computedStyle = [
      variantStyle,
      {
        color: getColorValue(),
        fontWeight: weight || variantStyle.fontWeight,
      },
      style,
    ];

    return (
      <RNText
        ref={ref}
        style={computedStyle}
        {...props}
      >
        {children}
      </RNText>
    );
  }
);

Text.displayName = 'Text';

export default Text;
