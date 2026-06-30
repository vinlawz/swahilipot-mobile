import React from 'react';
import { View, ActivityIndicator, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Theme';
import { Spacing } from '@/constants/Spacing';
import { useColorScheme } from '@/components/useColorScheme';
import Text from './Text';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color,
  text,
  fullScreen = false,
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const containerStyle: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
    ...(fullScreen && { flex: 1 }),
  };

  return (
    <View style={containerStyle}>
      <ActivityIndicator
        size={size}
        color={color || theme.primary}
      />
      {text && <Text variant="body" color="foregroundSecondary">{text}</Text>}
    </View>
  );
};

export default LoadingSpinner;
