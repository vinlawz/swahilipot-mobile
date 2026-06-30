import React from 'react';
import { View, Pressable, ViewStyle, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Theme';
import { Spacing } from '@/constants/Spacing';
import { Shadows } from '@/constants/Shadows';
import { useColorScheme } from '@/components/useColorScheme';

interface CardProps {
  children: React.ReactNode;
  padding?: number;
  gap?: number;
  onPress?: () => void;
  style?: ViewStyle;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  borderColor?: string;
  backgroundColor?: string;
}

const Card = React.forwardRef<View, CardProps>(
  (
    {
      children,
      padding = Spacing.cardPadding,
      gap = Spacing.gapMedium,
      onPress,
      style,
      shadow = 'sm',
      borderColor,
      backgroundColor,
    },
    ref
  ) => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const containerStyle: ViewStyle = {
      backgroundColor: backgroundColor || theme.card,
      borderRadius: Spacing.radius.lg,
      borderWidth: 1,
      borderColor: borderColor || theme.cardBorder,
      padding,
      gap,
      ...Shadows[shadow],
    };

    if (onPress) {
      return (
        <Pressable
          ref={ref}
          onPress={onPress}
          style={({ pressed }) => [
            containerStyle,
            pressed && { opacity: 0.9 },
            style,
          ]}
        >
          {children}
        </Pressable>
      );
    }

    return (
      <View ref={ref} style={[containerStyle, style]}>
        {children}
      </View>
    );
  }
);

Card.displayName = 'Card';

export default Card;
