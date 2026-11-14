/**
 * @fileoverview Draws an icon from the registry.
 */

import { colors, type ColorName } from '@/theme';

import { type IconName, iconRegistry } from './iconRegistry';

type IconProps = {
  color?: ColorName;
  name: IconName;
  size?: number;
  strokeWidth?: number;
};

/**
 * Renders one icon.
 * @param props - Which icon, at what size and colour.
 * @returns {React.JSX.Element} - The icon.
 */
export const Icon = ({
  color = 'ink',
  name,
  size = 22,
  strokeWidth = 1.8,
}: IconProps): React.JSX.Element => {
  const Glyph = iconRegistry[name];

  return <Glyph color={colors[color]} size={size} strokeWidth={strokeWidth} />;
};
