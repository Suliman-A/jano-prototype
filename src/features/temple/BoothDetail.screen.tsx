/**
 * @fileoverview A Temple's detail: what it offers, and its free slots.
 */

import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { request } from '@/api/client';
import { Endpoint } from '@/api/endpoints';
import { boothFunctions, booths, patient } from '@/api/mock/seed';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { Chip } from '@/components/atoms/Chip';
import { Screen } from '@/components/atoms/Screen';
import { Text } from '@/components/atoms/Text';
import { AsyncState } from '@/components/molecules/AsyncState';
import { isBookable } from '@/core/booths';
import type { Slot } from '@/core/types';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useQueryOnce } from '@/hooks/useQueryOnce';
import type { TempleStackParamList } from '@/navigation/types';
import { colors, radii, spacing } from '@/theme';

type DetailRoute = RouteProp<TempleStackParamList, 'BoothDetail'>;
type DetailNavigation = NativeStackNavigationProp<TempleStackParamList>;

/**
 * Formats a slot as a day and time.
 * @param at - Epoch milliseconds.
 * @returns {string} - A label such as `Fri 11:30 AM`.
 */
const toSlotLabel = (at: number): string =>
  new Date(at).toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    weekday: 'short',
  });

/**
 * The booth detail screen.
 * @returns {React.JSX.Element} - The screen.
 */
export const BoothDetailScreen = (): React.JSX.Element => {
  const { params } = useRoute<DetailRoute>();
  const navigation = useNavigation<DetailNavigation>();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const booth = booths.find((candidate) => candidate.id === params.boothId);

  const slotsQuery = useQueryOnce<Slot[]>(
    () => request(Endpoint.Slots, { boothId: params.boothId }),
    [params.boothId],
  );

  const booking = useAsyncAction(async (slotId: string) =>
    request(Endpoint.Book, { patientId: patient.id, slotId }),
  );

  const available = (slotsQuery.data ?? []).filter((slot) => slot.isAvailable);

  /**
   * Books the chosen slot and shows the resulting pass.
   */
  const confirm = async (): Promise<void> => {
    if (!selectedId) {
      return;
    }

    const result = await booking.run(selectedId);

    if (result) {
      navigation.navigate('Pass', { visitId: result.visit.id });
    }
  };

  if (!booth) {
    return (
      <Screen>
        <Text text="Temple not found" variant="screenTitle" />
      </Screen>
    );
  }

  return (
    <Screen hasTopInset={false} testID="booth-detail-screen">
      <Text text={booth.name} variant="screenTitle" />
      <Text
        color="muted"
        text={`📍 ${booth.area} · ${booth.hours}`}
        variant="caption"
      />

      <View style={styles.tags}>
        {booth.functions.map((fn) => (
          <Chip key={fn} text={boothFunctions[fn]} tone="brand" />
        ))}
        {!isBookable(booth) ? (
          <Chip text="Closed for maintenance" tone="warning" />
        ) : null}
      </View>

      <Text text="Pick a time" variant="sectionTitle" />

      <AsyncState
        emptyMessage={
          isBookable(booth)
            ? 'Every slot here is taken. Try another Temple.'
            : 'This Temple is closed for maintenance.'
        }
        emptyTitle="No times available"
        error={slotsQuery.error}
        isEmpty={available.length === 0}
        isLoading={slotsQuery.isLoading}
        loadingText="Checking availability…"
        onRetry={slotsQuery.refetch}
      />

      <View style={styles.slots}>
        {available.slice(0, 12).map((slot) => {
          const isSelected = slot.id === selectedId;

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              key={slot.id}
              onPress={() => setSelectedId(slot.id)}
              style={[styles.slot, isSelected && styles.slotSelected]}
              testID={`slot-${slot.id}`}
            >
              <Text
                color={isSelected ? 'onBrand' : 'ink'}
                text={toSlotLabel(slot.startsAt)}
                variant="label"
              />
            </Pressable>
          );
        })}
      </View>

      {booking.error ? (
        <Card style={styles.error}>
          <Text color="danger" text={booking.error.message} variant="caption" />
        </Card>
      ) : null}

      {available.length > 0 ? (
        <Button
          disabled={!selectedId}
          isLoading={booking.isLoading}
          onPress={confirm}
          testID="confirm-booking"
          text="Book this visit"
        />
      ) : null}
    </Screen>
  );
};

const styles = StyleSheet.create({
  error: {
    backgroundColor: colors.dangerTint,
    borderColor: colors.dangerTint,
  },
  slot: {
    backgroundColor: colors.brandTint,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  slotSelected: {
    backgroundColor: colors.brand,
  },
  slots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
});
