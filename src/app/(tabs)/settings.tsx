import { Host, List, ListItem, Switch, Text as NativeText } from '@expo/ui';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { PageHeading, PreviewNotice, SalesScreen } from '@/components/sales-ui';
import { useTheme } from '@/components/ui';
import { useAuth } from '@/features/auth/AuthProvider';
import { logError } from '@/lib/errors';
import { spacing, typography } from '@/theme';

export default function SettingsScreen() {
  const { name, colors: theme, setThemePreference } = useTheme();
  const { session, signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  async function onAppearanceChange(isDark: boolean) {
    setError(null);
    try {
      await setThemePreference(isDark ? 'dark' : 'light');
    } catch {
      setError('Your appearance changed, but the preference could not be saved.');
    }
  }

  async function onSignOut() {
    setError(null);
    setSigningOut(true);
    try {
      await signOut();
      router.replace('/(auth)/sign-in');
    } catch (cause) {
      logError('sign-out', cause);
      setError('Could not sign out. Please try again.');
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <SalesScreen>
      <PageHeading title="Settings" subtitle="Your account and workspace" />
      <PreviewNotice />
      {error ? (
        <Text accessibilityRole="alert" style={[styles.error, { color: theme.danger }]}>
          {error}
        </Text>
      ) : null}
      <Host colorScheme={name} style={styles.nativeHost}>
        <List>
          <NativeText textStyle={{ ...styles.sectionHeader, color: theme.textSecondary }}>
            APPEARANCE
          </NativeText>
          <ListItem
            supportingText="Use a dark color palette throughout the app"
            trailing={
              <Switch
                value={name === 'dark'}
                onValueChange={(value) => {
                  void onAppearanceChange(value);
                }}
              />
            }
          >
            Dark appearance
          </ListItem>

          <NativeText textStyle={{ ...styles.sectionHeader, color: theme.textSecondary }}>
            ACCOUNT
          </NativeText>
          <ListItem
            onPress={() => router.push('/profile')}
            supportingText={session?.user.email ?? 'View your account details'}
            trailing={<NativeText textStyle={{ color: theme.textSecondary }}>›</NativeText>}
          >
            Account
          </ListItem>
          <ListItem
            onPress={() => router.push('/business-profile')}
            supportingText="Business facts and reply tone used in draft previews"
            trailing={<NativeText textStyle={{ color: theme.textSecondary }}>›</NativeText>}
          >
            Business profile
          </ListItem>
          <ListItem
            onPress={() => router.push('/follow-ups')}
            supportingText="Review upcoming and completed follow-ups"
            trailing={<NativeText textStyle={{ color: theme.textSecondary }}>›</NativeText>}
          >
            Follow-ups
          </ListItem>

          <NativeText textStyle={{ ...styles.sectionHeader, color: theme.textSecondary }}>
            PRIVACY
          </NativeText>
          <ListItem
            onPress={() => router.push('/data-controls')}
            supportingText="Manage your preview data"
            trailing={<NativeText textStyle={{ color: theme.textSecondary }}>›</NativeText>}
          >
            Privacy and data controls
          </ListItem>
          <ListItem
            onPress={() => router.push('/setup-preview')}
            supportingText="Review the onboarding flow"
            trailing={<NativeText textStyle={{ color: theme.textSecondary }}>›</NativeText>}
          >
            Onboarding setup preview
          </ListItem>
          <ListItem
            onPress={() => {
              void onSignOut();
            }}
            supportingText={signingOut ? 'Ending your session…' : 'Sign out of this account'}
          >
            {signingOut ? 'Signing out…' : 'Sign out'}
          </ListItem>
        </List>
      </Host>
    </SalesScreen>
  );
}

const styles = StyleSheet.create({
  nativeHost: { flex: 1 },
  sectionHeader: { fontSize: 12, fontWeight: '600', letterSpacing: 0.6 },
  error: { ...typography.caption, marginBottom: spacing.sm },
});
