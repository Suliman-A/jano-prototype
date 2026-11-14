/**
 * @fileoverview Find a Temple: the pass at the top, then search, filters, and
 * the booths as either a map or a list.
 */

import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { boothFunctions, booths } from '@/api/mock/seed';
import { Card } from '@/components/atoms/Card';
import { Chip } from '@/components/atoms/Chip';
import { Screen } from '@/components/atoms/Screen';
import { Text } from '@/components/atoms/Text';
import { EmptyState } from '@/components/molecules/EmptyState';
import { filterBooths, hasLocation } from '@/core/booths';
import type { Booth, BoothFunctionKey } from '@/core/types';
import { BoothMap } from '@/features/temple/BoothMap';
import { PassCard } from '@/features/pass/PassCard';
import type { TempleStackParamList } from '@/navigation/types';
import { colors, radii, spacing } from '@/theme';

type TempleNavigation = NativeStackNavigationProp<TempleStackParamList>;

const FUNCTION_KEYS = Object.keys(boothFunctions) as BoothFunctionKey[];

/**
 * One booth in the list.
 * @param props - The booth and what happens when it is tapped.
 * @returns {React.JSX.Element} - The row.
 */
const BoothRow = ({
  booth,
  onPress,
}: {
  booth: Booth;
  onPress: () => void;
}): React.JSX.Element => (
  <Card onPress={onPress} style={styles.row} testID={`booth-${booth.id}`}>
    <View style={styles.rowIcon}>
      <Text text="🏛" variant="body" />
    </View>
    <View style={styles.rowBody}>
      <Text text={booth.name} variant="label" />
      <Text
        color="muted"
        text={`${booth.area} · ${booth.functions
          .map((fn) => boothFunctions[fn])
          .join(', ')}`}
        variant="caption"
      />
      {!hasLocation(booth) ? (
        <Text color="muted" text="Location coming soon" variant="caption" />
      ) : null}
    </View>
    {booth.status === 'maintenance' ? (
      <Chip text="Maintenance" tone="warning" />
    ) : (
      <Text color="muted" text="›" variant="title" />
    )}
  </Card>
);

/**
 * The Temple screen.
 * @returns {React.JSX.Element} - The screen.
 */
export const TempleScreen = (): React.JSX.Element => {
  const navigation = useNavigation<TempleNavigation>();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<BoothFunctionKey[]>([]);
  const [isMap, setIsMap] = useState(true);

  const visible = filterBooths(booths, query, selected);

  /**
   * Adds or removes a function filter.
   * @param key - The function tapped.
   */
  const toggleFunction = (key: BoothFunctionKey): void => {
    setSelected((current) =>
      current.includes(key)
        ? current.filter((candidate) => candidate !== key)
        : [...current, key],
    );
  };

  return (
    <Screen testID="temple-screen">
      <PassCard />

      <Text text="Find a Jano Temple" variant="screenTitle" />
      <Text color="muted" text="📍 Metro Manila" variant="caption" />

      <TextInput
        accessibilityLabel="Search by area"
        onChangeText={setQuery}
        placeholder="Search by area"
        placeholderTextColor={colors.muted}
        style={styles.search}
        testID="booth-search"
        value={query}
      />

      <View style={styles.filters}>
        {FUNCTION_KEYS.map((key) => (
          <Chip
            isSelected={selected.includes(key)}
            key={key}
            onPress={() => toggleFunction(key)}
            style={styles.filter}
            testID={`filter-${key}`}
            text={boothFunctions[key]}
          />
        ))}
      </View>

      <View style={styles.toggle}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: isMap }}
          onPress={() => setIsMap(true)}
          style={[styles.toggleItem, isMap && styles.toggleItemActive]}
        >
          <Text color={isMap ? 'onBrand' : 'ink'} text="Map" variant="label" />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: !isMap }}
          onPress={() => setIsMap(false)}
          style={[styles.toggleItem, !isMap && styles.toggleItemActive]}
        >
          <Text color={isMap ? 'ink' : 'onBrand'} text="List" variant="label" />
        </Pressable>
      </View>

      {isMap ? <BoothMap booths={visible} /> : null}

      {visible.length === 0 ? (
        <EmptyState
          message="Try a different area or clear the filters."
          title="No Temples match"
        />
      ) : (
        <View style={styles.list}>
          {visible.map((booth) => (
            <BoothRow
              booth={booth}
              key={booth.id}
              onPress={() =>
                navigation.navigate('BoothDetail', { boothId: booth.id })
              }
            />
          ))}
        </View>
      )}

      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate('BoothSimulator')}
        style={styles.simulatorLink}
        testID="open-booth-simulator"
      >
        <Text color="brand" text="Open the Booth simulator →" variant="label" />
      </Pressable>
    </Screen>
  );
};

const styles = StyleSheet.create({
  filter: {
    flexGrow: 1,
    flexBasis: '45%',
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  list: {
    gap: spacing.xs,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rowBody: {
    flex: 1,
    gap: 2,
  },
  rowIcon: {
    alignItems: 'center',
    backgroundColor: colors.brandTint,
    borderRadius: radii.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  search: {
    backgroundColor: colors.brandTint,
    borderRadius: radii.pill,
    color: colors.ink,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  simulatorLink: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  toggle: {
    backgroundColor: colors.brandTint,
    borderRadius: radii.pill,
    flexDirection: 'row',
    padding: 4,
  },
  toggleItem: {
    alignItems: 'center',
    borderRadius: radii.pill,
    flex: 1,
    paddingVertical: spacing.xs,
  },
  toggleItemActive: {
    backgroundColor: colors.brand,
  },
});
