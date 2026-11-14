/**
 * @fileoverview The Temple map.
 *
 * Booths with no surveyed coordinates are simply not drawn — they still appear
 * in the list below, with a note.
 */

import { Platform, StyleSheet, View } from 'react-native';
import { AppleMaps, GoogleMaps } from 'expo-maps';

import { Text } from '@/components/atoms/Text';
import { hasLocation } from '@/core/booths';
import type { Booth } from '@/core/types';
import { colors, radii, spacing } from '@/theme';

const MANILA = { latitude: 14.5649, longitude: 121.0306 };
const ZOOM = 12;
const MAP_HEIGHT = 220;

type BoothMapProps = {
  booths: Booth[];
};

/**
 * Draws the booths as pins.
 * @param props - The booths to show.
 * @returns {React.JSX.Element} - The map.
 */
export const BoothMap = ({ booths }: BoothMapProps): React.JSX.Element => {
  const located = booths.filter(hasLocation);

  const markers = located.map((booth) => ({
    coordinates: { latitude: booth.lat, longitude: booth.lng },
    id: booth.id,
    title: booth.name,
  }));

  const camera = {
    coordinates: markers[0]?.coordinates ?? MANILA,
    zoom: ZOOM,
  };

  return (
    // The map is illustrative: it never takes gestures, so the pins always
    // stay in frame and dragging over it scrolls the page instead.
    <View pointerEvents="none" style={styles.root} testID="booth-map">
      {Platform.OS === 'ios' ? (
        <AppleMaps.View
          cameraPosition={camera}
          markers={markers}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <GoogleMaps.View
          cameraPosition={camera}
          markers={markers}
          style={StyleSheet.absoluteFill}
        />
      )}
      {located.length === 0 ? (
        <View style={styles.overlay}>
          <Text
            color="muted"
            text="No Temples to show here"
            variant="caption"
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    backgroundColor: colors.brandTint,
    borderRadius: radii.card,
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  root: {
    backgroundColor: colors.brandTint,
    borderRadius: radii.card,
    height: MAP_HEIGHT,
    marginBottom: spacing.xxs,
    overflow: 'hidden',
  },
});
