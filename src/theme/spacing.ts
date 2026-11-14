/**
 * @fileoverview Spacing scale and the few fixed dimensions more than one
 * component depends on.
 */

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  huge: 40,
} as const;

export const layout = {
  /** Diameter of the raised tab button. */
  raisedTabSize: 68,
  /** Horizontal padding on every screen. */
  screenPadding: 20,
  /** Diameter of the small tab buttons. */
  tabButtonSize: 58,
  /** How much vertical room the custom tab bar needs. */
  tabBarHeight: 92,
} as const;
