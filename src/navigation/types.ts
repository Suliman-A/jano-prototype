/**
 * @fileoverview Every route and its parameters, in one place.
 */

import type { NavigatorScreenParams } from '@react-navigation/native';

export type TempleStackParamList = {
  BoothDetail: { boothId: string };
  BoothSimulator: undefined;
  Pass: { visitId: string };
  Temple: undefined;
};

export type MeStackParamList = {
  ConsultationHistory: undefined;
};

export type RootTabParamList = {
  FarmTab: undefined;
  JanoTab: undefined;
  MeTab: NavigatorScreenParams<MeStackParamList>;
  TempleTab: NavigatorScreenParams<TempleStackParamList>;
};
