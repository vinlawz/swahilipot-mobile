import { Link } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, useWindowDimensions, View, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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

            {/* 10-Year Anniversary Celebration Banner */}
            <View style={{ marginTop: Spacing.xl, gap: Spacing.md }}>
              <LinearGradient
                colors={[theme.anniversary, theme.anniversaryOrange]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.celebrationBanner}
              >
                <View style={styles.celebrationContent}>
                  <Text
                    variant="labelSmall"
                    color="primaryForeground"
                    style={{ textTransform: 'uppercase', letterSpacing: 2, fontSize: 12 }}
                  >
                    Celebrating a Decade of Impact
                  </Text>
                  <Heading level={1} style={{ color: '#ffffff', marginVertical: Spacing.sm }}>
                    Swahilipot@10
                  </Heading>
                  <View style={styles.decadeText}>
                    <Text style={[styles.decadeLabel, { color: '#ffffff' }]}>
                      THE DECADE
                    </Text>
                    <Text style={[styles.decadeSubtitle, { color: '#ffffff' }]}>
                      10 Years of Transformation
                    </Text>
                  </View>
                </View>

                {/* Decorative accent bars */}
                <View style={styles.accentBars}>
                  <View style={[styles.bar, { backgroundColor: theme.anniversaryPurple }]} />
                  <View style={[styles.bar, { backgroundColor: theme.anniversaryCyan }]} />
                  <View style={[styles.bar, { backgroundColor: theme.anniversaryOrange }]} />
                </View>
              </LinearGradient>

              <Card padding={Spacing.lg} gap={Spacing.md} style={{ backgroundColor: theme.anniversaryLight }}>
                <Text variant="bodySmall" weight="600" style={{ color: theme.anniversary }}>
                  Our Journey
                </Text>
                <Text variant="body" style={{ color: theme.primary, lineHeight: 1.6 }}>
                  How a single room of ambition became a coastal institution — told through the people, the programmes, and the places that built it.
                </Text>

                {/* Timeline Milestones */}
                <View style={styles.timelineContainer}>
                  <View style={styles.timelineItem}>
                    <View style={[styles.timelineMarker, { backgroundColor: theme.anniversary }]} />
                    <View style={styles.timelineContent}>
                      <Text variant="labelSmall" weight="600" style={{ color: theme.anniversary }}>
                        Founded
                      </Text>
                      <Text variant="bodySmall" style={{ color: theme.primary }}>
                        Established to empower coastal youth
                      </Text>
                    </View>
                  </View>

                  <View style={styles.timelineItem}>
                    <View style={[styles.timelineMarker, { backgroundColor: theme.anniversaryPurple }]} />
                    <View style={styles.timelineContent}>
                      <Text variant="labelSmall" weight="600" style={{ color: theme.anniversaryPurple }}>
                        2018
                      </Text>
                      <Text variant="bodySmall" style={{ color: theme.primary }}>
                        First thousand youth reached
                      </Text>
                    </View>
                  </View>

                  <View style={styles.timelineItem}>
                    <View style={[styles.timelineMarker, { backgroundColor: theme.anniversaryCyan }]} />
                    <View style={styles.timelineContent}>
                      <Text variant="labelSmall" weight="600" style={{ color: theme.anniversaryCyan }}>
                        2020
                      </Text>
                      <Text variant="bodySmall" style={{ color: theme.primary }}>
                        Extended impact beyond Mombasa
                      </Text>
                    </View>
                  </View>

                  <View style={styles.timelineItem}>
                    <View style={[styles.timelineMarker, { backgroundColor: theme.anniversaryOrange }]} />
                    <View style={styles.timelineContent}>
                      <Text variant="labelSmall" weight="600" style={{ color: theme.anniversaryOrange }}>
                        2023
                      </Text>
                      <Text variant="bodySmall" style={{ color: theme.primary }}>
                        Programs adapted for online platforms
                      </Text>
                    </View>
                  </View>

                  <View style={styles.timelineItem}>
                    <View style={[styles.timelineMarker, { backgroundColor: theme.anniversary, borderWidth: 3, borderColor: theme.anniversaryOrange }]} />
                    <View style={styles.timelineContent}>
                      <Text variant="labelSmall" weight="600" style={{ color: theme.anniversary }}>
                        2026 — 10 Years
                      </Text>
                      <Text variant="bodySmall" style={{ color: theme.primary, fontWeight: '600' }}>
                        A full decade of transformation
                      </Text>
                    </View>
                  </View>
                </View>

                <Pressable
                  style={[
                    styles.ctaButton,
                    { backgroundColor: theme.anniversary, marginTop: Spacing.md },
                  ]}
                >
                  <Text variant="labelSmall" style={{ color: '#ffffff', fontWeight: '600' }}>
                    Explore Our Story
                  </Text>
                </Pressable>
              </Card>
            </View>
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
  celebrationBanner: {
    borderRadius: Spacing.radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    overflow: 'hidden',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  celebrationContent: {
    gap: Spacing.sm,
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  decadeText: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  decadeLabel: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  decadeSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  accentBars: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  ctaButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Spacing.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineContainer: {
    gap: Spacing.md,
    marginTop: Spacing.md,
    paddingLeft: Spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: '#e5e7eb',
  },
  timelineItem: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
  timelineMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 2,
    marginLeft: -11,
  },
  timelineContent: {
    flex: 1,
    gap: Spacing.xs,
  },
});
