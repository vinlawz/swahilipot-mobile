import React from 'react';
import { View, FlatList, Pressable, StyleSheet } from 'react-native';
import { Text, Heading, Card } from '@/components/ui';
import { Colors } from '@/constants/Theme';
import { Spacing } from '@/constants/Spacing';
import { useColorScheme } from '@/components/useColorScheme';
import { View as ThemedView } from '@/components/Themed';

const MOCK_CHATS = [
  {
    id: '1',
    name: 'Tech Team',
    type: 'group',
    lastMessage: 'Anyone free for a sync?',
    unread: 3,
    avatar: 'T',
  },
  {
    id: '2',
    name: 'FM Show Planning',
    type: 'group',
    lastMessage: 'Next week schedule is ready',
    unread: 0,
    avatar: 'F',
  },
  {
    id: '3',
    name: 'Programs Initiatives',
    type: 'group',
    lastMessage: 'Youth summit updates shared',
    unread: 5,
    avatar: 'P',
  },
];

export default function MessagesScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={MOCK_CHATS}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.chatItem}>
            <View style={[styles.avatar, { backgroundColor: theme.secondary }]}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                {item.avatar}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="body" weight="600">
                {item.name}
              </Text>
              <Text variant="bodySmall" color="foregroundSecondary" numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>
            {item.unread > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.secondary }]}>
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
                  {item.unread}
                </Text>
              </View>
            )}
          </Pressable>
        )}
        ListHeaderComponent={
          <View style={{ marginBottom: Spacing.lg }}>
            <Heading level={2}>Messages</Heading>
            <Text variant="bodySmall" color="foregroundSecondary">
              Connect with your team
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: theme.border }} />
        )}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.screenPadding,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
