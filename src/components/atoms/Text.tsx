/**
 * @fileoverview The one way text is drawn. Screens pick a named variant and a
 * named colour; nothing sets a font size or a hex value by hand.
 */

import {
  Text as RNText,
  type StyleProp,
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native';

import {
  colors,
  type ColorName,
  textVariants,
  type TextVariant,
} from '@/theme';

type TextProps = RNTextProps & {
  color?: ColorName;
  style?: StyleProp<TextStyle>;
  text?: string;
  variant?: TextVariant;
};

/**
 * Draws a line of text.
 * @param props - The text, its variant and its colour.
 * @returns {React.JSX.Element | null} - The text, or nothing when it is empty.
 */
export const Text = ({
  children,
  color = 'ink',
  style,
  text,
  variant = 'body',
  ...rest
}: TextProps): React.JSX.Element | null => {
  const content = text ?? children;

  if (content === undefined || content === null || content === '') {
    return null;
  }

  const isHeading = variant === 'screenTitle' || variant === 'title';

  return (
    <RNText
      accessibilityRole={isHeading ? 'header' : undefined}
      style={[textVariants[variant], { color: colors[color] }, style]}
      {...rest}
    >
      {content}
    </RNText>
  );
};
