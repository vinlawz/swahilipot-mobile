import { Link } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Text as ThemedText, View as ThemedView } from '@/components/Themed';

const TABS = [
  { id: 'fm', title: 'Swahilipot FM', summary: 'Listen to shows and live streams.', href: '/fm' },
  {
    id: 'foundation',
    title: 'Swahilipot Foundation',
    summary: 'Programs, community, and youth initiatives.',
    href: '/foundation',
  },
  { id: 'socials', title: 'Socials', summary: 'Meetups, updates, and conversations.', href: '/socials' },
  { id: 'events', title: 'Events', summary: 'Schedules and happenings across the hub.', href: '/events' },
  { id: 'profile', title: 'Profile', summary: 'Manage your account and preferences.', href: '/profile' },
] as const;

const H_PADDING = 16;
const GAP = 12;

export default function HomeScreen() {
  const { width } = useWindowDimensions();

  const columns = useMemo(() => {
    if (width >= 1200) return 4;
    if (width >= 900) return 3;
    if (width >= 700) return 3;
    if (width >= 520) return 2;
    return 1;
  }, [width]);

  const cardWidth = useMemo(() => {
    const totalGaps = GAP * (columns - 1);
    return (width - H_PADDING * 2 - totalGaps) / columns;
  }, [columns, width]);

  return (
    <ThemedView style={styles.page}>
      <FlatList
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.topBar}>
              <Image source={require('@/assets/images/sph-logo.png')} style={styles.logo} />
              <Link href="/profile" asChild>
                <Pressable hitSlop={8}>
                  <FontAwesome name="user-circle" size={28} />
                </Pressable>
              </Link>
            </View>
            <ThemedText style={styles.overline}>Swahilipot Hb Foundation App</ThemedText>
            <ThemedText style={styles.title}>Choose where to go</ThemedText>
            <ThemedText style={styles.subtitle}>
              Pick a module to jump into. You can always return here from the Home tab.
            </ThemedText>
            <View style={styles.infoCard}>
              <ThemedText style={styles.infoTitle}>Key information</ThemedText>
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Website</ThemedText>
                <ThemedText style={styles.infoValue}>https://swahilipot.org</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Contact email</ThemedText>
                <ThemedText style={styles.infoValue}>info@swahilipot.org</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Customer care</ThemedText>
                <ThemedText style={styles.infoValue}>+254 700 000 000</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Location</ThemedText>
                <ThemedText style={styles.infoValue}>Mombasa, Kenya</ThemedText>
              </View>
            </View>
          </View>
        }
        data={TABS}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        columnWrapperStyle={columns > 1 ? { columnGap: GAP } : undefined}
        renderItem={({ item }) => (
          <View style={[styles.item, { width: cardWidth }]}>
            <Link href={item.href} asChild>
              <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
                <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.cardBody}>{item.summary}</ThemedText>
              </Pressable>
            </Link>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    paddingHorizontal: H_PADDING,
    paddingVertical: 16,
    rowGap: GAP,
  },
  header: {
    gap: 8,
    marginBottom: 8,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  infoCard: {
    marginTop: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    flexShrink: 1,
    textAlign: 'right',
  },
  overline: {
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  item: {
    flexGrow: 1,
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    gap: 8,
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
  },
});
