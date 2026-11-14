/**
 * @fileoverview Shown when there is nothing to show, or something went wrong.
 */

import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { colors, radii, spacing } from '@/theme';

type EmptyStateProps = {
  actionText?: string;
  icon?: string;
  message?: string;
  onAction?: () => void;
  title: string;
};

/**
 * An icon, a line of explanation and an optional way out.
 * @param props - What to say and what the patient can do about it.
 * @returns {React.JSX.Element} - The empty state.
 */
export const EmptyState = ({
  actionText,
  icon = '🌱',
  message,
  onAction,
  title,
}: EmptyStateProps): React.JSX.Element => (
  <View style={styles.root}>
    <View style={styles.disc}>
      <Text text={icon} variant="title" />
    </View>
    <Text style={styles.centered} text={title} variant="sectionTitle" />
    <Text
      color="muted"
      style={styles.centered}
      text={message}
      variant="caption"
    />
    {actionText && onAction ? (
      <Button
        onPress={onAction}
        style={styles.action}
        text={actionText}
        variant="secondary"
      />
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  action: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xl,
  },
  centered: {
    textAlign: 'center',
  },
  disc: {
    alignItems: 'center',
    backgroundColor: colors.brandTint,
    borderRadius: radii.pill,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  root: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xl,
  },
});
