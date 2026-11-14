/**
 * @fileoverview The Booth simulator: a stand-in for the physical booth.
 *
 * There is no real hardware to demo against, so this screen plays the booth's
 * part — it accepts or refuses a pass, records a few readings, and checks the
 * patient out. It is styled as an operator console rather than patient UI, so
 * nobody mistakes it for part of the patient app.
 */

import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { request } from '@/api/client';
import { Endpoint } from '@/api/endpoints';
import { booths, metrics, patient } from '@/api/mock/seed';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { Chip } from '@/components/atoms/Chip';
import { Screen } from '@/components/atoms/Screen';
import { Text } from '@/components/atoms/Text';
import type { MetricKey, Visit } from '@/core/types';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useQueryOnce } from '@/hooks/useQueryOnce';
import { colors, radii, spacing } from '@/theme';

/** Plausible readings the simulated devices "take". */
const DEVICE_READINGS: {
  diastolic?: number;
  metricKey: MetricKey;
  systolic?: number;
  value?: number;
}[] = [
  { diastolic: 86, metricKey: 'blood_pressure', systolic: 134 },
  { metricKey: 'pulse', value: 77 },
  { metricKey: 'spo2', value: 98 },
  { metricKey: 'temperature', value: 36.7 },
  { metricKey: 'weight', value: 60.6 },
];

/**
 * The booth simulator screen.
 * @returns {React.JSX.Element} - The screen.
 */
