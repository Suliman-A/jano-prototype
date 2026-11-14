/**
 * @fileoverview The app root.
 *
 * The Me menu sits above the navigator rather than inside it, because it
 * covers the whole screen including the tab bar.
 */

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';

import { MeMenu } from '@/features/me/MeMenu';
import { MeMenuProvider } from '@/navigation/MeMenuContext';
import { navigationRef } from '@/navigation/navigationRef';
import { TabNavigator } from '@/navigation/Tab.navigator';
import { StoreProvider } from '@/providers/StoreProvider';

/**
 * The app.
 * @returns {React.JSX.Element} - The whole tree.
 */
const App = (): React.JSX.Element => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <StoreProvider>
        <MeMenuProvider>
          <NavigationContainer ref={navigationRef}>
            <StatusBar style="dark" />
            <TabNavigator />
            <MeMenu />
          </NavigationContainer>
        </MeMenuProvider>
      </StoreProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
);

export default App;
