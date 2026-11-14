/**
 * @fileoverview Loading, failed and empty in one component.
 *
 * It renders nothing once there is data, so a screen puts it above its content
 * instead of branching around it, and all three states look the same
 * everywhere.
 */

import { AppLoader } from '@/components/molecules/AppLoader';
import { EmptyState } from '@/components/molecules/EmptyState';

type AsyncStateProps = {
  emptyMessage?: string;
  emptyTitle?: string;
  error?: Error | null;
  isEmpty?: boolean;
  isLoading: boolean;
  loadingText?: string;
  onRetry?: () => void;
};

/**
 * Renders whichever of the three states applies, or nothing.
 * @param props - The query's state.
 * @returns {React.JSX.Element | null} - The state, or nothing when there is data.
 */
export const AsyncState = ({
  emptyMessage,
  emptyTitle = 'Nothing here yet',
  error,
  isEmpty = false,
  isLoading,
  loadingText,
  onRetry,
}: AsyncStateProps): React.JSX.Element | null => {
  if (isLoading) {
    return <AppLoader text={loadingText} />;
  }

  if (error) {
    return (
      <EmptyState
        actionText={onRetry ? 'Try again' : undefined}
        icon="⚠️"
        message={error.message}
        onAction={onRetry}
        title="Something went wrong"
      />
    );
  }

  if (isEmpty) {
    return <EmptyState message={emptyMessage} title={emptyTitle} />;
  }

  return null;
};
