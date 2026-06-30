import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';

import { Text, Heading, Button, TextInput, Alert, Card } from '@/components/ui';
import { Spacing } from '@/constants/Spacing';
import { useAuth } from '@/contexts/AuthContext';
import { validateEmail } from '@/utils/validation';
import { View as ThemedView } from '@/components/Themed';

export default function LoginScreen() {
  const { signIn, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear errors when user starts typing
  useEffect(() => {
    if (error && (email || password)) {
      clearError();
    }
  }, [email, password, error, clearError]);

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'email':
        if (!value.trim()) return 'Email is required';
        return !validateEmail(value) ? 'Invalid email format' : '';
      case 'password':
        if (!value) return 'Password is required';
        return value.length < 6 ? 'Password must be at least 6 characters' : '';
      default:
        return '';
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    errors.email = validateField('email', email);
    errors.password = validateField('password', password);

    setFieldErrors(errors);
    setTouched({ email: true, password: true });

    return Object.values(errors).every((e) => !e);
  };

  const handleSignIn = async () => {
    console.log('[LoginScreen] handleSignIn: Button pressed');

    if (!validate()) {
      console.log('[LoginScreen] handleSignIn: Validation failed', fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('[LoginScreen] handleSignIn: Starting signin for', email);
      const user = await signIn(email.trim(), password);
      console.log('[LoginScreen] handleSignIn: Signin successful', user.id);
      // Navigation happens automatically when useAuth isSignedIn state changes
    } catch (err) {
      console.error('[LoginScreen] handleSignIn: Signin failed', err);
      // Error is already set in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = !isLoading && !isSubmitting && email && password;

  const handleFieldBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ThemedView style={styles.background}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Heading level={1}>Welcome Back</Heading>
            <Text variant="body" color="foregroundSecondary">
              Sign in to access Swahilipot FM, programs, and events
            </Text>
          </View>

          <Card padding={Spacing.lg} gap={Spacing.lg} shadow="md">
            {error && (
              <Alert
                type="error"
                message={error}
                title="Sign In Failed"
              />
            )}

            <TextInput
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              onBlur={() => handleFieldBlur('email')}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading && !isSubmitting}
              error={touched.email ? fieldErrors.email : ''}
              icon="mail"
            />

            <TextInput
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              onBlur={() => handleFieldBlur('password')}
              secureTextEntry
              editable={!isLoading && !isSubmitting}
              error={touched.password ? fieldErrors.password : ''}
              icon="lock"
            />

            <Button
              onPress={handleSignIn}
              disabled={!canSubmit}
              loading={isSubmitting}
              fullWidth
              size="lg"
            >
              Sign In
            </Button>
          </Card>

          <View style={styles.footer}>
            <Text variant="body" color="foregroundSecondary">
              Don't have an account?{' '}
            </Text>
            <Link href="/(auth)/signup" asChild>
              <Text
                variant="body"
                weight="600"
                color="secondary"
                style={{ textDecorationLine: 'underline' }}
              >
                Sign up
              </Text>
            </Link>
          </View>

          <View style={styles.helpText}>
            <Text variant="caption" color="foregroundSecondary" style={{ textAlign: 'center' }}>
              Having trouble? Contact us at info@swahilipot.org
            </Text>
          </View>
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: Spacing.screenPadding,
    gap: Spacing.lg,
    justifyContent: 'center',
  },
  header: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xl,
  },
  helpText: {
    marginTop: Spacing.lg,
  },
});
