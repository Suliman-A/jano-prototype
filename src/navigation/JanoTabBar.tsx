/**
 * @fileoverview The custom bottom navigation, matching the reference screens.
 *
 * Four circular tabs, not a row of equal ones: Me at the left and Jano at the
 * right sit a little higher than Farm and Temple in the middle. The active tab
 * is filled. Every circle is the same size whatever its state, so tapping a
 * tab never resizes anything and the row never shifts.
 *
 * Tapping Me does not navigate — it opens the Me menu over the current screen.
 */

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/atoms/Icon';
import type { IconName } from '@/components/atoms/iconRegistry';
import { Text } from '@/components/atoms/Text';
import { useMeMenu } from '@/navigation/MeMenuContext';
import { colors, layout, spacing } from '@/theme';

const LABELS: Record<string, string> = {
  FarmTab: 'Farm',
  JanoTab: 'Jano',
  MeTab: 'Me',
  TempleTab: 'Temple',
};

const ICONS: Record<string, IconName> = {
  FarmTab: 'tabFarm',
  JanoTab: 'tabJano',
  MeTab: 'tabMe',
  TempleTab: 'tabTemple',
};

type TabButtonProps = {
  isActive: boolean;
  /** Me and Jano sit a little above the two middle tabs. */
  isLifted?: boolean;
  onPress: () => void;
  routeName: string;
};

/**
 * One circular tab button. The active one grows and lifts.
 * @param props - Which route it is and whether it is active.
 * @returns {React.JSX.Element} - The button.
 */
const TabButton = ({
  isActive,
  isLifted = false,
  onPress,
  routeName,
}: TabButtonProps): React.JSX.Element => {
  const size = layout.tabButtonSize;

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
          borderRadius: size / 2,
          height: size,
          width: size,
        },
        isLifted && styles.lifted,
        pressed && styles.pressed,
      ]}
      testID={`tab-${routeName}`}
    >
      <Icon
        color={isActive ? 'onBrand' : 'brand'}
        name={ICONS[routeName]}
        size={22}
      />
      <Text
        color={isActive ? 'onBrand' : 'ink'}
        style={styles.label}
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

  const isMeActive = meMenu.isOpen || activeRouteName === 'MeTab';

  return (
    <View
      style={[styles.bar, { paddingBottom: insets.bottom || spacing.sm }]}
      testID="jano-tab-bar"
    >
      <View style={styles.row}>
        <TabButton
          isActive={isMeActive}
          isLifted
          onPress={() => meMenu.toggle()}
          routeName="MeTab"
        />

        <View style={styles.centre}>
          <TabButton
            isActive={!meMenu.isOpen && activeRouteName === 'FarmTab'}
            onPress={() => go('FarmTab', routeByName.FarmTab.key)}
            routeName="FarmTab"
          />
          <TabButton
            isActive={!meMenu.isOpen && activeRouteName === 'TempleTab'}
            onPress={() => go('TempleTab', routeByName.TempleTab.key)}
            routeName="TempleTab"
          />
        </View>

        <TabButton
          isActive={!meMenu.isOpen && activeRouteName === 'JanoTab'}
          isLifted
          onPress={() => go('JanoTab', routeByName.JanoTab.key)}
          routeName="JanoTab"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.background,
    paddingTop: spacing.xs,
  },
  button: {
    alignItems: 'center',
    gap: 2,
    justifyContent: 'center',
  },
  centre: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: spacing.xxl,
  },
  label: {
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  lifted: {
    // Me and Jano sit a little above the two middle tabs.
    marginBottom: spacing.xl,
  },
  row: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: layout.tabButtonSize + spacing.xl,
    paddingHorizontal: spacing.lg,
  },
});
