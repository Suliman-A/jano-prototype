/**
 * @fileoverview Every screen's outer wrapper: safe area, background, and
 * enough bottom padding to clear the custom tab bar.
 */

import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, layout, spacing } from '@/theme';

type ScreenProps = {
  children: React.ReactNode;
  /** Pinned above the scrolling content. */
  header?: React.ReactNode;
  isScrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Lays out a screen.
 * @param props - The content and whether it scrolls.
 * @returns {React.JSX.Element} - The screen.
 */
export const Screen = ({
  children,
  header,
  isScrollable = true,
  style,
  testID,
}: ScreenProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const paddingBottom = layout.tabBarHeight + insets.bottom + spacing.md;

  return (
    <View
      style={[styles.root, { paddingTop: insets.top + spacing.xs }]}
      testID={testID}
    >
      {header}
      {isScrollable ? (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom }, style]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.fill, { paddingBottom }, style]}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.xs,
  },
  fill: {
    flex: 1,
  },
  root: {
    backgroundColor: colors.background,
    flex: 1,
  },
});
