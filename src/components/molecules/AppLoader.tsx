/**
 * @fileoverview The one spinner.
 */

import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { colors, spacing } from '@/theme';

type AppLoaderProps = {
  text?: string;
};

/**
 * Shows that something is loading.
 * @param props - An optional message.
 * @returns {React.JSX.Element} - The loader.
 */
export const AppLoader = ({ text }: AppLoaderProps): React.JSX.Element => (
  <View accessibilityRole="progressbar" style={styles.root}>
    <ActivityIndicator color={colors.brand} />
    <Text color="muted" text={text} variant="caption" />
  </View>
);

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xl,
  },
});
