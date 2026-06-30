import React from 'react';
import { View, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Theme';
import { Spacing } from '@/constants/Spacing';
import { useColorScheme } from '@/components/useColorScheme';
import Text from './Text';
import Button from './Button';

interface EmptyStateProps {
  icon?: keyof typeof MaterialIcons.glyphMap;
  title: string;
  message?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  fullScreen?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  message,
  action,
  fullScreen = false,
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const containerStyle: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    paddingVertical: Spacing.xxxl,
    ...(fullScreen && { flex: 1 }),
  };

  return (
    <View style={containerStyle}>
      <MaterialIcons
        name={icon}
        size={48}
        color={theme.gray300}
      />
      <View style={{ alignItems: 'center', gap: Spacing.sm }}>
        <Text variant="h4" color="foreground">
          {title}
        </Text>
        {message && (
          <Text
            variant="body"
            color="foregroundSecondary"
            style={{ textAlign: 'center', maxWidth: 280 }}
          >
            {message}
          </Text>
        )}
      </View>
      {action && (
        <Button onPress={action.onPress} size="md">
          {action.label}
        </Button>
      )}
    </View>
  );
};

export default EmptyState;
