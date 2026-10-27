import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton, PageHeading, PreviewNotice, SalesScreen } from '@/components/sales-ui';
import { useTheme } from '@/components/ui';
import { useAuth } from '@/features/auth/AuthProvider';
import { radius, spacing, typography } from '@/theme';

export default function ProfileScreen() {
  const { colors: theme } = useTheme();
  const { session } = useAuth();

  return (
    <SalesScreen>
      <PageHeading title="Your profile" subtitle="Account information for this session." />
      <PreviewNotice />
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Email</Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {session?.user.email ?? 'No signed-in account'}
        </Text>
      </View>
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Workspace</Text>
        <Text style={[styles.value, { color: theme.text }]}>Sample workspace</Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          Workspace membership and profile editing will be available after the secure tenant
          foundation is implemented.
        </Text>
      </View>
      <ActionButton
        label="Back to settings"
        onPress={() => router.replace('/(tabs)/settings')}
        secondary
      />
    </SalesScreen>
  );
}

const styles = StyleSheet.create({
  card: { padding: spacing.lg, borderWidth: 1, borderRadius: radius.lg, marginBottom: spacing.md },
  label: { ...typography.caption, marginBottom: spacing.xs },
  value: { ...typography.body, fontWeight: '600' },
  description: { ...typography.caption, lineHeight: 18, marginTop: spacing.sm },
});
