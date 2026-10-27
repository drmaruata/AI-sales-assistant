import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, TextInput } from 'react-native';

import {
  ActionButton,
  BackLink,
  PageHeading,
  PreviewNotice,
  SalesScreen,
} from '@/components/sales-ui';
import { useTheme } from '@/components/ui';
import { usePreviewLeads } from '@/features/leads/PreviewLeadsProvider';
import { radius, spacing, typography } from '@/theme';

export default function AddNoteScreen() {
  const { colors: theme } = useTheme();
  const { leadId } = useLocalSearchParams<{ leadId: string }>();
  const { leads, addNote } = usePreviewLeads();
  const lead = leads.find((item) => item.id === leadId);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  function save() {
    if (!lead || !note.trim()) {
      setError(lead ? 'Write a note before saving.' : 'This lead is not available in the preview.');
      return;
    }
    addNote(lead.id, note);
    router.replace(`/lead/${lead.id}`);
  }

  return (
    <SalesScreen>
      <BackLink label={lead?.name ?? 'Lead'} onPress={() => router.back()} />
      <PageHeading title="Add a note" subtitle={lead ? `For ${lead.name}` : 'Lead not found'} />
      <PreviewNotice />
      <Text style={[styles.label, { color: theme.text }]}>Note</Text>
      <TextInput
        accessibilityLabel="Note"
        value={note}
        onChangeText={(value) => {
          setNote(value);
          setError(null);
        }}
        placeholder="Capture a useful detail from the conversation"
        placeholderTextColor={theme.textSecondary}
        multiline
        textAlignVertical="top"
        style={[
          styles.input,
          { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text },
        ]}
      />
      {error ? (
        <Text accessibilityRole="alert" style={[styles.error, { color: theme.danger }]}>
          {error}
        </Text>
      ) : null}
      <ActionButton label="Save note to preview" onPress={save} disabled={!lead} />
    </SalesScreen>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.label, marginBottom: spacing.sm },
  input: {
    minHeight: 160,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    fontSize: 15,
  },
  error: { ...typography.caption, marginBottom: spacing.md },
});
