/**
 * @fileoverview The Temple tab's stack: the booth list, a booth, the pass, and
 * the booth simulator.
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { colors } from '@/theme';

import { BoothSimulatorScreen } from '@/features/booth/BoothSimulator.screen';
import { PassScreen } from '@/features/pass/Pass.screen';
import { BoothDetailScreen } from '@/features/temple/BoothDetail.screen';
import { TempleScreen } from '@/features/temple/Temple.screen';
import type { TempleStackParamList } from '@/navigation/types';

const Stack = createNativeStackNavigator<TempleStackParamList>();

/** A back chevron and nothing else, so the screen draws its own title. */
const subScreenOptions = {
  headerBackTitle: '',
  headerShadowVisible: false,
  headerShown: true,
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.ink,
  headerTitle: '',
} as const;

/**
 * The Temple stack.
 * @returns {React.JSX.Element} - The navigator.
 */
export const TempleStack = (): React.JSX.Element => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen component={TempleScreen} name="Temple" />
    {/* The screens pushed on top get a plain back chevron, so there is always
        a way out of them. */}
    <Stack.Screen
      component={BoothDetailScreen}
      name="BoothDetail"
      options={subScreenOptions}
    />
    <Stack.Screen
      component={PassScreen}
      name="Pass"
      options={subScreenOptions}
    />
    <Stack.Screen
      component={BoothSimulatorScreen}
      name="BoothSimulator"
      options={subScreenOptions}
    />
  </Stack.Navigator>
);
