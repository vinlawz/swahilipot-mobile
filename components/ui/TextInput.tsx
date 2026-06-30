import React from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Theme';
import { Spacing } from '@/constants/Spacing';
import { useColorScheme } from '@/components/useColorScheme';
import Text from './Text';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconPosition?: 'left' | 'right';
}

const TextInput = React.forwardRef<RNTextInput, TextInputProps>(
  (
    {
      label,
      error,
      icon,
      iconPosition = 'left',
      style,
      editable = true,
      ...props
    },
    ref
  ) => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const containerStyle: ViewStyle = {
      gap: Spacing.sm,
    };

    const inputWrapperStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: error ? theme.error : theme.inputBorder,
      borderRadius: Spacing.radius.md,
      backgroundColor: editable ? theme.input : theme.gray100,
      paddingHorizontal: Spacing.lg,
      height: Spacing.inputHeight,
      gap: Spacing.md,
    };

    const inputStyle: TextStyle = {
      flex: 1,
      color: theme.foreground,
      fontSize: 16,
    };

    return (
      <View style={containerStyle}>
        {label && (
          <Text variant="label" color="foreground">
            {label}
          </Text>
        )}
        <View style={inputWrapperStyle}>
          {icon && iconPosition === 'left' && (
            <MaterialIcons
              name={icon}
              size={20}
              color={error ? theme.error : theme.gray400}
            />
          )}
          <RNTextInput
            ref={ref}
            style={inputStyle}
            placeholderTextColor={theme.inputPlaceholder}
            editable={editable}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <MaterialIcons
              name={icon}
              size={20}
              color={error ? theme.error : theme.gray400}
            />
          )}
        </View>
        {error && (
          <Text variant="bodySmall" color="error">
            {error}
          </Text>
        )}
      </View>
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;
