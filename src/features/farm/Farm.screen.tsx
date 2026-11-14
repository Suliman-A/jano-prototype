/**
 * @fileoverview The Farm: one flower per health measurement.
 *
 * Tapping a flower opens its card in place in the grid, the way the reference
 * screens show it, rather than pushing a route or opening a sheet.
 */

import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { request } from '@/api/client';
import { Endpoint } from '@/api/endpoints';
import { patient } from '@/api/mock/seed';
import { Text } from '@/components/atoms/Text';
import { Screen } from '@/components/atoms/Screen';
import { AsyncState } from '@/components/molecules/AsyncState';
import type { MetricSeries } from '@/core/readings';
import type { MetricKey } from '@/core/types';
import { FlowerCard } from '@/features/farm/FlowerCard';
import { useQueryOnce } from '@/hooks/useQueryOnce';
import { colors, radii, spacing } from '@/theme';

const FLOWER_EMOJI: Record<MetricKey, string> = {
  blood_pressure: '🌺',
  body_fat: '💜',
  pulse: '🌷',
  spo2: '💠',
  temperature: '🌼',
  weight: '🌻',
};

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

      <View style={styles.grid}>
        {series.map((item) => {
          const isOpen = openKey === item.metric.key;

          return (
            <View
              key={item.metric.key}
              style={isOpen ? styles.fullWidth : styles.half}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: isOpen }}
                onPress={() =>
                  setOpenKey(isOpen ? null : (item.metric.key as MetricKey))
                }
                style={({ pressed }) => [
                  styles.tile,
                  isOpen && styles.tileOpen,
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
                  style={styles.centered}
                  text={item.metric.label}
                  variant="caption"
                />
              </Pressable>

              {isOpen ? <FlowerCard series={item} /> : null}
            </View>
          );
        })}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  centered: {
    textAlign: 'center',
  },
  emoji: {
    fontSize: 44,
    lineHeight: 52,
  },
  fullWidth: {
    gap: spacing.xs,
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  half: {
    flexGrow: 1,
    flexBasis: '45%',
  },
  pressed: {
    opacity: 0.7,
  },
  tile: {
    alignItems: 'center',
    borderRadius: radii.card,
    gap: spacing.xxs,
    paddingVertical: spacing.md,
  },
  tileOpen: {
    backgroundColor: colors.brandTint,
  },
});
