import React from 'react';
import { FlatList, View, StyleSheet, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text, Heading, Card, Button, Badge, EmptyState, LoadingSpinner } from '@/components/ui';
import { Spacing } from '@/constants/Spacing';
import { Colors } from '@/constants/Theme';
import { useColorScheme } from '@/components/useColorScheme';
import { View as ThemedView } from '@/components/Themed';
import { formatDate } from '@/utils/formatting';
import { useContentSync } from '@/hooks/useContentSync';

export default function EventsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { data: syncedContent, loading, refreshing, refresh } = useContentSync();

  const allEvents = syncedContent?.events || [];

  // Separate upcoming and past events
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = allEvents.filter(e => {
    const eventDate = new Date(e.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });

  const pastEvents = allEvents.filter(e => {
    const eventDate = new Date(e.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate < today;
  });

  if (loading && !syncedContent) {
    return (
      <ThemedView style={styles.container}>
        <LoadingSpinner text="Loading events..." fullScreen />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <FlatList
        data={upcomingEvents}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View style={styles.header}>
            <Heading level={1}>Events</Heading>
            <Text variant="body" color="foregroundSecondary">
              Join us for workshops, meetups, and community celebrations
            </Text>
            {syncedContent?.lastSyncTime && (
              <Text variant="caption" color="foregroundSecondary" style={{ marginTop: Spacing.sm }}>
                Last updated: {new Date(syncedContent.lastSyncTime).toLocaleTimeString()}
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <Card shadow="sm" gap={Spacing.md}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1, gap: Spacing.xs }}>
                <Heading level={4}>{item.title}</Heading>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
                  <MaterialIcons name="event" size={16} color={theme.gray400} />
                  <Text variant="bodySmall" color="foregroundSecondary">
                    {formatDate(item.date)} at {item.time}
                  </Text>
                </View>
              </View>
              <Badge label="UPCOMING" variant="primary" />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
              <MaterialIcons name="location-on" size={16} color={theme.secondary} />
              <Text variant="bodySmall">{item.location}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
                <MaterialIcons name="people" size={16} color={theme.gray400} />
                <Text variant="caption">{item.attendees} attending</Text>
              </View>
            </View>

            <Button onPress={() => {}} fullWidth>
              RSVP Now
            </Button>
          </Card>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <EmptyState
            icon="event"
            title="No Upcoming Events"
            message="Check back soon for new events and workshops"
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={theme.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.screenPadding,
    gap: Spacing.lg,
  },
  header: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
});
