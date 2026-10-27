import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { LeadRow, MetricCard, SalesScreen, SectionHeading } from '@/components/sales-ui';
import { useTheme } from '@/components/ui';
import { useAuth } from '@/features/auth/AuthProvider';
import { usePreviewLeads } from '@/features/leads/PreviewLeadsProvider';
import { radius, spacing, TAB_BAR_CLEARANCE, typography } from '@/theme';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const { colors: theme } = useTheme();
  const { session } = useAuth();
  const { leads, followUps, businessProfile } = usePreviewLeads();
  const activeLeads = leads.filter((lead) => !lead.archived);
  const pendingFollowUps = followUps.filter((item) => item.status === 'Pending');
  const overdue = pendingFollowUps.filter((item) =>
    item.due.toLocaleLowerCase().includes('overdue'),
  ).length;
  const dueToday = pendingFollowUps.filter((item) =>
    item.due.toLocaleLowerCase().includes('today'),
  ).length;
  const attentionLeads = [
    ...activeLeads.filter((lead) => lead.followUp),
    ...activeLeads.filter((lead) => !lead.followUp),
  ].slice(0, 4);
  const recentNote = activeLeads
    .flatMap((lead) => (lead.notes ?? []).map((note) => ({ lead, note })))
    .at(-1);
  const recentlyUpdated = activeLeads.find((lead) => lead.stage !== 'New');
  const initials = (businessProfile.name || session?.user.email || 'A K')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toLocaleUpperCase())
    .join('');

  return (
    <SalesScreen padded={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={[styles.eyebrow, { color: theme.textSecondary }]}>
              {businessProfile.name}
            </Text>
            <Text style={[typography.display, { color: theme.text }]}>{greeting()}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open your profile"
            onPress={() => router.push('/profile')}
            style={({ pressed }) => [
              styles.avatarButton,
              {
                backgroundColor: theme.peachSoft,
                borderColor: theme.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text style={[styles.avatarText, { color: theme.danger }]}>{initials}</Text>
          </Pressable>
        </View>

        <View style={styles.metrics}>
          <MetricCard label="Open leads" value={activeLeads.length} />
          <MetricCard label="Overdue" value={overdue} tone="danger" />
          <MetricCard label="Due today" value={dueToday} tone="accent" />
        </View>

        <SectionHeading title="Needs attention" />
        <View style={styles.list}>
          {attentionLeads.map((lead) => (
            <LeadRow key={lead.id} lead={lead} onPress={() => router.push(`/lead/${lead.id}`)} />
          ))}
        </View>

        <SectionHeading
          title="Recent activity"
          action="Analytics"
          onAction={() => router.push('/analytics')}
        />
        <Text style={[styles.activity, { color: theme.textSecondary }]}>
          {recentNote ? `Note added to ${recentNote.lead.name}` : 'No notes yet'}
          {recentlyUpdated
            ? ` · Stage set to ${recentlyUpdated.stage} for ${recentlyUpdated.name}`
            : ''}
        </Text>
      </ScrollView>
    </SalesScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: TAB_BAR_CLEARANCE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  headerText: { flex: 1, gap: 4 },
  eyebrow: { ...typography.body, fontSize: 14 },
  avatarButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  avatarText: { fontSize: 18, fontWeight: '700' },
  metrics: { flexDirection: 'row', gap: spacing.sm },
  list: { gap: spacing.sm },
  activity: { ...typography.body, lineHeight: 22 },
});
