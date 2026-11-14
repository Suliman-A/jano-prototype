/**
 * @fileoverview A small pill, used both as a status badge and as a filter.
 */

import {
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Text } from '@/components/atoms/Text';
import { colors, type ColorName, radii, spacing } from '@/theme';

type ChipTone = 'brand' | 'danger' | 'neutral' | 'success' | 'warning';

type ChipProps = {
  isSelected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  text: string;
  tone?: ChipTone;
};

const TONE_BACKGROUND: Record<ChipTone, string> = {
  brand: colors.brandTint,
  danger: colors.dangerTint,
  neutral: colors.brandTint,
  success: colors.successTint,
  warning: colors.warningTint,
};

const TONE_LABEL: Record<ChipTone, ColorName> = {
  brand: 'brand',
  danger: 'danger',
  neutral: 'muted',
  success: 'success',
  warning: 'warning',
};

/**
 * A pill of text, optionally selectable.
 * @param props - The label, tone and selection state.
 * @returns {React.JSX.Element} - The chip.
 */
export const Chip = ({
  isSelected = false,
  onPress,
  style,
  testID,
  text,
  tone = 'neutral',
}: ChipProps): React.JSX.Element => (
  <Pressable
    accessibilityRole={onPress ? 'button' : undefined}
    accessibilityState={onPress ? { selected: isSelected } : undefined}
    disabled={!onPress}
    onPress={onPress}
    style={[
      styles.chip,
      { backgroundColor: TONE_BACKGROUND[tone] },
      isSelected && styles.selected,
      style,
    ]}
    testID={testID}
  >
    <Text
      color={isSelected ? 'onBrand' : TONE_LABEL[tone]}
      text={text}
      variant="label"
    />
  </Pressable>
);

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    borderRadius: radii.pill,
    flexDirection: 'row',
    gap: spacing.xxs,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  selected: {
    backgroundColor: colors.brand,
  },
});
