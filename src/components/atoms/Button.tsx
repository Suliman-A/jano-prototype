/**
 * @fileoverview The app's button.
 */

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Text } from '@/components/atoms/Text';
import { colors, radii, spacing } from '@/theme';

type ButtonVariant = 'ghost' | 'primary' | 'secondary';

type ButtonProps = {
  disabled?: boolean;
  isLoading?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  text: string;
  variant?: ButtonVariant;
};

const BACKGROUNDS: Record<ButtonVariant, string> = {
  ghost: 'transparent',
  primary: colors.brand,
  secondary: colors.brandTint,
};

const LABEL_COLORS: Record<ButtonVariant, 'brand' | 'onBrand'> = {
  ghost: 'brand',
  primary: 'onBrand',
  secondary: 'brand',
};

/**
 * A full-width pill button.
 * @param props - The label, the press handler and the variant.
 * @returns {React.JSX.Element} - The button.
 */
export const Button = ({
  disabled = false,
  isLoading = false,
  onPress,
  style,
  testID,
  text,
  variant = 'primary',
}: ButtonProps): React.JSX.Element => {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: BACKGROUNDS[variant] },
        isDisabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
      testID={testID}
    >
      {isLoading ? (
        <ActivityIndicator color={colors[LABEL_COLORS[variant]]} />
      ) : (
        <Text color={LABEL_COLORS[variant]} text={text} variant="label" />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radii.pill,
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: spacing.lg,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.75,
  },
});
