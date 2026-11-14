/**
 * @fileoverview The card that opens in place when a flower is tapped.
 *
 * It shows the latest value, whether that sits in the typical range, the
 * one-line explanation, and the history as a chart.
 */

import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Card } from '@/components/atoms/Card';
import { Chip } from '@/components/atoms/Chip';
import { Text } from '@/components/atoms/Text';
import { type ChartPoint, LineChart } from '@/components/molecules/LineChart';
import type { Status } from '@/core/rangeStatus';
import type { MetricSeries } from '@/core/readings';
import { spacing } from '@/theme';

type FlowerCardProps = {
  series: MetricSeries;
};

const STATUS_TEXT: Record<Status, string> = {
  above: 'Above typical range',
  below: 'Below typical range',
  in: 'In typical range',
  none: 'No typical range',
};

const STATUS_TONE: Record<Status, 'brand' | 'neutral' | 'success' | 'warning'> =
  {
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
 * Reads the headline number out of a reading.
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

  return (
    <Animated.View entering={FadeIn.duration(180)}>
      <Card
        style={styles.card}
        testID={`flower-card-${series.metric.key}`}
        tinted
      >
        <Text color="brand" text={series.metric.flower} variant="label" />
        <Text text={series.metric.label} variant="title" />

        <View style={styles.headline}>
          <Text text={headlineValue(series)} variant="hero" />
          <Text color="muted" text={series.metric.unit} variant="body" />
          <Chip
            style={styles.status}
            text={STATUS_TEXT[series.status]}
            tone={STATUS_TONE[series.status]}
          />
        </View>

        <Text color="muted" text={series.metric.explain} variant="caption" />

        <Text
          style={styles.chartTitle}
          text="Consultation history"
          variant="label"
        />
        <LineChart points={points} secondary={secondary} />
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: spacing.xs,
  },
  chartTitle: {
    marginTop: spacing.xs,
  },
  headline: {
    alignItems: 'baseline',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  status: {
    marginLeft: 'auto',
  },
});
