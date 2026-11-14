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
  /** Horizontal padding on every screen. */
  screenPadding: 20,
  /** How much vertical room the custom tab bar needs. */
  tabBarHeight: 148,
  /** Diameter of every tab button. They are all the same size. */
  tabButtonSize: 74,
} as const;
