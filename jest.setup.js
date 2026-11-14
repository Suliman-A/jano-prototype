/* eslint-disable @typescript-eslint/no-require-imports */

// Reanimated ships a Jest mock; gesture handler needs its own setup file.
require('react-native-gesture-handler/jestSetup');

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('expo-maps', () => ({
  AppleMaps: { View: 'AppleMaps.View' },
  GoogleMaps: { View: 'GoogleMaps.View' },
}));

jest.mock('react-native-safe-area-context', () => {
  const inset = { bottom: 0, left: 0, right: 0, top: 0 };

  return {
    SafeAreaProvider: ({ children }) => children,
    useSafeAreaFrame: () => ({ height: 852, width: 393, x: 0, y: 0 }),
    useSafeAreaInsets: () => inset,
  };
});
