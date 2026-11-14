/**
 * @fileoverview The pass on its own screen, for holding up at the booth.
 */

import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/atoms/Screen';
import { Text } from '@/components/atoms/Text';
import { PassCard } from '@/features/pass/PassCard';
import { spacing } from '@/theme';

/**
 * The full-screen pass.
 * @returns {React.JSX.Element} - The screen.
 */
export const PassScreen = (): React.JSX.Element => (
  <Screen testID="pass-screen">
    <Text text="You're booked" variant="screenTitle" />
    <Text
      color="muted"
      text="Show this at the Temple to check in. It works once."
      variant="caption"
    />
    <View style={styles.spacer} />
    <PassCard />
  </Screen>
);

const styles = StyleSheet.create({
  spacer: {
    height: spacing.xs,
  },
});
