import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import {
  ActionButton,
  BackLink,
  Card,
  PageHeading,
  PreviewNotice,
  SalesScreen,
} from '@/components/sales-ui';
import { useTheme } from '@/components/ui';
import { useAuth } from '@/features/auth/AuthProvider';
import { spacing, typography } from '@/theme';

export default function ProfileScreen() {
  const { colors: theme } = useTheme();
  const { session } = useAuth();

  return (
    <SalesScreen>
      <BackLink label="Settings" onPress={() => router.back()} />
      <PageHeading title="Your profile" subtitle="Account information for this session." />
      <PreviewNotice />
      <Card style={styles.card}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Email</Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {session?.user.email ?? 'No signed-in account'}
        </Text>
      </Card>
      <Card style={styles.card}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Workspace</Text>
        <Text style={[styles.value, { color: theme.text }]}>Sample workspace</Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          Workspace membership and profile editing will be available after the secure tenant
          foundation is implemented.
        </Text>
      </Card>
      <ActionButton
        label="Back to settings"
        onPress={() => router.replace('/(tabs)/settings')}
        secondary
      />
    </SalesScreen>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  label: { ...typography.caption, marginBottom: spacing.xs },
  value: { ...typography.body, fontWeight: '600' },
  description: { ...typography.caption, lineHeight: 18, marginTop: spacing.sm },
});
