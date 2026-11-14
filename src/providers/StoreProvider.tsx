/**
 * @fileoverview Points the store at device storage and holds the app back
 * until anything saved has been loaded.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import { configureStore, ready } from '@/api/mock/store';

configureStore({
  storage: {
    getItem: (key) => AsyncStorage.getItem(key),
    setItem: (key, value) => AsyncStorage.setItem(key, value),
  },
});

/**
 * Renders its children once the saved state is in memory.
 * @param props - The app tree.
 * @returns {React.JSX.Element | null} - The tree, or nothing while loading.
 */
export const StoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element | null => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    ready().finally(() => {
      if (isCurrent) {
        setIsReady(true);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, []);

  return isReady ? <>{children}</> : null;
};
