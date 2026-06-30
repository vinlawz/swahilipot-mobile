import React, { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet, RefreshControl, Linking, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text, Heading, Card, EmptyState, Alert } from '@/components/ui';
import { Spacing } from '@/constants/Spacing';
import { Colors } from '@/constants/Theme';
import { useColorScheme } from '@/components/useColorScheme';
import { View as ThemedView } from '@/components/Themed';
import { SWAHILIPOT_PROGRAMS, getProgramStats, type Program } from '@/lib/swahilipotPrograms';

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    mentorship: '#3b82f6',
    training: '#8b5cf6',
    entrepreneurship: '#ec4899',
    arts: '#f59e0b',
    youth: '#10b981',
    culture: '#f97316',
  };
  return colors[category] || '#6b7280';
};

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    mentorship: 'person',
    training: 'school',
    entrepreneurship: 'trending-up',
    arts: 'palette',
    youth: 'group',
    culture: 'theater-comedy',
  };
  return icons[category] || 'apps';
};

export default function FoundationScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [programs, setPrograms] = useState<Program[]>(SWAHILIPOT_PROGRAMS);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number>(Date.now());
  const stats = getProgramStats();

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate sync
    await new Promise((resolve) => setTimeout(resolve, 500));
    setPrograms(SWAHILIPOT_PROGRAMS);
    setLastSyncTime(Date.now());
    setRefreshing(false);
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <FlatList
        data={programs}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View style={styles.header}>
            <Heading level={1}>Foundation Programs</Heading>
            <Text variant="body" color="foregroundSecondary">
              Swahilipot Hub initiatives supporting youth
            </Text>

            {/* Stats Card */}
            <Card padding={Spacing.md} gap={Spacing.md} shadow="sm" style={{ marginTop: Spacing.md }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <View style={{ alignItems: 'center', gap: Spacing.xs }}>
                  <Heading level={3} style={{ fontSize: 24 }}>{stats.total}</Heading>
                  <Text variant="caption" color="foregroundSecondary">
                    Programs
                  </Text>
                </View>
                <View style={{ alignItems: 'center', gap: Spacing.xs }}>
                  <Heading level={3} style={{ fontSize: 24 }}>{stats.totalEnrolled}</Heading>
                  <Text variant="caption" color="foregroundSecondary">
                    Enrolled
                  </Text>
                </View>
                <View style={{ alignItems: 'center', gap: Spacing.xs }}>
                  <Heading level={3} style={{ fontSize: 24 }}>{stats.totalCapacity}</Heading>
                  <Text variant="caption" color="foregroundSecondary">
                    Capacity
                  </Text>
                </View>
              </View>
            </Card>

            <Text variant="caption" color="foregroundSecondary" style={{ marginTop: Spacing.md }}>
              Last updated: {new Date(lastSyncTime).toLocaleTimeString()}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              if (item.url) {
                console.log('[Foundation] Opening program:', item.title, item.url);
                Linking.openURL(item.url).catch((err) => {
                  console.error('[Foundation] Failed to open URL:', err);
                });
              }
            }}
            android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
          >
            <Card shadow="sm" style={{ overflow: 'hidden' }}>
              <View style={styles.programItem}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md }}>
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: Spacing.radius.md,
                      backgroundColor: getCategoryColor(item.category),
                      opacity: 0.15,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <MaterialIcons
                      name={getCategoryIcon(item.category)}
                      size={28}
                      color={getCategoryColor(item.category)}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Heading level={4}>{item.title}</Heading>
                    <Text variant="bodySmall" color="foregroundSecondary" style={{ marginTop: Spacing.xs }}>
                      {item.description}
                    </Text>
                  </View>
                </View>

                {/* Mentor & Enrollment Info */}
                {item.mentor && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.md }}>
                    <MaterialIcons name="person" size={14} color={theme.foregroundSecondary} />
                    <Text variant="caption" color="foregroundSecondary">
                      {item.mentor}
                    </Text>
                  </View>
                )}

                {/* Progress Bar */}
                {item.capacity && (
                  <View style={{ marginTop: Spacing.md, gap: Spacing.xs }}>
                    <View
                      style={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: theme.backgroundSecondary,
                        overflow: 'hidden',
                      }}
                    >
                      <View
                        style={{
                          height: '100%',
                          backgroundColor: getCategoryColor(item.category),
                          width: `${((item.enrolled || 0) / item.capacity) * 100}%`,
                        }}
                      />
                    </View>
                    <Text variant="caption" color="foregroundSecondary">
                      {item.enrolled || 0} / {item.capacity} enrolled
                    </Text>
                  </View>
                )}

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.md }}>
                  <Text
                    variant="caption"
                    weight="600"
                    style={{ color: getCategoryColor(item.category) }}
                  >
                    {item.category.toUpperCase()}
                  </Text>
                  <MaterialIcons name="arrow-forward" size={18} color={theme.secondary} />
                </View>
              </View>
            </Card>
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <EmptyState
            icon="school"
            title="No Programs"
            message="Foundation programs will appear here"
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
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
  programItem: {
    gap: Spacing.sm,
  },
});
