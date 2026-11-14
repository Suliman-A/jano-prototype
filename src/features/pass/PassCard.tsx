/**
 * @fileoverview The check-in pass, pinned at the top of the Temple tab so it
 * is reachable from the front of the app, as the reference screens ask.
 */

import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { request } from '@/api/client';
import { Endpoint } from '@/api/endpoints';
import { booths, patient } from '@/api/mock/seed';
import { Card } from '@/components/atoms/Card';
import { Chip } from '@/components/atoms/Chip';
import { Text } from '@/components/atoms/Text';
import { AsyncState } from '@/components/molecules/AsyncState';
import type { Visit } from '@/core/types';
import { useQueryOnce } from '@/hooks/useQueryOnce';
import { colors, radii, spacing } from '@/theme';

const QR_SIZE = 108;

/**
 * Formats a slot time for display.
 * @param at - Epoch milliseconds.
 * @returns {string} - A time such as `11:30 AM`.
 */
const toTime = (at: number): string =>
  new Date(at).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

/**
 * Shows the QR for the next visit that has not been used yet.
 * @returns {React.JSX.Element | null} - The pass card, or nothing.
 */
export const PassCard = (): React.JSX.Element | null => {
  const visitsQuery = useQueryOnce<Visit[]>(() =>
    request(Endpoint.Visits, { patientId: patient.id }),
  );

  // A checked-in visit keeps the card, so the patient can still see where
  // they are mid-consultation rather than the app looking empty. Its code is
  // spent, so the QR is replaced by the check-in time.
  const upcoming = (visitsQuery.data ?? [])
    .filter(
      (visit) => visit.status === 'scheduled' || visit.status === 'checked_in',
    )
    .sort((a, b) => a.scheduledFor - b.scheduledFor)[0];

  const passQuery = useQueryOnce(
    () =>
      upcoming
        ? request(Endpoint.Pass, { visitId: upcoming.id })
        : Promise.resolve(null),
    [upcoming?.id],
  );

  if (visitsQuery.isLoading) {
    return <AsyncState isLoading />;
  }

  if (!upcoming || !passQuery.data) {
    return null;
  }

  const booth = booths.find((candidate) => candidate.id === upcoming.boothId);
  const isCheckedIn = upcoming.status === 'checked_in';

  return (
    <Card style={styles.card} testID="pass-card" tinted>
      <View style={styles.header}>
        <Text
          text={isCheckedIn ? 'Your visit' : 'Check in'}
          variant="sectionTitle"
        />
        <Chip
          text={isCheckedIn ? 'Checked in' : 'Demo pass'}
          tone={isCheckedIn ? 'success' : 'neutral'}
        />
      </View>

      <View style={styles.body}>
        {isCheckedIn ? (
          <View style={[styles.qr, styles.qrSpent]}>
            <Text text="✓" variant="hero" />
          </View>
        ) : (
          <View style={styles.qr}>
            <QRCode size={QR_SIZE} value={passQuery.data.code} />
          </View>
        )}

        <View style={styles.details}>
          <Text text={patient.name} variant="title" />
          <Text text={booth?.name ?? 'Temple'} variant="label" />
          <Text color="muted" text={booth?.area} variant="caption" />
          <View style={styles.time}>
            <Chip
              text={toTime(
                isCheckedIn && upcoming.checkedInAt
                  ? upcoming.checkedInAt
                  : upcoming.scheduledFor,
              )}
              tone="brand"
            />
            <Text
              color="muted"
              text={isCheckedIn ? 'Visit in progress' : 'Scan at the booth'}
              variant="caption"
            />
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  body: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  card: {
    gap: spacing.sm,
  },
  details: {
    flex: 1,
    gap: 2,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  qr: {
    backgroundColor: colors.surface,
    borderRadius: radii.input,
    padding: spacing.xs,
  },
  qrSpent: {
    alignItems: 'center',
    height: QR_SIZE + spacing.md,
    justifyContent: 'center',
    width: QR_SIZE + spacing.md,
  },
  time: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xxs,
  },
});
