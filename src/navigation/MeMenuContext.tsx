/**
 * @fileoverview Holds whether the Me menu is open.
 *
 * It lives above the navigator rather than inside the tab bar, because the
 * menu covers the whole screen and the bar is only one strip of it.
 */

import { createContext, useContext, useMemo, useState } from 'react';

type MeMenuValue = {
  close: () => void;
  isOpen: boolean;
  open: () => void;
  toggle: () => void;
};

const MeMenuContext = createContext<MeMenuValue | null>(null);

/**
 * Provides the Me menu's open state to the tab bar and the overlay.
 * @param props - The tree the menu sits over.
 * @returns {React.JSX.Element} - The provider.
 */
export const MeMenuProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo<MeMenuValue>(
    () => ({
      close: () => setIsOpen(false),
      isOpen,
      open: () => setIsOpen(true),
      toggle: () => setIsOpen((current) => !current),
    }),
    [isOpen],
  );

  return (
    <MeMenuContext.Provider value={value}>{children}</MeMenuContext.Provider>
  );
};

/**
 * Reads the Me menu state.
 * @returns {MeMenuValue} - The open state and the ways to change it.
 */
export const useMeMenu = (): MeMenuValue => {
  const value = useContext(MeMenuContext);

  if (!value) {
    throw new Error('useMeMenu must be used inside a MeMenuProvider.');
  }

  return value;
};
