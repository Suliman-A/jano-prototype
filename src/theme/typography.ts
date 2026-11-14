/**
 * @fileoverview The type ramp. One named variant per role, so no screen sets a
 * font size by hand.
 */

import type { TextStyle } from 'react-native';

export const textVariants = {
  body: { fontSize: 15, fontWeight: '400', lineHeight: 21 },
  caption: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
  hero: { fontSize: 40, fontWeight: '700', lineHeight: 46 },
  label: { fontSize: 13, fontWeight: '600', lineHeight: 18 },
  screenTitle: { fontSize: 26, fontWeight: '700', lineHeight: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '700', lineHeight: 24 },
  tabLabel: { fontSize: 11, fontWeight: '600', lineHeight: 14 },
  title: { fontSize: 20, fontWeight: '700', lineHeight: 26 },
} satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof textVariants;
