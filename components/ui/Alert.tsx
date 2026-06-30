import React from 'react';
import { View, ViewStyle, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Theme';
import { Spacing } from '@/constants/Spacing';
import { useColorScheme } from '@/components/useColorScheme';
import Text from './Text';

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  type: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
  action?: {
    label: string;
    onPress: () => void;
  };
}

const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  onClose,
  action,
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const typeConfig = {
    info: {
      bg: '#e0f2fe',
      border: '#0284c7',
      text: '#0c4a6e',
      icon: 'info',
      color: '#0284c7',
    },
    success: {
      bg: '#dcfce7',
      border: '#22c55e',
      text: '#166534',
      icon: 'check-circle',
      color: '#22c55e',
    },
    warning: {
      bg: '#fef3c7',
      border: '#eab308',
      text: '#854d0e',
      icon: 'warning',
      color: '#eab308',
    },
    error: {
      bg: '#fee2e2',
      border: '#ef4444',
      text: '#991b1b',
      icon: 'error',
      color: '#ef4444',
    },
  };

  const config = typeConfig[type];

  const containerStyle: ViewStyle = {
    backgroundColor: config.bg,
    borderLeftWidth: 4,
    borderLeftColor: config.border,
    borderRadius: Spacing.radius.md,
    padding: Spacing.lg,
    gap: Spacing.md,
    flexDirection: 'row',
  };

  return (
    <View style={containerStyle}>
      <MaterialIcons name={config.icon as any} size={24} color={config.color} />
      <View style={{ flex: 1, gap: Spacing.xs }}>
        {title && (
          <Text
            variant="labelSmall"
            weight="600"
            style={{ color: config.text }}
          >
            {title}
          </Text>
        )}
        <Text
          variant="bodySmall"
          style={{ color: config.text }}
        >
          {message}
        </Text>
        {action && (
          <Pressable onPress={action.onPress} style={{ marginTop: Spacing.xs }}>
            <Text
              variant="labelSmall"
              weight="600"
              style={{ color: config.border }}
            >
              {action.label}
            </Text>
          </Pressable>
        )}
      </View>
      {onClose && (
        <Pressable onPress={onClose}>
          <MaterialIcons name="close" size={20} color={config.text} />
        </Pressable>
      )}
    </View>
  );
};

export default Alert;