export const BoothSimulatorScreen = (): React.JSX.Element => {
  const [boothId, setBoothId] = useState(booths[0].id);
  const [code, setCode] = useState('');
  const [checkedIn, setCheckedIn] = useState<Visit | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const visitsQuery = useQueryOnce<Visit[]>(() =>
    request(Endpoint.Visits, { patientId: patient.id }),
  );

  const passQuery = useQueryOnce(() => {
    const upcoming = (visitsQuery.data ?? []).find(
      (visit) => visit.status === 'scheduled',
    );

    return upcoming
      ? request(Endpoint.Pass, { visitId: upcoming.id })
      : Promise.resolve(null);
  }, [visitsQuery.data]);

  const passBoothId = passQuery.data?.pass.boothId;
  const passBooth = booths.find((booth) => booth.id === passBoothId);

  // Follow whichever booth the waiting pass was issued for, so the happy path
  // works without matching them up by hand. A booth picked by hand sticks
  // until a different pass turns up, which is when the operator's choice has
  // gone stale.
  useEffect(() => {
    if (passBoothId) {
      setBoothId(passBoothId);
    }
  }, [passBoothId]);

  const checkIn = useAsyncAction(async (scannedCode: string) =>
    request(Endpoint.CheckIn, { boothId, code: scannedCode }),
  );

  const takeReadings = useAsyncAction(async (visitId: string) => {
    for (const reading of DEVICE_READINGS) {
      await request(Endpoint.RecordReading, { ...reading, visitId });
    }

    return true;
  });

  const checkOut = useAsyncAction(async (visitId: string) =>
    request(Endpoint.CheckOut, { visitId }),
  );

  /**
   * Clears the last result. Called whenever the operator changes what is
   * about to be scanned, so a refusal never lingers over a new attempt.
   */
  const clearResult = (): void => {
    checkIn.reset();
    setNote(null);
  };

  /**
   * Takes a new code, dropping any previous result.
   * @param next - The scanned or pasted string.
   */
  const changeCode = (next: string): void => {
    clearResult();
    setCode(next);
  };

  /**
   * Switches which booth this is pretending to be.
   * @param next - The booth id.
   */
  const changeBooth = (next: string): void => {
    clearResult();
    setBoothId(next);
  };

  /**
   * Scans whatever is in the code field.
   */
  const scan = async (): Promise<void> => {
    setNote(null);

    const result = await checkIn.run(code.trim());

    if (result) {
      setCheckedIn(result.visit);
      setNote(`Checked in at ${new Date().toLocaleTimeString()}`);
    }
  };

  /**
   * Copies the patient's current pass into the field, standing in for a scan.
   */
  const simulateScan = (): void => {
    if (passQuery.data) {
      changeCode(passQuery.data.code);
    }
  };

  /**
   * Records the device readings, then ends the visit.
   */
  const finish = async (): Promise<void> => {
    if (!checkedIn) {
      return;
    }

    const recorded = await takeReadings.run(checkedIn.id);

    // A visit that completes with missing measurements is worse than one that
    // stays open, so a failed device reading stops the check-out.
    if (!recorded) {
      return;
    }

    const result = await checkOut.run(checkedIn.id);

    if (result) {
      setCheckedIn(null);
      setCode('');
      setNote('Visit complete. The patient app has already updated.');
    }
  };

  return (
    <Screen
      hasTopInset={false}
      style={styles.screen}
      testID="booth-simulator-screen"
    >
      <View style={styles.banner}>
        <Text color="onBrand" text="BOOTH SIMULATOR" variant="label" />
        <Text
          color="onBrand"
          text="Stands in for the physical Temple. Not patient UI."
          variant="caption"
        />
      </View>

      <Text text="1. Which Temple is this?" variant="sectionTitle" />
      <View style={styles.booths}>
        {booths.map((booth) => (
          <Chip
            isSelected={booth.id === boothId}
            key={booth.id}
            onPress={() => changeBooth(booth.id)}
            testID={`sim-booth-${booth.id}`}
            text={booth.name}
          />
        ))}
      </View>

      {passBooth ? (
        <Text
          color={passBooth.id === boothId ? 'muted' : 'warning'}
          text={
            passBooth.id === boothId
              ? `The waiting pass is for ${passBooth.name}.`
              : `Heads up: the waiting pass is for ${passBooth.name}, so this booth will refuse it.`
          }
          variant="caption"
        />
      ) : null}

      <Text text="2. Scan the pass" variant="sectionTitle" />
      <TextInput
        accessibilityLabel="Scanned code"
        autoCapitalize="none"
        autoCorrect={false}
        multiline
        onChangeText={changeCode}
        placeholder="Paste or scan a pass code"
        placeholderTextColor={colors.muted}
        style={styles.input}
        testID="sim-code-input"
        value={code}
      />

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          disabled={!passQuery.data}
          onPress={simulateScan}
          style={styles.link}
          testID="sim-simulate-scan"
        >
          <Text
            color={passQuery.data ? 'brand' : 'muted'}
            text="Simulate scanning the patient's QR"
            variant="label"
          />
        </Pressable>
      </View>

      <Button
        disabled={code.trim() === ''}
        isLoading={checkIn.isLoading}
        onPress={scan}
        testID="sim-check-in"
        text="Accept pass and check in"
      />

      {checkIn.error ? (
        <Card style={styles.rejected} testID="sim-rejection">
          <Text color="danger" text="Pass refused" variant="label" />
          <Text color="danger" text={checkIn.error.message} variant="caption" />
          {checkIn.failure ? (
            <Text
              color="muted"
              text={`reason: ${checkIn.failure.code}`}
              variant="caption"
            />
          ) : null}
        </Card>
      ) : null}

      {(takeReadings.error ?? checkOut.error) ? (
        <Card style={styles.rejected} testID="sim-visit-error">
          <Text
            color="danger"
            text="The visit could not be completed"
            variant="label"
          />
          <Text
            color="danger"
            text={(takeReadings.error ?? checkOut.error)?.message}
            variant="caption"
          />
          <Text
            color="muted"
            text="The patient is still checked in. Try again."
            variant="caption"
          />
        </Card>
      ) : null}

      {note ? (
        <Card style={styles.accepted} testID="sim-note">
          <Text color="success" text={note} variant="caption" />
        </Card>
      ) : null}

      {checkedIn ? (
        <>
          <Text text="3. Take the measurements" variant="sectionTitle" />
          <Card style={styles.readings}>
            {DEVICE_READINGS.map((reading) => {
              const metric = metrics.find(
                (candidate) => candidate.key === reading.metricKey,
              );

              return (
                <View key={reading.metricKey} style={styles.readingRow}>
                  <Text
                    text={metric?.label ?? reading.metricKey}
                    variant="caption"
                  />
                  <Text
                    color="muted"
                    text={
                      reading.systolic
                        ? `${reading.systolic}/${reading.diastolic} ${metric?.unit ?? ''}`
                        : `${reading.value} ${metric?.unit ?? ''}`
                    }
                    variant="caption"
                  />
                </View>
              );
            })}
          </Card>

          <Button
            isLoading={takeReadings.isLoading || checkOut.isLoading}
            onPress={finish}
            testID="sim-check-out"
            text="Record readings and check out"
          />
        </>
      ) : null}
    </Screen>
  );
};

const styles = StyleSheet.create({
  accepted: {
    backgroundColor: colors.successTint,
    borderColor: colors.successTint,
  },
  actions: {
    alignItems: 'flex-start',
  },
  banner: {
    backgroundColor: colors.ink,
    borderRadius: radii.input,
    gap: 2,
    padding: spacing.sm,
  },
  booths: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  input: {
    backgroundColor: colors.brandTint,
    borderRadius: radii.input,
    color: colors.ink,
    fontSize: 12,
    minHeight: 72,
    padding: spacing.sm,
  },
  link: {
    paddingVertical: spacing.xxs,
  },
  readingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  readings: {
    gap: spacing.xxs,
  },
  rejected: {
    backgroundColor: colors.dangerTint,
    borderColor: colors.dangerTint,
    gap: 2,
  },
  screen: {
    gap: spacing.sm,
  },
});
