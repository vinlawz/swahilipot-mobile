import React, { useState } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text, Heading, Card, Button, LoadingSpinner } from '@/components/ui';
import { Spacing } from '@/constants/Spacing';
import { Colors } from '@/constants/Theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';
import { View as ThemedView } from '@/components/Themed';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { user, signOut, isLoading } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner text="Loading profile..." fullScreen />
      </ThemedView>
    );
  }

  const handleLogout = async () => {
    console.log('[ProfileScreen] handleLogout: Logout button pressed');
    setIsLoggingOut(true);
    try {
      await signOut();
      console.log('[ProfileScreen] handleLogout: Logout successful, navigation to auth should occur');
    } catch (err) {
      console.error('[ProfileScreen] handleLogout: Logout failed', err);
      setIsLoggingOut(false);
    }
  };

  const profileData = [
    {
      id: 'account',
      title: 'Account',
      items: [
        { label: 'Name', value: user.name || 'Not provided' },
        { label: 'Email', value: user.email },
        { label: 'User ID', value: user.id.substring(0, 12) + '...' },
      ],
    },
    {
      id: 'membership',
      title: 'Membership',
      items: [
        { label: 'Status', value: 'Active' },
        { label: 'Plan', value: user.membership || 'Community Member' },
        { label: 'Joined', value: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today' },
      ],
    },
  ];

  return (
    <ThemedView style={{ flex: 1 }}>
      <FlatList
        data={profileData}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.avatarSection}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: theme.secondary,
                  opacity: 0.15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialIcons name="account-circle" size={60} color={theme.secondary} />
              </View>
              <View style={{ gap: Spacing.xs }}>
                <Heading level={2}>{user.name}</Heading>
                <Text variant="bodySmall" color="foregroundSecondary">{user.membership || 'Community Member'}</Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View key={item.id} style={styles.section}>
            <Heading level={4} style={{ marginBottom: Spacing.md }}>
              {item.title}
            </Heading>
            <Card gap={Spacing.md}>
              {item.items.map((info, idx) => (
                <View
                  key={idx}
                  style={{
                    paddingBottom: idx < item.items.length - 1 ? Spacing.md : 0,
                    borderBottomWidth: idx < item.items.length - 1 ? 1 : 0,
                    borderBottomColor: theme.border,
                  }}
                >
                  <Text variant="bodySmall" color="foregroundSecondary">
                    {info.label}
                  </Text>
                  <Text variant="body" weight="600" style={{ marginTop: Spacing.xs }}>
                    {info.value}
                  </Text>
                </View>
              ))}
            </Card>
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
          <View style={styles.footer}>
            <Card gap={Spacing.lg} padding={Spacing.lg}>
              <View>
                <Heading level={4}>Preferences</Heading>
                <Text variant="bodySmall" color="foregroundSecondary" style={{ marginTop: Spacing.sm }}>
                  Customize your experience
                </Text>
              </View>

              <View style={styles.settingRow}>
                <View style={{ flex: 1, gap: Spacing.xs }}>
                  <Text variant="body" weight="600">Dark Mode</Text>
                  <Text variant="bodySmall" color="foregroundSecondary">Toggle dark theme</Text>
                </View>
                <View
                  style={{
                    width: 50,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: darkMode ? theme.primary : theme.gray300,
                    justifyContent: 'center',
                    alignItems: darkMode ? 'flex-end' : 'flex-start',
                    paddingHorizontal: 2,
                  }}
                >
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: '#fff',
                    }}
                  />
                </View>
              </View>

              <View style={styles.settingRow}>
                <View style={{ flex: 1, gap: Spacing.xs }}>
                  <Text variant="body" weight="600">Notifications</Text>
                  <Text variant="bodySmall" color="foregroundSecondary">Receive updates</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={theme.gray400} />
              </View>
            </Card>

            <Button
              onPress={handleLogout}
              disabled={isLoggingOut}
              loading={isLoggingOut}
              variant="ghost"
              size="lg"
              fullWidth
              icon={<MaterialIcons name="logout" size={20} />}
              style={{ marginTop: Spacing.lg }}
            >
              Log Out
            </Button>
          </View>
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
    marginBottom: Spacing.xxl,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
});
