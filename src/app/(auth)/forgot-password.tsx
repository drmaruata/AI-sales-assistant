import { useState } from 'react';
import { Link } from 'expo-router';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import { Body, Button, Field, FormError, Screen, Title, useTheme } from '@/components/ui';
import { emailSchema } from '@/features/auth/validation';
import { logError, toUserMessage } from '@/lib/errors';
import { getSupabaseClient } from '@/lib/supabase';
import { spacing } from '@/theme';

export default function ForgotPasswordScreen() {
  const { colors: theme } = useTheme();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Enter a valid email address.');
      setNotice(null);
      return;
    }

    setSubmitting(true);
    setError(null);
    setNotice(null);
    try {
      const { error: requestError } = await getSupabaseClient().auth.resetPasswordForEmail(parsed.data);
      if (requestError) {
        setError(toUserMessage(requestError));
        return;
      }
      setNotice('If an account exists for this email, a password reset link will arrive shortly.');
    } catch (cause) {
      logError('password-reset', cause);
      setError('Could not request a password reset. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen testID="forgot-password-screen">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Title>Reset password</Title>
        <Body>Enter the email for your account. We’ll send a reset link if it is registered.</Body>
        <View style={styles.form}>
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            placeholder="you@example.com"
          />
          <FormError message={error} />
          {notice ? (
            <Text accessibilityRole="alert" style={[styles.notice, { color: theme.success }]}>
              {notice}
            </Text>
          ) : null}
          <Button
            label={submitting ? 'Sending reset link' : 'Send reset link'}
            onPress={submit}
            loading={submitting}
            disabled={submitting}
          />
          <Link href="/(auth)/sign-in" style={[styles.link, { color: theme.accent }]}>
            Back to sign in
          </Link>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { marginTop: spacing.xl },
  notice: { fontSize: 13, lineHeight: 19, marginBottom: spacing.md },
  link: { alignSelf: 'center', marginTop: spacing.xl, fontSize: 14, fontWeight: '600' },
});
