import React from 'react';
import { FlatList, View, StyleSheet, Linking, Pressable } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { Text, Heading, Card } from '@/components/ui';
import { Spacing } from '@/constants/Spacing';
import { Colors } from '@/constants/Theme';
import { useColorScheme } from '@/components/useColorScheme';
import { View as ThemedView } from '@/components/Themed';
import { SWAHILIPOT_SOCIALS } from '@/lib/swahilipotSocials';

const getIconComponent = (iconName: string, color: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'play-circle': <MaterialIcons name="play-circle-filled" size={32} color={color} />,
    camera: <MaterialCommunityIcons name="camera" size={32} color={color} />,
    twitter: <MaterialCommunityIcons name="twitter" size={32} color={color} />,
    facebook: <MaterialCommunityIcons name="facebook" size={32} color={color} />,
    message: <MaterialCommunityIcons name="whatsapp" size={32} color={color} />,
  };
  return iconMap[iconName];
};

export default function SocialsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const handleOpenSocial = (name: string, url: string) => {
    console.log('[Socials] Opening', name, url);
    Linking.openURL(url).catch((err) => {
      console.error('[Socials] Failed to open URL:', err);
    });
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <FlatList
        data={SWAHILIPOT_SOCIALS}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View style={styles.header}>
            <Heading level={1}>Connect With Us</Heading>
            <Text variant="body" color="foregroundSecondary">
              Follow Swahilipot on your favorite platform
            </Text>

            {/* Stats Card */}
            <Card padding={Spacing.lg} gap={Spacing.md} shadow="sm" style={{ marginTop: Spacing.md }}>
              <Text variant="bodySmall" color="foregroundSecondary">
                Join our growing community across all platforms
              </Text>
              <View style={{ flexDirection: 'row', gap: Spacing.md }}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Heading level={3} style={{ fontSize: 20 }}>5</Heading>
                  <Text variant="caption" color="foregroundSecondary">
                    Platforms
                  </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Heading level={3} style={{ fontSize: 20 }}>100K+</Heading>
                  <Text variant="caption" color="foregroundSecondary">
                    Followers
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleOpenSocial(item.name, item.url)}
            android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
          >
            <Card
              shadow="md"
              padding={Spacing.lg}
              gap={Spacing.md}
              style={{
                borderLeftWidth: 4,
                borderLeftColor: item.color,
                overflow: 'hidden',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Icon & Info */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 }}>
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: Spacing.radius.lg,
                      backgroundColor: item.color,
                      opacity: 0.15,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {getIconComponent(item.icon, item.color)}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Heading level={4} style={{ color: item.color }}>
                      {item.name}
                    </Heading>
                    {item.handle && (
                      <Text variant="bodySmall" color="foregroundSecondary">
                        {item.handle}
                      </Text>
                    )}
                    <Text variant="caption" color="foregroundSecondary" style={{ marginTop: Spacing.xs }}>
                      {item.description}
                    </Text>
                  </View>
                </View>

                {/* Arrow */}
                <MaterialIcons name="arrow-forward" size={24} color={item.color} />
              </View>
            </Card>
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={{ paddingVertical: Spacing.lg, gap: Spacing.md }}>
            <Card padding={Spacing.lg} gap={Spacing.md} shadow="sm" style={{ backgroundColor: theme.backgroundSecondary }}>
              <Text variant="body" weight="600">
                Stay Updated
              </Text>
              <Text variant="bodySmall" color="foregroundSecondary">
                Subscribe to our channels to get the latest news, shows, and community updates directly to your favorite platform.
              </Text>
            </Card>

            <Text variant="caption" color="foregroundSecondary" style={{ textAlign: 'center', paddingVertical: Spacing.md }}>
              {SWAHILIPOT_SOCIALS.length} platforms • 100K+ community members
            </Text>
          </View>
        }
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
