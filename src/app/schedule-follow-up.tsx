import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, TextInput } from 'react-native';

import { ActionButton, PageHeading, PreviewNotice, SalesScreen } from '@/components/sales-ui';
import { useTheme } from '@/components/ui';
import { usePreviewLeads } from '@/features/leads/PreviewLeadsProvider';
import { radius, spacing, typography } from '@/theme';

export default function ScheduleFollowUpScreen() {
  const { colors: theme } = useTheme();
  const { leadId, followUpId } = useLocalSearchParams<{ leadId: string; followUpId?: string }>();
  const { leads, followUps, createFollowUp, rescheduleFollowUp } = usePreviewLeads();
  const lead = leads.find((item) => item.id === leadId);
  const existing = followUps.find((item) => item.id === followUpId);
  const [due, setDue] = useState(existing?.due ?? 'Tomorrow · 10:00 AM');
  const [error, setError] = useState<string | null>(null);

  function save() {
    if (!lead || !due.trim()) {
      setError(lead ? 'Add a date and time for the follow-up.' : 'This lead is not available in the preview.');
      return;
    }
    if (existing) {
      rescheduleFollowUp(existing.id, due);
    } else {
      createFollowUp(lead.id, due);
    }
    router.replace(`/lead/${lead.id}`);
  }

  return (
    <SalesScreen>
      <PageHeading title={existing ? 'Reschedule follow-up' : 'Schedule follow-up'} subtitle={lead ? `For ${lead.name}` : 'Lead not found'} />
      <PreviewNotice />
      <Text style={[styles.label, { color: theme.text }]}>Date and time</Text>
      <TextInput
        accessibilityLabel="Follow-up date and time"
        value={due}
        onChangeText={(value) => { setDue(value); setError(null); }}
        placeholder="e.g. Tomorrow · 10:00 AM"
        placeholderTextColor={theme.textSecondary}
        style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
      />
      <Text style={[styles.hint, { color: theme.textSecondary }]}>
        Preview scheduling uses text only. Calendar validation and device reminders will be added later.
      </Text>
      {error ? <Text accessibilityRole="alert" style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}
      <ActionButton label={existing ? 'Save new time to preview' : 'Save follow-up to preview'} onPress={save} disabled={!lead} />
    </SalesScreen>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.label, marginBottom: spacing.sm },
  input: { minHeight: 48, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, fontSize: 15 },
  hint: { ...typography.caption, lineHeight: 18, marginBottom: spacing.lg },
  error: { ...typography.caption, marginBottom: spacing.md },
});
