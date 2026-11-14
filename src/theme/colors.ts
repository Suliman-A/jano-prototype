/**
 * @fileoverview The palette, taken from the Jano reference screens.
 */

export const colors = {
  /** Page background. */
  background: '#FFFFFF',
  /** The purple of the raised tab button and primary actions. */
  brand: '#5B4BD6',
  /** The pale lavender behind cards and inactive tab buttons. */
  brandTint: '#EFECFC',
  danger: '#CC2936',
  dangerTint: '#FDEDEE',
  /** Hairlines and dividers. */
  hairline: '#E6E3F0',
  /** Primary text. */
  ink: '#151224',
  /** Secondary text. */
  muted: '#6B6880',
  onBrand: '#FFFFFF',
  /** Card and sheet surfaces. */
  surface: '#FFFFFF',
  success: '#1F9D55',
  successTint: '#E8F6EE',
  warning: '#B45309',
  warningTint: '#FDF3E3',
} as const;

export type ColorName = keyof typeof colors;
