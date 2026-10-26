import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Body, Button, Screen, Title, useTheme } from '@/components/ui';
import { useAuth } from '@/features/auth/AuthProvider';
import { logError } from '@/lib/errors';

export default function TodayScreen() {
  const { colors: theme } = useTheme();
  const { session, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSignOut() {
    setError(null);
    setSigningOut(true);
    try {
      await signOut();
    } catch (cause) {
      logError('sign-out', cause);
      setError('Could not sign out. Please try again.');
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <Screen testID="today-screen">
      <Title>Today</Title>
      <Body>
        No follow-ups yet. Leads and follow-ups arrive in the next slice.
      </Body>

      <View style={styles.block}>
        <Text style={[styles.meta, { color: theme.textSecondary }]}>
          Signed in as {session?.user.email ?? 'unknown account'}
        </Text>
        {error ? (
          <Text accessibilityRole="alert" style={[styles.error, { color: theme.danger }]}>
            {error}
          </Text>
        ) : null}
        <Button
          label={signingOut ? 'Signing out' : 'Sign out'}
          onPress={onSignOut}
          loading={signingOut}
          disabled={signingOut}
          variant="secondary"
          testID="sign-out"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { marginTop: 24, gap: 12 },
  meta: { fontSize: 13 },
  error: { fontSize: 13 },
});
