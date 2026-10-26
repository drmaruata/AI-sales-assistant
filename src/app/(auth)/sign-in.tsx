import { useState } from 'react';
import { Link, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Body, Button, Field, FormError, Screen, Title, useTheme } from '@/components/ui';
import { useAuth } from '@/features/auth/AuthProvider';
import { signInSchema, type SignInValues } from '@/features/auth/validation';
import { logError } from '@/lib/errors';

const EMPTY: SignInValues = { email: '', password: '' };

export default function SignInScreen() {
  const { colors: theme } = useTheme();
  const { signIn } = useAuth();
  const [values, setValues] = useState<SignInValues>(EMPTY);
  const [issues, setIssues] = useState<Partial<Record<keyof SignInValues, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof SignInValues>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit() {
    const parsed = signInSchema.safeParse(values);
    if (!parsed.success) {
      const nextIssues: Partial<Record<keyof SignInValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === 'string') {
          nextIssues[field as keyof SignInValues] = issue.message;
        }
      }
      setIssues(nextIssues);
      return;
    }

    setIssues({});
    setFormError(null);
    setSubmitting(true);
    try {
      const { error } = await signIn(parsed.data.email, parsed.data.password);
      if (error) {
        setFormError(error);
        return;
      }
      router.replace('/(tabs)');
    } catch (error) {
      logError('sign-in', error);
      setFormError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen testID="sign-in-screen">
      <Title>Sign in</Title>
      <Body>Use your workspace account to continue.</Body>

      <View style={styles.form}>
        <Field
          label="Email"
          value={values.email}
          onChangeText={(value) => update('email', value)}
          error={issues.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          placeholder="you@example.com"
        />
        <Field
          label="Password"
          value={values.password}
          onChangeText={(value) => update('password', value)}
          error={issues.password}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="current-password"
          textContentType="password"
          placeholder="Your password"
        />

        <FormError message={formError} testID="sign-in-error" />

        <Button
          label={submitting ? 'Signing in' : 'Sign in'}
          onPress={onSubmit}
          loading={submitting}
          disabled={submitting}
          testID="sign-in-submit"
        />

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            No account yet?
          </Text>
          <Link href="/(auth)/sign-up" style={[styles.link, { color: theme.accent }]}>
            Create one
          </Link>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { marginTop: 8 },
  footer: { flexDirection: 'row', gap: 8, marginTop: 24, alignItems: 'center' },
  footerText: { fontSize: 14 },
  link: { fontSize: 14, fontWeight: '600' },
});
