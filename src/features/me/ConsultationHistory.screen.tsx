/**
 * @fileoverview Every visit the patient has completed, with what was measured.
 */

import { StyleSheet, View } from 'react-native';

import { request } from '@/api/client';
import { Endpoint } from '@/api/endpoints';
import { booths, metrics, patient } from '@/api/mock/seed';
import { Card } from '@/components/atoms/Card';
import { Chip } from '@/components/atoms/Chip';
import { Screen } from '@/components/atoms/Screen';
import { Text } from '@/components/atoms/Text';
import { AsyncState } from '@/components/molecules/AsyncState';
import type { Visit, VisitReading } from '@/core/types';
import { useQueryOnce } from '@/hooks/useQueryOnce';
import { spacing } from '@/theme';

const STATUS_TONE = {
  cancelled: 'neutral',
  checked_in: 'brand',
  completed: 'success',
  no_show: 'warning',
  scheduled: 'brand',
} as const;

const STATUS_TEXT = {
  cancelled: 'Cancelled',
  checked_in: 'In progress',
  completed: 'Completed',
  no_show: 'Missed',
  scheduled: 'Upcoming',
} as const;

/**
 * Renders one measurement line.
 * @param props - The reading to show.
 * @returns {React.JSX.Element} - The row.
 */
const ReadingRow = ({
  reading,
}: {
  reading: VisitReading;
}): React.JSX.Element => {
  const metric = metrics.find(
    (candidate) => candidate.key === reading.metricKey,
  );
  const value =
    typeof reading.systolic === 'number'
      ? `${reading.systolic}/${reading.diastolic}`
      : String(reading.value ?? '—');

  return (
    <View style={styles.readingRow}>
      <Text
        color="muted"
        text={metric?.label ?? reading.metricKey}
        variant="caption"
      />
      <Text text={`${value} ${metric?.unit ?? ''}`} variant="caption" />
    </View>
  );
};

/**
 * The consultation history screen.
 * @returns {React.JSX.Element} - The screen.
 */
export const ConsultationHistoryScreen = (): React.JSX.Element => {
  const { data, error, isLoading, refetch } = useQueryOnce<Visit[]>(() =>
    request(Endpoint.Visits, { patientId: patient.id }),
  );

  const visits = data ?? [];

  return (
    <Screen testID="consultation-history-screen">
      <Text text="Consultation History" variant="screenTitle" />

      <AsyncState
        emptyMessage="Book a visit at a Temple and it will appear here."
        emptyTitle="No consultations yet"
        error={error}
        isEmpty={visits.length === 0}
        isLoading={isLoading}
        loadingText="Loading your visits…"
        onRetry={refetch}
      />

      {visits.map((visit) => {
        const booth = booths.find(
          (candidate) => candidate.id === visit.boothId,
        );

        return (
          <Card key={visit.id} style={styles.card} testID={`visit-${visit.id}`}>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text text={booth?.name ?? 'Temple'} variant="label" />
                <Text
                  color="muted"
                  text={new Date(visit.scheduledFor).toLocaleString('en-US', {
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    month: 'short',
                  })}
                  variant="caption"
                />
              </View>
              <Chip
                text={STATUS_TEXT[visit.status]}
                tone={STATUS_TONE[visit.status]}
              />
            </View>

            {visit.readings.length > 0 ? (
              <View style={styles.readings}>
                {visit.readings.map((reading, index) => (
                  <ReadingRow
                    key={`${reading.metricKey}-${index}`}
                    reading={reading}
                  />
                ))}
              </View>
            ) : (
              <Text
                color="muted"
                text="No measurements recorded."
                variant="caption"
              />
            )}
          </Card>
        );
      })}
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: spacing.xs,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  readingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  readings: {
    gap: 2,
  },
});
