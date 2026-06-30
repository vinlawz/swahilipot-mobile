import React from 'react';
import { Pressable, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, View } from 'react-native';
import { Colors } from '@/constants/Theme';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import Text from './Text';
import { useColorScheme } from '@/components/useColorScheme';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  onPress: () => void | Promise<void>;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  testID?: string;
}

const Button = React.forwardRef<View, ButtonProps>(
  (
    {
      onPress,
      children,
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      style,
      testID,
    },
    ref
  ) => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const isDisabled = disabled || loading;

    const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
      switch (variant) {
        case 'primary':
          return {
            container: {
              backgroundColor: theme.primary,
              borderWidth: 0,
            },
            text: {
              color: theme.primaryForeground,
            },
          };
        case 'secondary':
          return {
            container: {
              backgroundColor: theme.backgroundSecondary,
              borderWidth: 1,
              borderColor: theme.border,
            },
            text: {
              color: theme.foreground,
            },
          };
        case 'danger':
          return {
            container: {
              backgroundColor: theme.error,
              borderWidth: 0,
            },
            text: {
              color: '#ffffff',
            },
          };
        case 'ghost':
          return {
            container: {
              backgroundColor: 'transparent',
              borderWidth: 1,
              borderColor: theme.border,
            },
            text: {
              color: theme.foreground,
            },
          };
        default:
          return {
            container: {},
            text: {},
          };
      }
    };

    const getSizeStyles = (): { height: number; paddingHorizontal: number; fontSize: number } => {
      switch (size) {
        case 'sm':
          return { height: Spacing.buttonHeight.sm, paddingHorizontal: Spacing.lg, fontSize: 13 };
        case 'md':
          return { height: Spacing.buttonHeight.md, paddingHorizontal: Spacing.xl, fontSize: 15 };
        case 'lg':
          return { height: Spacing.buttonHeight.lg, paddingHorizontal: Spacing.xxl, fontSize: 16 };
        default:
          return { height: Spacing.buttonHeight.md, paddingHorizontal: Spacing.xl, fontSize: 15 };
      }
    };

    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();

    const containerStyle: ViewStyle = {
      ...variantStyles.container,
      height: sizeStyles.height,
      paddingHorizontal: sizeStyles.paddingHorizontal,
      borderRadius: Spacing.radius.full,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.gapSmall,
      opacity: isDisabled ? 0.6 : 1,
      width: fullWidth ? '100%' : 'auto',
    };

    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) => [
          containerStyle,
          pressed && !isDisabled && { opacity: 0.85 },
          style,
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        testID={testID}
      >
        {loading ? (
          <ActivityIndicator size="small" color={variantStyles.text.color as string} />
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            {typeof children === 'string' ? (
              <Text
                style={[
                  { ...Typography.button, color: variantStyles.text.color, fontSize: sizeStyles.fontSize },
                ]}
              >
                {children}
              </Text>
            ) : (
              children
            )}
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </Pressable>
    );
  }
);

Button.displayName = 'Button';

export default Button;
