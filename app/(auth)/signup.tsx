import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';

import { Text, Heading, Button, TextInput, Alert, Card, Badge } from '@/components/ui';
import { Spacing } from '@/constants/Spacing';
import { useAuth } from '@/contexts/AuthContext';
import { validateEmail, validatePassword, getPasswordStrength } from '@/utils/validation';
import { View as ThemedView } from '@/components/Themed';

export default function SignupScreen() {
  const { signUp, isLoading, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordStrength = password ? getPasswordStrength(password) : null;

  // Clear errors when user starts typing
  useEffect(() => {
    if (error && (name || email || password)) {
      clearError();
    }
  }, [name, email, password, error, clearError]);

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'name':
        return !value.trim() ? 'Name is required' : '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        return !validateEmail(value) ? 'Invalid email format' : '';
      case 'password': {
        const validation = validatePassword(value);
        return !validation.isValid ? validation.errors[0] : '';
      }
      case 'confirmPassword':
        return value !== password ? 'Passwords do not match' : '';
      default:
        return '';
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    errors.name = validateField('name', name);
    errors.email = validateField('email', email);
    errors.password = validateField('password', password);
    errors.confirmPassword = validateField('confirmPassword', confirmPassword);

    setFieldErrors(errors);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    return Object.values(errors).every((e) => !e);
  };

  const handleSignUp = async () => {
    console.log('[SignupScreen] handleSignUp: Button pressed');

    // Validate
    if (!validate()) {
      console.log('[SignupScreen] handleSignUp: Validation failed', fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('[SignupScreen] handleSignUp: Starting signup for', email);
      const newUser = await signUp(email.trim(), password, name.trim());
      console.log('[SignupScreen] handleSignUp: Signup successful', newUser.id);
      // Navigation happens automatically when useAuth isSignedIn state changes
    } catch (err) {
      console.error('[SignupScreen] handleSignUp: Signup failed', err);
      // Error is already set in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = !isLoading && !isSubmitting && name && email && password && confirmPassword;

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
          scrollEnabled={true}
        >
          <View style={styles.header}>
            <Heading level={1}>Join Swahilipot</Heading>
            <Text variant="body" color="foregroundSecondary">
              Create your account to access everything
            </Text>
          </View>

          <Card padding={Spacing.lg} gap={Spacing.lg} shadow="md">
            {error && (
              <Alert
                type="error"
                message={error}
                title="Sign Up Failed"
              />
            )}

            <TextInput
              label="Full Name"
              placeholder="Your name"
              value={name}
              onChangeText={setName}
              onBlur={() => handleFieldBlur('name')}
              autoCapitalize="words"
              editable={!isLoading && !isSubmitting}
              error={touched.name ? fieldErrors.name : ''}
              icon="person"
            />

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

            <View style={styles.passwordSection}>
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

              {passwordStrength && (
                <View style={styles.strengthRow}>
                  <Text variant="caption" color="foregroundSecondary">
                    Strength:
                  </Text>
                  <Badge
                    label={passwordStrength.toUpperCase()}
                    variant={
                      passwordStrength === 'strong'
                        ? 'success'
                        : passwordStrength === 'medium'
                          ? 'warning'
                          : 'error'
                    }
                    size="sm"
                  />
                </View>
              )}
            </View>

            <TextInput
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onBlur={() => handleFieldBlur('confirmPassword')}
              secureTextEntry
              editable={!isLoading && !isSubmitting}
              error={touched.confirmPassword ? fieldErrors.confirmPassword : ''}
              icon="lock"
            />

            <Button
              onPress={handleSignUp}
              disabled={!canSubmit}
              loading={isSubmitting}
              fullWidth
              size="lg"
            >
              Create Account
            </Button>
          </Card>

          <View style={styles.footer}>
            <Text variant="body" color="foregroundSecondary">
              Already have an account?{' '}
            </Text>
            <Link href="/(auth)/login" asChild>
              <Text
                variant="body"
                weight="600"
                color="secondary"
                style={{ textDecorationLine: 'underline' }}
              >
                Sign in
              </Text>
            </Link>
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
  passwordSection: {
    gap: Spacing.sm,
  },
  strengthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xl,
  },
});
