import { useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ActionButton, PageHeading, PreviewNotice, SalesScreen } from '@/components/sales-ui';
import { useTheme } from '@/components/ui';
import { usePreviewLeads } from '@/features/leads/PreviewLeadsProvider';
import { radius, spacing, typography } from '@/theme';

const purposes = ['First response', 'Follow-up', 'Answer a question', 'Re-engagement'] as const;

export default function DraftReplyScreen() {
  const { colors: theme } = useTheme();
  const { leadId } = useLocalSearchParams<{ leadId: string }>();
  const { leads, businessProfile } = usePreviewLeads();
  const lead = leads.find((item) => item.id === leadId);
  const [purpose, setPurpose] = useState<(typeof purposes)[number]>('Follow-up');
  const [draft, setDraft] = useState('');
  const [generated, setGenerated] = useState(false);

  const previewDraft = useMemo(() => {
    if (!lead) return '';
    const greeting = businessProfile.tone === 'Professional' ? 'Hello' : 'Hi';
    const signoff = businessProfile.tone === 'Concise' ? 'Thanks' : 'Best';
    const opener =
      purpose === 'First response'
        ? `Thanks for reaching out to ${businessProfile.name}.`
        : purpose === 'Answer a question'
          ? `Thanks for your question about ${lead.summary.toLocaleLowerCase()}`
          : purpose === 'Re-engagement'
            ? `I wanted to check back in about ${lead.summary.toLocaleLowerCase()}`
            : `I wanted to follow up about ${lead.summary.toLocaleLowerCase()}`;
    return `${greeting} ${lead.name.split(' ')[0]},\n\n${opener}\n\n${businessProfile.approvedFacts}\n\n${signoff},\n${businessProfile.name}`;
  }, [businessProfile, lead, purpose]);

  function generatePreview() {
    if (!lead) return;
    setDraft(previewDraft);
    setGenerated(true);
  }

  return (
    <SalesScreen>
      <PageHeading title="Draft a reply" subtitle={lead ? `For ${lead.name}` : 'Lead not found'} />
      <PreviewNotice />
      <View style={[styles.notice, { backgroundColor: theme.warningSoft }]}>
        <Text style={[styles.noticeText, { color: theme.warning }]}>
          Preview only. No AI provider is connected; this sample text is not AI-generated. Always review a draft before sending.
        </Text>
      </View>
      <Text style={[styles.label, { color: theme.text }]}>What is the reply for?</Text>
      <View style={styles.options}>
        {purposes.map((value) => {
          const selected = value === purpose;
          return (
            <Pressable
              key={value}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setPurpose(value)}
              style={[
                styles.option,
                {
                  backgroundColor: selected ? theme.accentSoft : theme.surface,
                  borderColor: selected ? theme.accent : theme.border,
                },
              ]}
            >
              <Text style={[styles.optionText, { color: selected ? theme.accent : theme.text }]}>{value}</Text>
            </Pressable>
          );
        })}
      </View>
      {!generated ? (
        <ActionButton label="Create sample draft" onPress={generatePreview} disabled={!lead} />
      ) : (
        <>
          <Text style={[styles.label, styles.draftLabel, { color: theme.text }]}>Editable sample draft</Text>
          <TextInput
            accessibilityLabel="Editable sample reply draft"
            value={draft}
            onChangeText={setDraft}
            multiline
            textAlignVertical="top"
            style={[styles.editor, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
          />
          <ActionButton label="Regenerate sample" onPress={generatePreview} secondary />
          <View style={styles.actionSpacing}>
            <ActionButton
              label="Copy"
              onPress={() => Alert.alert('Copy draft', 'Clipboard support will be connected when the draft workflow is implemented. You can select the draft text to copy it in this preview.')}
            />
          </View>
        </>
      )}
      {lead ? (
        <Text style={[styles.footer, { color: theme.textSecondary }]}>
          Drafting uses the current preview facts for {businessProfile.name}. Update those facts in Settings → Business profile.
        </Text>
      ) : null}
    </SalesScreen>
  );
}

const styles = StyleSheet.create({
  notice: { padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.lg },
  noticeText: { ...typography.caption, lineHeight: 19 },
  label: { ...typography.label, marginBottom: spacing.sm },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  option: { minHeight: 44, justifyContent: 'center', borderWidth: 1, borderRadius: radius.md, paddingHorizontal: spacing.md },
  optionText: { fontSize: 13, fontWeight: '600' },
  draftLabel: { marginTop: spacing.lg },
  editor: { minHeight: 220, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, fontSize: 15, lineHeight: 23, marginBottom: spacing.md },
  actionSpacing: { marginTop: spacing.sm },
  footer: { ...typography.caption, lineHeight: 19, marginTop: spacing.lg },
});
