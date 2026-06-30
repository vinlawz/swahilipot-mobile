import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Linking, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { FM_STREAM, useAudioPlayer } from '@/components/AudioPlayer';
import { Text, Heading, Card, Button, Badge, Alert } from '@/components/ui';
import { Colors } from '@/constants/Theme';
import { Spacing } from '@/constants/Spacing';
import { useColorScheme } from '@/components/useColorScheme';
import { View as ThemedView } from '@/components/Themed';
import {
  getCurrentShow,
  getUpcomingShows,
  getFormattedDay,
  getFormattedTime,
  ShowSlot,
} from '@/lib/swahilipotSchedule';

export default function FmScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { currentTrack, isPlaying, isLoading, togglePlayback, stop } = useAudioPlayer();
  const [currentShow, setCurrentShow] = useState<ShowSlot | null>(null);
  const [upcomingShows, setUpcomingShows] = useState<ShowSlot[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Update shows every minute
  useEffect(() => {
    const updateShows = () => {
      setCurrentShow(getCurrentShow());
      setUpcomingShows(getUpcomingShows(6));
      setCurrentTime(getFormattedTime());
    };

    updateShows();
    const interval = setInterval(updateShows, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const isCurrentStream = currentTrack?.id === FM_STREAM.id;
  const playingLive = isCurrentStream && isPlaying;

  const statusMessage = isLoading
    ? 'Connecting to the studio feed...'
    : playingLive
      ? '🎙️ Live broadcast in progress'
      : isCurrentStream
        ? 'Stream ready to play'
        : 'Switch to FM stream';

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Heading level={1}>{FM_STREAM.title}</Heading>
          <Text variant="body" color="foregroundSecondary">{FM_STREAM.subtitle}</Text>
        </View>

        <Card padding={Spacing.lg} gap={Spacing.lg} shadow="md">
          <View style={styles.cardHeader}>
            <Heading level={3}>Live Stream</Heading>
            {playingLive && <Badge label="LIVE" variant="error" />}
          </View>

          <View style={styles.statusContainer}>
            {isLoading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                <MaterialIcons name="hourglass-empty" size={20} color={theme.secondary} />
                <Text variant="body" color="foregroundSecondary">
                  Connecting...
                </Text>
              </View>
            ) : (
              <Text variant="body" color={playingLive ? 'success' : 'foregroundSecondary'}>
                {statusMessage}
              </Text>
            )}
          </View>

          <View style={styles.controls}>
            <Button
              onPress={() => togglePlayback(FM_STREAM)}
              disabled={isLoading}
              loading={isLoading}
              variant={playingLive ? 'secondary' : 'primary'}
              size="lg"
              fullWidth
              icon={<MaterialIcons name={playingLive ? 'pause' : 'play-arrow'} size={20} />}
            >
              {playingLive ? 'Pause' : 'Play'}
            </Button>

            <Button
              onPress={stop}
              disabled={!isCurrentStream || isLoading}
              variant="ghost"
              size="lg"
              fullWidth
              icon={<MaterialIcons name="stop" size={20} />}
            >
              Stop
            </Button>
          </View>

          <Text variant="bodySmall" color="foregroundSecondary" style={{ textAlign: 'center' }}>
            Audio continues playing while you explore other tabs. Use the floating player for quick control.
          </Text>
        </Card>

        {/* Currently Playing Show */}
        {currentShow && (
          <Card padding={Spacing.lg} gap={Spacing.md} shadow="md" style={{ borderLeftWidth: 4, borderLeftColor: theme.success }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Heading level={3}>NOW PLAYING</Heading>
              <Badge label="🔴 LIVE" variant="error" />
            </View>

            <View style={{ backgroundColor: theme.backgroundSecondary, padding: Spacing.md, borderRadius: Spacing.radius.md }}>
              <Text variant="body" weight="600" style={{ fontSize: 18, marginBottom: Spacing.sm }}>
                {currentShow.show}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                <MaterialIcons name="schedule" size={16} color={theme.foregroundSecondary} />
                <Text variant="bodySmall" color="foregroundSecondary">
                  {currentShow.start} - {currentShow.end || 'Late Night'}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Upcoming Shows */}
        {upcomingShows.length > 0 && (
          <Card padding={Spacing.lg} gap={Spacing.md} shadow="sm">
            <Heading level={3}>Up Next</Heading>
            {upcomingShows.map((show, idx) => (
              <View
                key={`${show.show}-${idx}`}
                style={{
                  paddingVertical: Spacing.md,
                  borderBottomWidth: idx < upcomingShows.length - 1 ? 1 : 0,
                  borderBottomColor: theme.border,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: Spacing.radius.md,
                      backgroundColor: theme.secondary,
                      opacity: 0.2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <MaterialIcons name="radio-button-checked" size={24} color={theme.secondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="body" weight="600">
                      {show.show}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.xs }}>
                      <MaterialIcons name="schedule" size={14} color={theme.foregroundSecondary} />
                      <Text variant="bodySmall" color="foregroundSecondary">
                        {show.start} - {show.end || 'Late Night'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </Card>
        )}

        {/* Website Link Card - BOTTOM */}
        <Pressable
          onPress={() => Linking.openURL('https://www.swahilipotfm.co.ke/')}
          android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
        >
          <Card padding={Spacing.lg} gap={Spacing.md} shadow="sm" style={{ backgroundColor: theme.backgroundSecondary }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 }}>
                <View
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: Spacing.radius.md,
                    backgroundColor: theme.secondary,
                    opacity: 0.2,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <MaterialIcons name="language" size={24} color={theme.secondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="body" weight="600">
                    Discover More
                  </Text>
                  <Text variant="bodySmall" color="foregroundSecondary" style={{ marginTop: Spacing.xs }}>
                    Visit our website
                  </Text>
                </View>
              </View>
              <MaterialIcons name="arrow-forward" size={24} color={theme.secondary} />
            </View>

            <Text
              variant="caption"
              color="secondary"
              style={{
                marginTop: Spacing.xs,
                paddingLeft: 45 + Spacing.md,
                fontWeight: '500',
              }}
            >
              swahilipotfm.co.ke
            </Text>
          </Card>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.screenPadding,
    gap: Spacing.lg,
  },
  header: {
    gap: Spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  controls: {
    gap: Spacing.md,
  },
  showItem: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
});
