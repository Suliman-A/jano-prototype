/**
 * @fileoverview A surface with the app's corner radius and hairline.
 */

import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radii, spacing } from '@/theme';

type CardProps = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  tinted?: boolean;
};

/**
 * Wraps content in a card.
 * @param props - The content and whether the card is tinted or pressable.
 * @returns {React.JSX.Element} - The card.
 */
export const Card = ({
  children,
  onPress,
  style,
  testID,
  tinted = false,
}: CardProps): React.JSX.Element => {
  const cardStyle = [styles.card, tinted ? styles.tinted : styles.plain, style];

  if (!onPress) {
    return (
      <View style={cardStyle} testID={testID}>
        {children}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [cardStyle, pressed && styles.pressed]}
      testID={testID}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.card,
    padding: spacing.md,
  },
  plain: {
    backgroundColor: colors.surface,
    borderColor: colors.hairline,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.85,
  },
  tinted: {
    backgroundColor: colors.brandTint,
  },
});
