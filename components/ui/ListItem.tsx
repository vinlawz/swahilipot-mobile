import React from 'react';
import {
  Pressable,
  View,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Theme';
import { Spacing } from '@/constants/Spacing';
import { useColorScheme } from '@/components/useColorScheme';
import Text from './Text';

interface ListItemProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  divider?: boolean;
}

const ListItem = React.forwardRef<View, ListItemProps>(
  (
    {
      title,
      subtitle,
      icon,
      rightElement,
      onPress,
      style,
      divider = true,
    },
    ref
  ) => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const containerStyle: ViewStyle = {
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.lg,
      borderBottomWidth: divider ? 1 : 0,
      borderBottomColor: theme.border,
    };

    const content = (
      <View
        ref={ref}
        style={[containerStyle, style]}
      >
        {icon && (
          <MaterialIcons
            name={icon}
            size={24}
            color={theme.secondary}
          />
        )}
        <View style={{ flex: 1, gap: Spacing.xs }}>
          <Text variant="body" weight="500" color="foreground">
            {title}
          </Text>
          {subtitle && (
            <Text variant="bodySmall" color="foregroundSecondary">
              {subtitle}
            </Text>
          )}
        </View>
        {rightElement || (onPress && (
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={theme.gray400}
          />
        ))}
      </View>
    );

    if (onPress) {
      return (
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          {content}
        </Pressable>
      );
    }

    return content;
  }
);

ListItem.displayName = 'ListItem';

export default ListItem;
