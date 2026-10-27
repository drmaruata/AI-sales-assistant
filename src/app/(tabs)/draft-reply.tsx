import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton, BackLink, Chip, SalesScreen } from '@/components/sales-ui';
import { useTheme } from '@/components/ui';
import { usePreviewLeads } from '@/features/leads/PreviewLeadsProvider';
import type { BusinessProfile } from '@/features/leads/preview-data';
import { radius, shadows, spacing, TAB_BAR_CLEARANCE, typography } from '@/theme';
const purposes = ['First response', 'Follow-up', 'Answer a question', 'Re-engagement'] as const;
const tones: BusinessProfile['tone'][] = ['Professional', 'Friendly', 'Concise'];

export default function DraftReplyScreen() {
  const { colors: theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { leadId } = useLocalSearchParams<{ leadId: string }>();
  const { leads, businessProfile } = usePreviewLeads();
  const lead = leads.find((item) => item.id === leadId);
  const [purpose, setPurpose] = useState<(typeof purposes)[number]>('Follow-up');
  const [tone, setTone] = useState<BusinessProfile['tone']>(businessProfile.tone);

  function buildDraft() {
    if (!lead) return '';
    const greeting = tone === 'Professional' ? 'Hello' : 'Hi';
    const signoff = tone === 'Concise' ? 'Thanks' : 'Best';
    const opener =
      purpose === 'First response'
        ? `Thanks for reaching out to ${businessProfile.name}.`
        : purpose === 'Answer a question'
          ? `Thanks for your question: ${lead.summary.toLocaleLowerCase()}`
          : purpose === 'Re-engagement'
            ? `I wanted to check back in: ${lead.summary.toLocaleLowerCase()}`
            : `I wanted to follow up on your enquiry: ${lead.summary.toLocaleLowerCase()}`;
    return `${greeting} ${lead.name.split(' ')[0]},\n\n${opener}\n\n${businessProfile.approvedFacts}\n\n${signoff},\n${businessProfile.name}`;
  }

  const [draft, setDraft] = useState(() => buildDraft());

  return (
    <SalesScreen padded={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BackLink label={lead?.name ?? 'Leads'} onPress={() => router.back()} />
        <Text style={[typography.display, styles.title, { color: theme.text }]}>Draft a reply</Text>

        <Text style={[styles.label, { color: theme.textSecondary }]}>Purpose</Text>
        <View style={styles.options}>
          {purposes.map((value) => (
            <Chip
              key={value}
              label={value}
              selected={purpose === value}
              onPress={() => setPurpose(value)}
            />
          ))}
        </View>

        <Text style={[styles.label, styles.toneLabel, { color: theme.textSecondary }]}>Tone</Text>
        <View style={styles.options}>
          {tones.map((value) => (
            <Chip
              key={value}
              label={value}
              selected={tone === value}
              onPress={() => setTone(value)}
            />
          ))}
        </View>

        <View
          style={[
            styles.draftCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.accentMuted,
              boxShadow: shadows.card,
            },
          ]}
        >
          <Text style={[styles.draftLabel, { color: theme.accent }]}>
            Sample draft — review before sending
          </Text>
          <TextInput
            accessibilityLabel="Editable sample reply draft"
            value={draft}
            onChangeText={setDraft}
            multiline
            textAlignVertical="top"
            style={[styles.editor, typography.body, { color: theme.text }]}
          />
        </View>

        <Text style={[styles.footer, { color: theme.textSecondary }]}>
          Sample text built from your business profile and this lead. No AI provider is connected,
          and nothing is sent automatically.
        </Text>

        {lead ? (
          <Text style={[styles.footer, { color: theme.textFaint }]}>
            Update the facts used here in Settings → Business profile.
          </Text>
        ) : null}
      </ScrollView>

      <View
        style={[
          styles.actions,
          {
            bottom: insets.bottom + TAB_BAR_CLEARANCE - 40,
            backgroundColor: theme.tabBar,
            borderColor: theme.border,
            boxShadow: shadows.tabBar,
          },
        ]}
      >
        <ActionButton
          label="Copy draft"
          onPress={() =>
            Alert.alert(
              'Copy draft',
              'Clipboard support will be connected when the draft workflow is implemented. You can select the draft text to copy it in this preview.',
            )
          }
        />
        <View style={styles.actionRow}>
          <View style={styles.actionHalf}>
            <ActionButton label="Regenerate" secondary onPress={() => setDraft(buildDraft())} />
          </View>
          <View style={styles.actionHalf}>
            <ActionButton
              label="Save draft"
              secondary
              onPress={() => Alert.alert('Save draft', 'Saving drafts is a preview in this build.')}
            />
          </View>
        </View>
      </View>
    </SalesScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.lg, paddingBottom: 230 },
  title: { marginTop: spacing.xs, marginBottom: spacing.lg },
  label: { ...typography.body, marginBottom: spacing.sm },
  toneLabel: { marginTop: spacing.md },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  draftCard: {
    borderRadius: radius.lg,
    borderWidth: 1.5,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  draftLabel: { ...typography.heading, marginBottom: spacing.sm },
  editor: {
    minHeight: 180,
    fontSize: 16,
    lineHeight: 25,
    padding: 0,
  },
  footer: { ...typography.body, lineHeight: 21, marginTop: spacing.md },
  actions: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    gap: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.sm,
  },
  actionRow: { flexDirection: 'row', gap: spacing.sm },
  actionHalf: { flex: 1 },
});
