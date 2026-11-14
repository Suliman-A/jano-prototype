/**
 * @fileoverview Lets the Me menu navigate without being inside a screen.
 */

import { createNavigationContainerRef } from '@react-navigation/native';

import type { RootTabParamList } from '@/navigation/types';

export const navigationRef = createNavigationContainerRef<RootTabParamList>();
