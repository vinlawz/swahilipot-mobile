import { StyleSheet, View } from 'react-native';

import { Text as ThemedText, View as ThemedView } from '@/components/Themed';
import React from 'react';

export default function FoundationScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Swahilipot Foundation</ThemedText>
      <ThemedText style={styles.subtitle}>Programs, community events, and youth upskilling.</ThemedText>
      <View style={styles.card}>
        <ThemedText style={styles.cardTitle}>Initiatives</ThemedText>
        <ThemedText style={styles.cardBody}>Surface featured programs or projects.</ThemedText>
      </View>
      <View style={styles.card}>
        <ThemedText style={styles.cardTitle}>Get Involved</ThemedText>
        <ThemedText style={styles.cardBody}>Calls-to-action for volunteering or membership.</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  card: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
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
