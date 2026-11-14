/**
 * @fileoverview The history chart on a flower card, drawn by hand with SVG.
 *
 * A reading the booth failed to take is a gap: the line breaks and no dot is
 * drawn, rather than the value being flattened to zero.
 */

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Polyline, Text as SvgText } from 'react-native-svg';

import { Text } from '@/components/atoms/Text';
import { colors, radii, spacing } from '@/theme';

export type ChartPoint = {
  label: string;
  value: number | null;
};

type LineChartProps = {
  points: ChartPoint[];
  /** A second line, for the two numbers of a blood pressure reading. */
  secondary?: ChartPoint[];
};

const CHART_HEIGHT = 110;
const PADDING_X = 18;
const PADDING_Y = 22;
const DOT_RADIUS = 3.5;

/**
 * Splits a line into the runs of points that actually have values, so a gap
 * stays a gap.
 * @param coordinates - Every point, with `null` where nothing was measured.
 * @returns {{ x: number; y: number }[][]} - One run per unbroken stretch.
 */
const toSegments = (
  coordinates: ({ x: number; y: number } | null)[],
): { x: number; y: number }[][] =>
  coordinates.reduce<{ x: number; y: number }[][]>(
    (segments, point) => {
      if (!point) {
        return [...segments, []];
      }

      const head = segments.slice(0, -1);
      const tail = segments[segments.length - 1] ?? [];

      return [...head, [...tail, point]];
    },
    [[]],
  );

/**
 * Draws a small line chart of a metric's history.
 * @param props - The points to draw, and an optional second line.
 * @returns {React.JSX.Element} - The chart.
 */
export const LineChart = ({
  points,
  secondary,
}: LineChartProps): React.JSX.Element => {
  const [width, setWidth] = useState(0);

  const allValues = [...points, ...(secondary ?? [])]
    .map((point) => point.value)
    .filter((value): value is number => typeof value === 'number');

  if (allValues.length === 0) {
    return (
      <View style={styles.empty}>
        <Text color="muted" text="No readings yet" variant="caption" />
      </View>
    );
  }

  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const span = max - min || 1;
  const innerWidth = Math.max(width - PADDING_X * 2, 1);
  const innerHeight = CHART_HEIGHT - PADDING_Y * 2;

  /**
   * Places one reading on the canvas.
   * @param value - The measured value, or null.
   * @param index - Its position in the series.
   * @returns {{ x: number; y: number } | null} - The coordinates, or null.
   */
  const toCoordinate = (
    value: number | null,
    index: number,
  ): { x: number; y: number } | null => {
    if (typeof value !== 'number') {
      return null;
    }

    const step = points.length > 1 ? innerWidth / (points.length - 1) : 0;

    return {
      x: PADDING_X + index * step,
      y: PADDING_Y + innerHeight - ((value - min) / span) * innerHeight,
    };
  };

  const lines = [points, secondary ?? []].filter((line) => line.length > 0);

  return (
    <View
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={styles.root}
    >
      {width > 0 ? (
        <Svg height={CHART_HEIGHT} width={width}>
          {lines.map((line, lineIndex) => {
            const coordinates = line.map((point, index) =>
              toCoordinate(point.value, index),
            );
            const stroke = lineIndex === 0 ? colors.brand : colors.muted;

            return (
              <React.Fragment key={`line-${lineIndex}`}>
                {toSegments(coordinates)
                  .filter((segment) => segment.length > 1)
                  .map((segment, segmentIndex) => (
                    <Polyline
                      fill="none"
                      key={`segment-${lineIndex}-${segmentIndex}`}
                      points={segment
                        .map((point) => `${point.x},${point.y}`)
                        .join(' ')}
                      stroke={stroke}
                      strokeLinecap="round"
                      strokeWidth={2}
                    />
                  ))}
                {coordinates.map((coordinate, index) =>
                  coordinate ? (
                    <React.Fragment key={`dot-${lineIndex}-${index}`}>
                      <Circle
                        cx={coordinate.x}
                        cy={coordinate.y}
                        fill={stroke}
                        r={DOT_RADIUS}
                      />
                      <SvgText
                        fill={colors.ink}
                        fontSize={10}
                        textAnchor="middle"
                        x={coordinate.x}
                        y={coordinate.y - 8}
                      >
                        {String(line[index].value)}
                      </SvgText>
                    </React.Fragment>
                  ) : null,
                )}
              </React.Fragment>
            );
          })}
        </Svg>
      ) : null}
      <View style={styles.labels}>
        {points.map((point) => (
          <Text
            color="muted"
            key={point.label}
            style={styles.label}
            text={point.label}
            variant="caption"
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.input,
    paddingVertical: spacing.lg,
  },
  label: {
    flex: 1,
    fontSize: 10,
    textAlign: 'center',
  },
  labels: {
    flexDirection: 'row',
    marginTop: spacing.xxs,
  },
  root: {
    backgroundColor: colors.surface,
    borderRadius: radii.input,
    paddingVertical: spacing.xs,
  },
});
