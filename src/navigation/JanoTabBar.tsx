/**
 * @fileoverview The custom bottom navigation.
 *
 * Not a row of equal tabs: Me sits bottom-left, Farm and Temple sit together
 * in the middle with the active one raised and filled, and Jano sits
 * bottom-right. The Jano wordmark sits behind them.
 *
 * Tapping Me does not navigate — it opens the Me menu over the current screen.
 */

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/atoms/Text';
import { useMeMenu } from '@/navigation/MeMenuContext';
import { colors, layout, radii, spacing } from '@/theme';

const LABELS: Record<string, string> = {
  FarmTab: 'Farm',
  JanoTab: 'Jano',
  MeTab: 'Me',
  TempleTab: 'Temple',
};

const ICONS: Record<string, string> = {
  FarmTab: '🌱',
  JanoTab: '💬',
  MeTab: '👤',
  TempleTab: '🏛',
};

type TabButtonProps = {
  isActive: boolean;
  isRaised?: boolean;
  onPress: () => void;
  routeName: string;
};

/**
 * One circular tab button.
 * @param props - Which route it is and whether it is active.
 * @returns {React.JSX.Element} - The button.
 */
const TabButton = ({
  isActive,
  isRaised = false,
  onPress,
  routeName,
}: TabButtonProps): React.JSX.Element => {
  const size =
    isActive && isRaised ? layout.raisedTabSize : layout.tabButtonSize;

  return (
    <Pressable
      accessibilityLabel={LABELS[routeName]}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isActive ? colors.brand : colors.brandTint,
          height: size,
          width: size,
        },
        isActive && isRaised && styles.raised,
        pressed && styles.pressed,
      ]}
      testID={`tab-${routeName}`}
    >
      <Text text={ICONS[routeName]} variant="label" />
      <Text
        color={isActive ? 'onBrand' : 'ink'}
        text={LABELS[routeName]}
        variant="tabLabel"
      />
    </Pressable>
  );
};

/**
 * Draws the whole bar.
 * @param props - The navigator's state and navigation object.
 * @returns {React.JSX.Element} - The tab bar.
 */
export const JanoTabBar = ({
  navigation,
  state,
}: BottomTabBarProps): React.JSX.Element => {
  const insets = useSafeAreaInsets();
  const meMenu = useMeMenu();
  const activeRouteName = state.routes[state.index].name;

  /**
   * Moves to a tab, popping its stack when it is already active.
   * @param routeName - Where to go.
   * @param routeKey - The route's key, for the tabPress event.
   */
  const go = (routeName: string, routeKey: string): void => {
    meMenu.close();

    const event = navigation.emit({
      canPreventDefault: true,
      target: routeKey,
      type: 'tabPress',
    });

    if (!event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  const routeByName = Object.fromEntries(
    state.routes.map((route) => [route.name, route]),
  );

  return (
    <View
      style={[styles.bar, { paddingBottom: insets.bottom || spacing.sm }]}
      testID="jano-tab-bar"
    >
      <Text color="brand" style={styles.wordmark} text="Jano" variant="title" />

      <TabButton
        isActive={meMenu.isOpen || activeRouteName === 'MeTab'}
        onPress={() => meMenu.toggle()}
        routeName="MeTab"
      />

      <View style={styles.centre}>
        <TabButton
          isActive={!meMenu.isOpen && activeRouteName === 'FarmTab'}
          isRaised
          onPress={() => go('FarmTab', routeByName.FarmTab.key)}
          routeName="FarmTab"
        />
        <TabButton
          isActive={!meMenu.isOpen && activeRouteName === 'TempleTab'}
          isRaised
          onPress={() => go('TempleTab', routeByName.TempleTab.key)}
          routeName="TempleTab"
        />
      </View>

      <TabButton
        isActive={!meMenu.isOpen && activeRouteName === 'JanoTab'}
        onPress={() => go('JanoTab', routeByName.JanoTab.key)}
        routeName="JanoTab"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    alignItems: 'flex-end',
    backgroundColor: colors.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'visible',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  button: {
    alignItems: 'center',
    borderRadius: radii.pill,
    gap: 1,
    justifyContent: 'center',
  },
  centre: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: spacing.xxs,
  },
  pressed: {
    opacity: 0.8,
  },
  raised: {
    marginBottom: spacing.md,
  },
  wordmark: {
    left: 0,
    position: 'absolute',
    right: 0,
    textAlign: 'center',
    top: spacing.xs,
  },
});
