/**
 * @fileoverview The Me menu.
 *
 * Tapping Me does not open a screen. The current screen fades out behind a
 * white scrim and five rows rise into place from the bottom, one after
 * another, over the tab bar's Me button.
 */

import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/atoms/Text';
import { useMeMenu } from '@/navigation/MeMenuContext';
import { navigationRef } from '@/navigation/navigationRef';
import { colors, layout, radii, spacing } from '@/theme';

type MenuItem = {
  icon: string;
  isAvailable: boolean;
  label: string;
};

const ITEMS: MenuItem[] = [
  { icon: '💊', isAvailable: false, label: 'Prescriptions' },
  { icon: '🕘', isAvailable: true, label: 'Consultation History' },
  { icon: '📋', isAvailable: false, label: 'Patient Profile & Health History' },
  {
    icon: '🖨',
    isAvailable: false,
    label: 'Digitize My Prescription & Results',
  },
  { icon: '⚙️', isAvailable: false, label: 'Settings' },
];

const STAGGER_MS = 45;

/**
 * The menu that expands upward over a faded view of the current screen.
 * @returns {React.JSX.Element | null} - The menu, or nothing when closed.
 */
export const MeMenu = (): React.JSX.Element | null => {
  const { close, isOpen } = useMeMenu();
  const insets = useSafeAreaInsets();

  if (!isOpen) {
    return null;
  }

  /**
   * Opens Consultation History, which is the one item that works.
   */
  const openHistory = (): void => {
    close();

    if (navigationRef.isReady()) {
      navigationRef.navigate('MeTab', { screen: 'ConsultationHistory' });
    }
  };

  return (
    <Animated.View
      entering={FadeIn.duration(140)}
      exiting={FadeOut.duration(120)}
      style={StyleSheet.absoluteFill}
      testID="me-menu"
    >
      <Pressable
        accessibilityLabel="Close menu"
        accessibilityRole="button"
        onPress={close}
        style={[StyleSheet.absoluteFill, styles.scrim]}
      />

      <View
        style={[
          styles.items,
          { bottom: layout.tabBarHeight + insets.bottom + spacing.md },
        ]}
      >
        {ITEMS.map((item, index) => (
          <Animated.View
            entering={FadeInDown.delay(index * STAGGER_MS).duration(220)}
            key={item.label}
          >
            <Pressable
              accessibilityRole="button"
              disabled={!item.isAvailable}
              onPress={item.isAvailable ? openHistory : undefined}
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
              testID={`me-menu-${item.label}`}
            >
              <View style={styles.disc}>
                <Text text={item.icon} variant="body" />
              </View>
              <Text
                color={item.isAvailable ? 'ink' : 'muted'}
                style={styles.label}
                text={item.label}
                variant="sectionTitle"
              />
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  disc: {
    alignItems: 'center',
    backgroundColor: colors.brandTint,
    borderRadius: radii.pill,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  items: {
    gap: spacing.sm,
    left: spacing.lg,
    position: 'absolute',
    right: spacing.lg,
  },
  label: {
    flex: 1,
  },
  pressed: {
    opacity: 0.6,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  scrim: {
    // The reference screens fade to white, not to black.
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});
