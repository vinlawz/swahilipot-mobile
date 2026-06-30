import React from 'react';
import { TextProps } from 'react-native';
import Text from './Text';

interface HeadingProps extends TextProps {
  level?: 1 | 2 | 3 | 4;
  color?: string;
}

const Heading = React.forwardRef<any, HeadingProps>(
  ({ level = 1, color = 'foreground', style, ...props }, ref) => {
    const variantMap = {
      1: 'h1' as const,
      2: 'h2' as const,
      3: 'h3' as const,
      4: 'h4' as const,
    };

    return (
      <Text
        ref={ref}
        variant={variantMap[level]}
        color={color}
        style={[{ marginVertical: 4 }, style]}
        {...props}
      />
    );
  }
);

Heading.displayName = 'Heading';

export default Heading;
