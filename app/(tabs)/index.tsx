import { Link } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';

import { Text, Heading, Card } from '@/components/ui';
import { Colors } from '@/constants/Theme';
import { Spacing } from '@/constants/Spacing';
import { useColorScheme } from '@/components/useColorScheme';
import { View as ThemedView } from '@/components/Themed';

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

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const columns = useMemo(() => {
    if (width >= 1200) return 4;
    if (width >= 900) return 3;
    if (width >= 700) return 3;
    if (width >= 520) return 2;
    return 1;
  }, [width]);

  const cardWidth = useMemo(() => {
    const totalGaps = Spacing.gapLarge * (columns - 1);
    return (width - Spacing.screenPadding * 2 - totalGaps) / columns;
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
                  <MaterialIcons name="account-circle" size={32} color={theme.secondary} />
                </Pressable>
              </Link>
            </View>

            <Text variant="labelSmall" color="secondary" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
              Swahilipot Hub
            </Text>
            <Heading level={1}>Choose your path</Heading>
            <Text variant="body" color="foregroundSecondary">
              Explore Swahilipot FM, Foundation programs, events, and community.
            </Text>

            <Card padding={Spacing.lg} gap={Spacing.md} style={{ marginTop: Spacing.lg }}>
              <Heading level={4}>About Swahilipot</Heading>
              <View style={styles.infoRow}>
                <Text variant="bodySmall" weight="600">Website</Text>
                <Text variant="bodySmall" color="secondary">swahilipot.org</Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="bodySmall" weight="600">Location</Text>
                <Text variant="bodySmall" color="secondary">Mombasa, Kenya</Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="bodySmall" weight="600">Contact</Text>
                <Text variant="bodySmall" color="secondary">info@swahilipot.org</Text>
              </View>
            </Card>
          </View>
        }
        data={TABS}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        columnWrapperStyle={columns > 1 ? { columnGap: Spacing.gapLarge } : undefined}
        renderItem={({ item }) => (
          <View style={[styles.item, { width: cardWidth }]}>
            <Link href={item.href} asChild>
              <Pressable asChild>
                <Card shadow="md" gap={Spacing.sm} onPress={() => {}}>
                  <Heading level={4}>{item.title}</Heading>
                  <Text variant="bodySmall" color="foregroundSecondary">
                    {item.summary}
                  </Text>
                </Card>
              </Pressable>
            </Link>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.gapLarge }} />}
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
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.lg,
    rowGap: Spacing.gapLarge,
  },
  header: {
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: Spacing.radius.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.md,
  },
  item: {
    flexGrow: 1,
  },
});
