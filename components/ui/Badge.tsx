import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Theme';
import { Spacing } from '@/constants/Spacing';
import { useColorScheme } from '@/components/useColorScheme';
import Text from './Text';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'secondary' | 'info';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  style?: any;
}

const Badge: React.FC<BadgeProps> = ({ label, variant = 'secondary', size = 'sm', style }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const variantConfig: Record<BadgeVariant, { bg: string; text: string }> = {
    primary: {
      bg: theme.primary,
      text: '#ffffff',
    },
    secondary: {
      bg: theme.secondary,
      text: '#ffffff',
    },
    success: {
      bg: '#d1fae5',
      text: '#065f46',
    },
    warning: {
      bg: '#fef3c7',
      text: '#92400e',
    },
    error: {
      bg: '#fee2e2',
      text: '#991b1b',
    },
    info: {
      bg: '#dbeafe',
      text: '#0c4a6e',
    },
  };

  const config = variantConfig[variant] || variantConfig.secondary;

  const containerStyle: ViewStyle = {
    backgroundColor: config.bg,
    borderRadius: Spacing.radius.full,
    paddingHorizontal: size === 'sm' ? Spacing.md : Spacing.lg,
    paddingVertical: size === 'sm' ? Spacing.xs : Spacing.sm,
    alignSelf: 'flex-start',
    ...style,
  };

  return (
    <View style={containerStyle}>
      <Text
        variant={size === 'sm' ? 'caption' : 'labelSmall'}
        weight="600"
        style={{ color: config.text }}
      >
        {label}
      </Text>
    </View>
  );
};

export default Badge;
