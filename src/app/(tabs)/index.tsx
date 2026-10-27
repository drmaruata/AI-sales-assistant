import { useCallback } from 'react';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  LeadAvatar,
  LeadRow,
  MetricCard,
  PageHeading,
  PreviewLabel,
  PreviewNotice,
  SalesScreen,
  SectionHeading,
} from '@/components/sales-ui';
import { useTheme } from '@/components/ui';
import { useAuth } from '@/features/auth/AuthProvider';
import { usePreviewLeads } from '@/features/leads/PreviewLeadsProvider';
import type { Lead } from '@/features/leads/preview-data';
import { spacing, typography } from '@/theme';

export default function HomeScreen() {
  const { colors: theme } = useTheme();
  const { session } = useAuth();
  const { leads, followUps, businessProfile } = usePreviewLeads();
  const activeLeads = leads.filter((lead) => !lead.archived);
  const pendingFollowUps = followUps.filter((item) => item.status === 'Pending');
  const attentionLeads = activeLeads.filter((lead) => lead.followUp);
  const recentActivity = activeLeads
    .flatMap((lead) =>
      (lead.notes ?? []).map((note) => ({ ...note, leadName: lead.name, leadId: lead.id })),
    )
    .slice(0, 3);

  const openLead = useCallback((lead: Lead) => {
    router.push(`/lead/${lead.id}`);
  }, []);

  const renderLead = useCallback(
    ({ item }: { item: Lead }) => <LeadRow lead={item} compact onPress={() => openLead(item)} />,
    [openLead],
  );

  const Header = (
    <View>
      <PageHeading
        title="Good morning"
        subtitle={businessProfile.name || 'Welcome back to your workspace'}
        right={<LeadAvatar name={session?.user.email ?? 'Your profile'} size={44} />}
      />
      <PreviewLabel />
      <PreviewNotice />
      <View style={styles.metrics}>
        <MetricCard label="Open leads" value={activeLeads.length} detail="In your pipeline" />
        <MetricCard
          label="Overdue"
          value={
            pendingFollowUps.filter((item) => item.due.toLocaleLowerCase().includes('overdue'))
              .length
          }
          detail="No overdue sample items"
          tone="warning"
        />
        <MetricCard
          label="Due today"
          value={
            pendingFollowUps.filter((item) => item.due.toLocaleLowerCase().includes('today')).length
          }
          detail="Keep the momentum"
          tone="success"
        />
        <MetricCard
          label="Qualified"
          value={activeLeads.filter((lead) => lead.stage === 'Qualified').length}
          detail="Ready to progress"
        />
      </View>
      <SectionHeading
        title="Needs attention"
        action="Follow-ups"
        onAction={() => router.push('/follow-ups')}
      />
    </View>
  );

  return (
    <SalesScreen>
      <FlatList
        data={attentionLeads}
        keyExtractor={(item) => item.id}
        renderItem={renderLead}
        ListHeaderComponent={Header}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.textSecondary }]}>
            You are all caught up. Add a lead when a new enquiry comes in.
          </Text>
        }
        ListFooterComponent={
          <View>
            <SectionHeading title="Recent activity" />
            {recentActivity.length ? (
              recentActivity.map((activity) => (
                <Pressable
                  key={activity.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Recent activity for ${activity.leadName}: ${activity.text}`}
                  onPress={() => router.push(`/lead/${activity.leadId}`)}
                  style={[styles.activity, { borderBottomColor: theme.border }]}
                >
                  <Text style={[styles.activityTitle, { color: theme.text }]}>
                    {activity.leadName}
                  </Text>
                  <Text
                    style={[styles.activityText, { color: theme.textSecondary }]}
                    numberOfLines={2}
                  >
                    {activity.text}
                  </Text>
                  <Text style={[styles.activityTime, { color: theme.textSecondary }]}>
                    {activity.createdAt}
                  </Text>
                </Pressable>
              ))
            ) : (
              <Text style={[styles.empty, { color: theme.textSecondary }]}>
                Notes and stage updates will show here.
              </Text>
            )}
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/(tabs)/add')}
              style={({ pressed }) => [
                styles.addLead,
                { backgroundColor: theme.accent, opacity: pressed ? 0.82 : 1 },
              ]}
            >
              <Text style={[typography.label, { color: theme.accentText }]}>＋ Add a lead</Text>
            </Pressable>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SalesScreen>
  );
}

const styles = StyleSheet.create({
  listContent: { paddingBottom: spacing.xl },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  empty: { ...typography.body, paddingVertical: spacing.lg, lineHeight: 22 },
  activity: {
    minHeight: 68,
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.sm,
  },
  activityTitle: { ...typography.label },
  activityText: { ...typography.caption, lineHeight: 18, marginTop: 2 },
  activityTime: { fontSize: 11, marginTop: 2 },
  addLead: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: spacing.xl,
  },
});
