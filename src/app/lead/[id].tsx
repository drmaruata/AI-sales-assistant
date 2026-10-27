import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  ActionButton,
  LeadAvatar,
  PageHeading,
  PreviewNotice,
  SalesScreen,
  StageBadge,
} from '@/components/sales-ui';
import { useTheme } from '@/components/ui';
import { usePreviewLeads } from '@/features/leads/PreviewLeadsProvider';
import { leadStages } from '@/features/leads/preview-data';
import { MIN_TOUCH_TARGET, radius, spacing, typography } from '@/theme';

export default function LeadDetailsScreen() {
  const { colors: theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { leads, updateStage, archiveLead, restoreLead } = usePreviewLeads();
  const lead = leads.find((item) => item.id === id);

  function goBackToLeads() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(tabs)/leads');
  }

  function confirmArchive() {
    Alert.alert(
      'Archive this lead?',
      'The lead will move out of your active list. You can restore it from the Archived filter.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive lead',
          style: 'destructive',
          onPress: () => {
            if (lead) {
              archiveLead(lead.id);
              router.replace('/(tabs)/leads');
            }
          },
        },
      ],
    );
  }

  if (!lead) {
    return (
      <SalesScreen>
        <PageHeading
          title="Lead not found"
          subtitle="This preview lead may no longer be available."
        />
        <ActionButton label="Back to leads" onPress={() => router.replace('/(tabs)/leads')} />
      </SalesScreen>
    );
  }

  return (
    <SalesScreen padded={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={goBackToLeads}
          style={styles.backButton}
        >
          <Text style={[styles.backText, { color: theme.accent }]}>‹ Leads</Text>
        </Pressable>
        <View style={styles.profile}>
          <LeadAvatar name={lead.name} size={64} />
          <View style={styles.profileCopy}>
            <Text style={[styles.name, { color: theme.text }]}>{lead.name}</Text>
            <Text style={[styles.company, { color: theme.textSecondary }]}>{lead.company}</Text>
            <StageBadge stage={lead.stage} />
          </View>
        </View>
        <PreviewNotice />
        {lead.archived ? (
          <View style={styles.actions}>
            <Text style={[styles.body, { color: theme.textSecondary }]}>
              This lead is archived.
            </Text>
            <ActionButton
              label="Restore lead"
              onPress={() => {
                restoreLead(lead.id);
                router.replace('/(tabs)/leads');
              }}
            />
          </View>
        ) : (
          <View style={styles.actions}>
            <ActionButton
              label="Add a note"
              secondary
              onPress={() => router.push(`/note?leadId=${lead.id}`)}
            />
            <ActionButton
              label="Set follow-up"
              secondary
              onPress={() => router.push(`/schedule-follow-up?leadId=${lead.id}`)}
            />
            <ActionButton
              label="Draft a reply"
              onPress={() => router.push(`/draft-reply?leadId=${lead.id}`)}
            />
            <ActionButton
              label="Edit lead"
              secondary
              onPress={() => router.push(`/edit-lead?leadId=${lead.id}`)}
            />
          </View>
        )}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact information</Text>
          {lead.phone ? (
            <Text style={[styles.body, { color: theme.textSecondary }]}>Phone · {lead.phone}</Text>
          ) : null}
          {lead.email ? (
            <Text style={[styles.body, { color: theme.textSecondary }]}>Email · {lead.email}</Text>
          ) : null}
          {lead.source ? (
            <Text style={[styles.body, { color: theme.textSecondary }]}>
              Source · {lead.source}
            </Text>
          ) : null}
          {!lead.phone && !lead.email && !lead.source ? (
            <Text style={[styles.body, { color: theme.textSecondary }]}>
              No contact details added.
            </Text>
          ) : null}
        </View>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>What they need</Text>
          <Text style={[styles.body, { color: theme.textSecondary }]}>{lead.summary}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Notes and activity</Text>
          {lead.notes?.length ? (
            lead.notes.map((note) => (
              <View key={note.id} style={[styles.note, { borderTopColor: theme.border }]}>
                <Text style={[styles.body, { color: theme.text }]}>{note.text}</Text>
                <Text style={[styles.updated, { color: theme.textSecondary }]}>
                  {note.createdAt}
                </Text>
              </View>
            ))
          ) : (
            <Text style={[styles.body, { color: theme.textSecondary }]}>
              No notes yet. Add a note after your next conversation.
            </Text>
          )}
        </View>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Next follow-up</Text>
          <Text style={[styles.body, { color: theme.textSecondary }]}>
            {lead.followUp ?? 'No follow-up scheduled'}
          </Text>
        </View>
        {!lead.archived ? (
          <>
            <Text style={[styles.sectionTitle, styles.stageTitle, { color: theme.text }]}>
              Update stage
            </Text>
            <View style={styles.stageOptions}>
              {leadStages.map((stage) => {
                const selected = lead.stage === stage;
                return (
                  <Pressable
                    key={stage}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => updateStage(lead.id, stage)}
                    style={[
                      styles.stageOption,
                      {
                        backgroundColor: selected ? theme.accentSoft : theme.surface,
                        borderColor: selected ? theme.accent : theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.stageOptionText,
                        { color: selected ? theme.accent : theme.text },
                      ]}
                    >
                      {stage}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        ) : null}
        <Text style={[styles.updated, { color: theme.textSecondary }]}>
          Last updated {lead.updated}
        </Text>
        {!lead.archived ? (
          <View style={styles.archive}>
            <ActionButton label="Archive lead" onPress={confirmArchive} secondary />
          </View>
        ) : null}
      </ScrollView>
    </SalesScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  backButton: { minHeight: MIN_TOUCH_TARGET, justifyContent: 'center', marginBottom: spacing.xs },
  backText: { ...typography.label, fontSize: 15 },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  profileCopy: { flex: 1, gap: spacing.xs },
  name: { fontSize: 22, fontWeight: '700' },
  company: { ...typography.body },
  card: { padding: spacing.lg, borderWidth: 1, borderRadius: radius.lg, marginBottom: spacing.md },
  sectionTitle: { ...typography.heading, marginBottom: spacing.sm },
  body: { ...typography.body, lineHeight: 22 },
  stageTitle: { marginTop: spacing.md },
  actions: { gap: spacing.sm, marginBottom: spacing.lg },
  note: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: spacing.md, marginTop: spacing.md },
  stageOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  stageOption: {
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  stageOptionText: { ...typography.label },
  updated: { ...typography.caption, marginTop: spacing.xl },
  archive: { marginTop: spacing.lg },
});
