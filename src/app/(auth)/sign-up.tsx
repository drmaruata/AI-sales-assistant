import { useState } from 'react';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Body, Button, Field, FormError, Screen, Title, useTheme } from '@/components/ui';
import { useAuth } from '@/features/auth/AuthProvider';
import { signUpIssues, type SignUpValues } from '@/features/auth/validation';
import { logError } from '@/lib/errors';

const EMPTY: SignUpValues = { email: '', password: '', confirmPassword: '' };

export default function SignUpScreen() {
  const { colors: theme } = useTheme();
  const { signUp } = useAuth();
  const [values, setValues] = useState<SignUpValues>(EMPTY);
  const [issues, setIssues] = useState<Partial<Record<keyof SignUpValues, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof SignUpValues>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit() {
    const nextIssues = signUpIssues(values);
    setIssues(nextIssues);
    if (Object.keys(nextIssues).length > 0) {
      return;
    }

    setFormError(null);
    setNotice(null);
    setSubmitting(true);
    try {
      const { error } = await signUp(values.email, values.password);
      if (error) {
        setFormError(error);
        return;
      }
      setValues(EMPTY);
      setNotice('Account created. Confirm your email if your project requires it, then sign in.');
    } catch (error) {
      logError('sign-up', error);
      setFormError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen testID="sign-up-screen">
      <Title>Create account</Title>
      <Body>One account per workspace owner for now.</Body>

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
          autoComplete="new-password"
          textContentType="newPassword"
          placeholder="At least 8 characters"
        />
        <Field
          label="Confirm password"
          value={values.confirmPassword}
          onChangeText={(value) => update('confirmPassword', value)}
          error={issues.confirmPassword}
          secureTextEntry
          autoCapitalize="none"
          textContentType="newPassword"
          placeholder="Repeat your password"
        />

        <FormError message={formError} testID="sign-up-error" />
        {notice ? (
          <Text accessibilityRole="alert" style={[styles.notice, { color: theme.success }]}>
            {notice}
          </Text>
        ) : null}

        <Button
          label={submitting ? 'Creating account' : 'Create account'}
          onPress={onSubmit}
          loading={submitting}
          disabled={submitting}
          testID="sign-up-submit"
        />

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Already have an account?
          </Text>
          <Link href="/(auth)/sign-in" style={[styles.link, { color: theme.accent }]}>
            Sign in
          </Link>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { marginTop: 8 },
  notice: { fontSize: 13, marginBottom: 12 },
  footer: { flexDirection: 'row', gap: 8, marginTop: 24, alignItems: 'center' },
  footerText: { fontSize: 14 },
  link: { fontSize: 14, fontWeight: '600' },
});
