/**
 * @fileoverview A placeholder for the Jano assistant, which is out of scope.
 */

import { Screen } from '@/components/atoms/Screen';
import { EmptyState } from '@/components/molecules/EmptyState';
import { Text } from '@/components/atoms/Text';

/**
 * The Jano placeholder screen.
 * @returns {React.JSX.Element} - The screen.
 */
export const JanoScreen = (): React.JSX.Element => (
  <Screen testID="jano-screen">
    <Text text="Jano" variant="screenTitle" />
    <EmptyState
      icon="💬"
      message="Asking Jano a question is outside this prototype."
      title="Coming soon"
    />
  </Screen>
);
