/**
 * @fileoverview The Temple tab's stack: the booth list, a booth, the pass, and
 * the booth simulator.
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BoothSimulatorScreen } from '@/features/booth/BoothSimulator.screen';
import { PassScreen } from '@/features/pass/Pass.screen';
import { BoothDetailScreen } from '@/features/temple/BoothDetail.screen';
import { TempleScreen } from '@/features/temple/Temple.screen';
import type { TempleStackParamList } from '@/navigation/types';

const Stack = createNativeStackNavigator<TempleStackParamList>();

/**
 * The Temple stack.
 * @returns {React.JSX.Element} - The navigator.
 */
export const TempleStack = (): React.JSX.Element => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen component={TempleScreen} name="Temple" />
    <Stack.Screen component={BoothDetailScreen} name="BoothDetail" />
    <Stack.Screen component={PassScreen} name="Pass" />
    <Stack.Screen component={BoothSimulatorScreen} name="BoothSimulator" />
  </Stack.Navigator>
);
