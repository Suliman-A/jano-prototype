/**
 * @fileoverview The card that opens when a flower is tapped, laid out like the
 * reference screen: the flower's name, the measurement, the latest value with
 * its range pill and visit date, a one-line explanation, then the history
 * chart in its own white panel.
 */

import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Chip } from '@/components/atoms/Chip';
import { Text } from '@/components/atoms/Text';
import { type ChartPoint, LineChart } from '@/components/molecules/LineChart';
import type { Status } from '@/core/rangeStatus';
import type { MetricSeries } from '@/core/readings';
import { colors, radii, spacing } from '@/theme';

type FlowerCardProps = {
  series: MetricSeries;
};

const STATUS_TEXT: Record<Status, string> = {
  above: 'Above typical range',
  below: 'Below typical range',
  in: 'In typical range',
  none: 'No typical range',
};

const STATUS_TONE: Record<Status, 'neutral' | 'success' | 'warning'> = {
  above: 'warning',
  below: 'warning',
  in: 'success',
  none: 'neutral',
};

/**
 * Formats a date like `2026-10-29` as `Oct 29`.
 * @param date - An ISO date.
 * @returns {string} - A short label.
 */
const toShortDate = (date: string): string =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });

/**
 * Reads the headline number out of the latest reading.
 * @param series - The metric's series.
 * @returns {string} - The value to display, or a dash.
 */
const headlineValue = (series: MetricSeries): string => {
  const latest = series.latest;

  if (!latest) {
    return '—';
  }

  if (typeof latest.systolic === 'number') {
    return `${latest.systolic}/${latest.diastolic}`;
  }

  return String(latest.value);
};

/**
 * The expanded measurement card.
 * @param props - The metric's assembled series.
 * @returns {React.JSX.Element} - The card.
 */
export const FlowerCard = ({ series }: FlowerCardProps): React.JSX.Element => {
  const isBloodPressure = series.metric.key === 'blood_pressure';

  const points: ChartPoint[] = series.history.map((reading) => ({
    label: toShortDate(reading.date),
    value: isBloodPressure
      ? (reading.systolic ?? null)
      : (reading.value ?? null),
  }));

  const secondary: ChartPoint[] | undefined = isBloodPressure
    ? series.history.map((reading) => ({
        label: toShortDate(reading.date),
        value: reading.diastolic ?? null,
      }))
    : undefined;

  const year = series.latest
    ? new Date(`${series.latest.date}T00:00:00`).getFullYear()
    : undefined;

  return (
    <Animated.View
      entering={FadeIn.duration(180)}
      style={styles.card}
      testID={`flower-card-${series.metric.key}`}
    >
      <View style={styles.header}>
        <Text color="brand" text={series.metric.flower} variant="label" />
        <Chip text="Sample data" tone="neutral" />
      </View>

      <Text text={series.metric.label} variant="title" />

      <View style={styles.headline}>
        <Text
          style={styles.value}
          text={headlineValue(series)}
          variant="hero"
        />
        <Text color="muted" style={styles.unit} text={series.metric.unit} />
        <Chip
          text={STATUS_TEXT[series.status]}
          tone={STATUS_TONE[series.status]}
        />
        {series.latest ? (
          <Text
            color="muted"
            text={`${toShortDate(series.latest.date)} visit`}
            variant="caption"
          />
        ) : null}
      </View>

      <Text color="muted" text={series.metric.explain} variant="caption" />

      <View style={styles.chartHeader}>
        <Text text="Consultation history" variant="label" />
        <Text
          color="muted"
          text={year ? String(year) : undefined}
          variant="caption"
        />
      </View>

      <LineChart points={points} secondary={secondary} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.brandTint,
    borderRadius: radii.card,
    gap: spacing.xs,
    padding: spacing.md,
  },
  chartHeader: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xxs,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headline: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  unit: {
    marginLeft: -spacing.xxs,
  },
  value: {
    color: colors.brand,
  },
});
