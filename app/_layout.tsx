import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import PlayerProvider from '@/components/AudioPlayer';
import FloatingPlayer from '@/components/FloatingPlayer';
import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import React from 'react';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isSignedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <LoadingSpinner text="Loading..." />
          </View>
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <PlayerProvider>
          <View style={{ flex: 1 }}>
            {isSignedIn ? (
              <>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
                </Stack>
                <FloatingPlayer />
              </>
            ) : (
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              </Stack>
            )}
          </View>
        </PlayerProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
