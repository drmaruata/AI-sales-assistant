import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PageHeading, PreviewNotice, SalesScreen } from '@/components/sales-ui';
import { useTheme } from '@/components/ui';
import { radius, spacing, typography } from '@/theme';

export default function DataControlsScreen() {
  const { colors: theme } = useTheme();

  function explainUnavailable(action: 'export' | 'delete') {
    Alert.alert(
      action === 'export' ? 'Export not connected' : 'Deletion not connected',
      action === 'export'
        ? 'No export has been created. Secure workspace export will be implemented after tenant isolation.'
        : 'No account or workspace has been deleted. The secure deletion workflow will be implemented after tenant isolation.'
    );
  }

  return (
    <SalesScreen padded={false}>
      <ScrollView contentContainerStyle={styles.content}>
        <PageHeading title="Data controls" subtitle="Understand what is available in this UI preview." />
        <PreviewNotice />
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.heading, { color: theme.text }]}>Export your workspace</Text>
          <Text style={[styles.body, { color: theme.textSecondary }]}>
            A production export should include your workspace, leads, notes, and follow-ups in a portable format.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => explainUnavailable('export')}
            style={[styles.button, { borderColor: theme.border }]}
          >
            <Text style={[styles.buttonText, { color: theme.accent }]}>Check export availability</Text>
          </Pressable>
        </View>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.heading, { color: theme.text }]}>Delete your account</Text>
          <Text style={[styles.body, { color: theme.textSecondary }]}>
            Account deletion must verify ownership, explain which workspace data is affected, and complete securely. This preview will not delete anything.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => explainUnavailable('delete')}
            style={[styles.button, { borderColor: theme.danger }]}
          >
            <Text style={[styles.buttonText, { color: theme.danger }]}>Review deletion requirements</Text>
          </Pressable>
        </View>
        <Text style={[styles.disclaimer, { color: theme.textSecondary }]}>
          Lead edits in this prototype live only in memory. Do not enter real customer data.
        </Text>
      </ScrollView>
    </SalesScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  card: { padding: spacing.lg, borderWidth: 1, borderRadius: radius.lg, marginBottom: spacing.md },
  heading: { ...typography.heading, marginBottom: spacing.sm },
  body: { ...typography.body, lineHeight: 22 },
  button: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start', borderWidth: 1, borderRadius: radius.md, paddingHorizontal: spacing.md, marginTop: spacing.lg },
  buttonText: { ...typography.label },
  disclaimer: { ...typography.caption, lineHeight: 18, marginTop: spacing.sm },
});
