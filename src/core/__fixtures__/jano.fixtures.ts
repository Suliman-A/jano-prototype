/**
 * @fileoverview Shared test fixtures and factories for the rules layer.
 * One module per project, per the test protocol.
 */

import type { Reading, Typical } from '@/core/rangeStatus';

export const DATE_AUGUST = '2026-08-06';
export const DATE_SEPTEMBER = '2026-09-17';
export const DATE_OCTOBER = '2026-10-29';

export const PULSE_MIN = 60;
export const PULSE_MAX = 100;
export const SYSTOLIC_BELOW = 120;
export const DIASTOLIC_BELOW = 80;

/** Pulse: a two-sided range. */
export const RANGED_TYPICAL: Typical = {
  max: PULSE_MAX,
  min: PULSE_MIN,
};

/** Blood pressure: two one-sided upper bounds. */
export const BLOOD_PRESSURE_TYPICAL: Typical = {
  diastolicBelow: DIASTOLIC_BELOW,
  systolicBelow: SYSTOLIC_BELOW,
};

/**
 * Builds a single-value reading, such as pulse or weight.
 * @param date - The ISO date of the reading.
 * @param value - The measured value, or `null` when the booth could not read it.
 * @returns {Reading} - The reading.
 */
export const makeReading = (date: string, value: number | null): Reading => ({
  date,
  value,
});

/**
 * Builds a blood pressure reading.
 * @param date - The ISO date of the reading.
 * @param systolic - The top number, or `null` when unmeasured.
 * @param diastolic - The bottom number, or `null` when unmeasured.
 * @returns {Reading} - The reading.
 */
export const makeBloodPressureReading = (
  date: string,
  systolic: number | null,
  diastolic: number | null,
): Reading => ({
  date,
  diastolic,
  systolic,
});
