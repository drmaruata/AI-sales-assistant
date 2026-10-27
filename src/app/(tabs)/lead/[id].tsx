import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ActionButton,
  BackLink,
  Card,
  SalesScreen,
  SectionHeading,
  StageBadge,
} from '@/components/sales-ui';
import { useTheme } from '@/components/ui';
import { usePreviewLeads } from '@/features/leads/PreviewLeadsProvider';
import { leadStages } from '@/features/leads/preview-data';
import { MIN_TOUCH_TARGET, radius, spacing, TAB_BAR_CLEARANCE, typography } from '@/theme';

export default function LeadDetailsScreen() {
  const { colors: theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { leads, updateStage, archiveLead, restoreLead } = usePreviewLeads();
  const lead = leads.find((item) => item.id === id);

  function goBackToLeads() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/leads');
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
              router.replace('/leads');
            }
          },
        },
      ],
    );
  }

  if (!lead) {
    return (
      <SalesScreen>
        <BackLink label="Leads" onPress={() => router.replace('/leads')} />
        <Text style={[typography.title, styles.notFound, { color: theme.text }]}>
          Lead not found
        </Text>
        <Text style={[typography.body, styles.notFoundBody, { color: theme.textSecondary }]}>
          This preview lead may no longer be available.
        </Text>
      </SalesScreen>
    );
  }

  const overdue = lead.followUp?.toLocaleLowerCase().includes('overdue') ?? false;

  return (
    <SalesScreen padded={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BackLink label="Leads" onPress={goBackToLeads} />

        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={[typography.title, { color: theme.text }]}>{lead.name}</Text>
            <Text style={[typography.body, { color: theme.textSecondary }]}>
              {lead.company}
              {lead.source ? ` · ${lead.source}` : ''}
            </Text>
          </View>
          <StageBadge stage={lead.stage} />
        </View>

        <View
          style={[
            styles.followUpBanner,
            {
              backgroundColor: theme.surface,
              borderColor: overdue ? theme.danger : theme.accentMuted,
            },
          ]}
        >
          <View style={styles.followUpCopy}>
            <Text style={[styles.followUpLabel, { color: theme.textSecondary }]}>
              Next follow-up
            </Text>
            <Text
              style={[
                styles.followUpValue,
                {
                  color: overdue
                    ? theme.danger
                    : lead.followUp
                      ? theme.accent
                      : theme.textSecondary,
                },
              ]}
            >
              {lead.followUp ?? 'No follow-up scheduled'}
            </Text>
          </View>
          <ActionButton
            label={lead.followUp ? 'Reschedule' : 'Schedule'}
            onPress={() => router.push(`/schedule-follow-up?leadId=${lead.id}`)}
          />
        </View>

        <Text style={[styles.needLabel, { color: theme.textSecondary }]}>Need</Text>
        <Text style={[styles.needText, { color: theme.text }]}>{lead.summary}</Text>

        {lead.archived ? (
          <Text style={[styles.archived, { color: theme.danger }]}>Archived</Text>
        ) : null}

        <SectionHeading title="Timeline" />
        <View style={styles.timeline}>
          {lead.notes?.map((note) => (
            <Card key={note.id} style={styles.timelineCard}>
              <Text style={[styles.timelineTitle, { color: theme.text }]}>
                Note · {note.createdAt}
              </Text>
              <Text style={[styles.timelineBody, { color: theme.textSecondary }]}>{note.text}</Text>
            </Card>
          ))}
          <Card style={styles.timelineCard}>
            <Text style={[styles.timelineTitle, { color: theme.text }]}>
              Stage · {lead.updated}
            </Text>
            <Text style={[styles.timelineBody, { color: theme.textSecondary }]}>
              Current stage is {lead.stage}.
            </Text>
          </Card>
          {!lead.notes?.length ? (
            <Text style={[styles.timelineEmpty, { color: theme.textSecondary }]}>
              No notes yet. Add a note after your next conversation.
            </Text>
          ) : null}
        </View>

        {lead.phone || lead.email ? (
          <>
            <SectionHeading title="Contact" />
            <Card style={styles.contactCard}>
              {lead.phone ? (
                <Text style={[styles.contactLine, { color: theme.textSecondary }]}>
                  Phone · {lead.phone}
                </Text>
              ) : null}
              {lead.email ? (
                <Text style={[styles.contactLine, { color: theme.textSecondary }]}>
                  Email · {lead.email}
                </Text>
              ) : null}
            </Card>
          </>
        ) : null}

        {!lead.archived ? (
          <>
            <SectionHeading title="Update stage" />
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
                        backgroundColor: selected ? theme.accent : theme.surface,
                        borderColor: selected ? theme.accent : theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.stageOptionText,
                        { color: selected ? theme.accentText : theme.text },
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

        <View style={styles.secondaryActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit lead"
            onPress={() => router.push(`/edit-lead?leadId=${lead.id}`)}
            style={styles.secondaryAction}
          >
            <Text style={[styles.secondaryActionText, { color: theme.accent }]}>Edit lead</Text>
          </Pressable>
          {lead.archived ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Restore lead"
              onPress={() => {
                restoreLead(lead.id);
                router.replace('/leads');
              }}
              style={styles.secondaryAction}
            >
              <Text style={[styles.secondaryActionText, { color: theme.accent }]}>
                Restore lead
              </Text>
            </Pressable>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Archive lead"
              onPress={confirmArchive}
              style={styles.secondaryAction}
            >
              <Text style={[styles.secondaryActionText, { color: theme.danger }]}>
                Archive lead
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      {!lead.archived ? (
        <View
          style={[
            styles.footer,
            {
              bottom: insets.bottom + TAB_BAR_CLEARANCE - 40,
              backgroundColor: theme.tabBar,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.footerButton}>
            <ActionButton
              label="Add note"
              secondary
              onPress={() => router.push(`/note?leadId=${lead.id}`)}
            />
          </View>
          <View style={styles.footerButton}>
            <ActionButton
              label="Draft a reply"
              onPress={() => router.push(`/draft-reply?leadId=${lead.id}`)}
            />
          </View>
        </View>
      ) : null}
    </SalesScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 200,
  },
  notFound: { marginTop: spacing.xl, marginBottom: spacing.sm },
  notFoundBody: { marginBottom: spacing.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  headerText: { flex: 1, gap: 2 },
  followUpBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
  },
  followUpCopy: { flex: 1, gap: 2 },
  followUpLabel: { ...typography.caption },
  followUpValue: { fontSize: 15, fontWeight: '700' },
  needLabel: { ...typography.body, marginTop: spacing.lg },
  needText: { fontSize: 17, lineHeight: 25, marginTop: 2 },
  archived: { ...typography.caption, fontWeight: '700', marginTop: spacing.sm },
  timeline: { gap: spacing.sm },
  timelineCard: { padding: spacing.lg },
  timelineTitle: { fontSize: 15, fontWeight: '700' },
  timelineBody: { ...typography.body, lineHeight: 21, marginTop: 2 },
  timelineEmpty: { ...typography.body, lineHeight: 21 },
  contactCard: { gap: spacing.xs },
  contactLine: { ...typography.body },
  stageOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  stageOption: {
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
  },
  stageOptionText: { ...typography.label },
  secondaryActions: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.xl,
  },
  secondaryAction: { minHeight: MIN_TOUCH_TARGET, justifyContent: 'center' },
  secondaryActionText: { ...typography.label, fontSize: 14 },
  footer: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    gap: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    padding: spacing.sm,
  },
  footerButton: { flex: 1 },
});
