/**
 * @fileoverview The Me tab's stack. Only Consultation History is built.
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ConsultationHistoryScreen } from '@/features/me/ConsultationHistory.screen';
import type { MeStackParamList } from '@/navigation/types';

const Stack = createNativeStackNavigator<MeStackParamList>();

/**
 * The Me stack.
 * @returns {React.JSX.Element} - The navigator.
 */
export const MeStack = (): React.JSX.Element => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      component={ConsultationHistoryScreen}
      name="ConsultationHistory"
    />
  </Stack.Navigator>
);
