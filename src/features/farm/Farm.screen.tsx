/**
 * @fileoverview The Farm: one flower per health measurement.
 *
 * A plain two-column grid, three rows of two. Tapping a flower opens its card
 * full width directly beneath that row, the way the reference screen shows it,
 * rather than pushing a route or opening a sheet.
 */

import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { request } from '@/api/client';
import { Endpoint } from '@/api/endpoints';
import { patient } from '@/api/mock/seed';
import { Screen } from '@/components/atoms/Screen';
import { Text } from '@/components/atoms/Text';
import { AsyncState } from '@/components/molecules/AsyncState';
import type { MetricSeries } from '@/core/readings';
import type { MetricKey } from '@/core/types';
import { FlowerCard } from '@/features/farm/FlowerCard';
import { useQueryOnce } from '@/hooks/useQueryOnce';
import { spacing } from '@/theme';

const COLUMNS = 2;

const FLOWER_EMOJI: Record<MetricKey, string> = {
  blood_pressure: '🌺',
  body_fat: '💜',
  pulse: '🌷',
  spo2: '💠',
  temperature: '🌼',
  weight: '🌻',
};

/**
 * Splits the metrics into rows of two, so the grid stays square however many
 * metrics the backend returns.
 * @param series - Every metric series.
 * @returns {MetricSeries[][]} - The rows.
 */
const toRows = (series: MetricSeries[]): MetricSeries[][] =>
  series.reduce<MetricSeries[][]>((rows, item, index) => {
    if (index % COLUMNS === 0) {
      return [...rows, [item]];
    }

    return [...rows.slice(0, -1), [...rows[rows.length - 1], item]];
  }, []);

/**
 * The Farm screen.
 * @returns {React.JSX.Element} - The screen.
 */
export const FarmScreen = (): React.JSX.Element => {
  const [openKey, setOpenKey] = useState<MetricKey | null>(null);

  const { data, error, isLoading, refetch } = useQueryOnce<MetricSeries[]>(() =>
    request(Endpoint.Farm, { patientId: patient.id }),
  );

  const series = data ?? [];
  const rows = toRows(series);

  return (
    <Screen testID="farm-screen">
      <Text text="Your Farm" variant="screenTitle" />
      <Text
        color="muted"
        text={`${patient.name} · each flower is one measurement`}
        variant="caption"
      />

      <AsyncState
        emptyMessage="Your measurements will appear here after your first visit."
        emptyTitle="No flowers yet"
        error={error}
        isEmpty={series.length === 0}
        isLoading={isLoading}
        loadingText="Growing your farm…"
        onRetry={refetch}
      />

      {rows.map((row) => {
        const openInRow = row.find((item) => item.metric.key === openKey);

        return (
          <View key={row[0].metric.key} style={styles.rowGroup}>
            <View style={styles.row}>
              {row.map((item) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{
                    expanded: item.metric.key === openKey,
                  }}
                  key={item.metric.key}
                  onPress={() =>
                    setOpenKey(
                      item.metric.key === openKey ? null : item.metric.key,
                    )
                  }
                  style={({ pressed }) => [
                    styles.tile,
                    pressed && styles.pressed,
                  ]}
                  testID={`flower-${item.metric.key}`}
                >
                  <Text
                    style={styles.emoji}
                    text={FLOWER_EMOJI[item.metric.key]}
                  />
                  <Text text={item.metric.flower} variant="sectionTitle" />
                  <Text
                    color="muted"
                    style={styles.centred}
                    text={item.metric.label}
                    variant="caption"
                  />
                </Pressable>
              ))}

              {row.length < COLUMNS ? <View style={styles.tile} /> : null}
            </View>

            {openInRow ? <FlowerCard series={openInRow} /> : null}
          </View>
        );
      })}
    </Screen>
  );
};

const styles = StyleSheet.create({
  centred: {
    textAlign: 'center',
  },
  emoji: {
    fontSize: 48,
    lineHeight: 58,
  },
  pressed: {
    opacity: 0.7,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rowGroup: {
    gap: spacing.sm,
  },
  tile: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.xxs,
    paddingVertical: spacing.sm,
  },
});
