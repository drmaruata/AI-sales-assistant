import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text } from 'react-native';

import { ListRow, PageHeading, SalesScreen } from '@/components/sales-ui';
import { useTheme } from '@/components/ui';
import { useAuth } from '@/features/auth/AuthProvider';
import { logError } from '@/lib/errors';
import { spacing, TAB_BAR_CLEARANCE, typography } from '@/theme';

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
    <SalesScreen padded={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageHeading title="Settings" subtitle="Your account and workspace" />
        {error ? (
          <Text accessibilityRole="alert" style={[styles.error, { color: theme.danger }]}>
            {error}
          </Text>
        ) : null}

        <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>APPEARANCE</Text>
        <ListRow
          title="Dark appearance"
          description="Use a dark color palette throughout the app"
          tone="accent"
          trailing={
            <Switch
              accessibilityLabel="Dark appearance"
              value={name === 'dark'}
              onValueChange={(value) => {
                void onAppearanceChange(value);
              }}
            />
          }
        />

        <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>ACCOUNT</Text>
        <ListRow
          title="Account"
          description={session?.user.email ?? 'View your account details'}
          icon="person"
          tone="accent"
          onPress={() => router.push('/profile')}
        />
        <ListRow
          title="Business profile"
          description="Business facts and reply tone used in draft previews"
          icon="storefront"
          tone="peach"
          onPress={() => router.push('/business-profile')}
        />

        <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>PRIVACY</Text>
        <ListRow
          title="Privacy and data controls"
          description="Manage your preview data"
          icon="settings"
          tone="sky"
          onPress={() => router.push('/data-controls')}
        />
        <ListRow
          title="Onboarding setup preview"
          description="Review the onboarding flow"
          icon="sparkles"
          tone="mint"
          onPress={() => router.push('/setup-preview')}
        />

        <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>SESSION</Text>
        <ListRow
          title={signingOut ? 'Signing out…' : 'Sign out'}
          description="Sign out of this account"
          icon="close"
          tone="danger"
          onPress={signingOut ? undefined : () => void onSignOut()}
        />
      </ScrollView>
    </SalesScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: TAB_BAR_CLEARANCE,
    gap: spacing.sm,
  },
  sectionHeader: {
    ...typography.caption,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  error: { ...typography.caption, marginBottom: spacing.sm },
});
