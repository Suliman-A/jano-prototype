/**
 * @fileoverview The four tabs, drawn by the custom bar.
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { FarmScreen } from '@/features/farm/Farm.screen';
import { JanoScreen } from '@/features/jano/Jano.screen';
import { MeStack } from '@/navigation/Me.stack';
import { JanoTabBar } from '@/navigation/JanoTabBar';
import { TempleStack } from '@/navigation/Temple.stack';
import type { RootTabParamList } from '@/navigation/types';

const Tab = createBottomTabNavigator<RootTabParamList>();

/**
 * The tab navigator.
 * @returns {React.JSX.Element} - The navigator.
 */
export const TabNavigator = (): React.JSX.Element => (
  <Tab.Navigator
    initialRouteName="FarmTab"
    screenOptions={{ headerShown: false }}
    tabBar={(props) => <JanoTabBar {...props} />}
  >
    <Tab.Screen component={MeStack} name="MeTab" />
    <Tab.Screen component={FarmScreen} name="FarmTab" />
    <Tab.Screen component={TempleStack} name="TempleTab" />
    <Tab.Screen component={JanoScreen} name="JanoTab" />
  </Tab.Navigator>
);
