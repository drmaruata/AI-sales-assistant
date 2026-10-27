import { useCallback, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState, PageHeading, PreviewNotice, SalesScreen } from '@/components/sales-ui';
import { useTheme } from '@/components/ui';
import { usePreviewLeads } from '@/features/leads/PreviewLeadsProvider';
import type { FollowUp } from '@/features/leads/preview-data';
import { radius, spacing, typography } from '@/theme';

type FollowUpFilter = 'Overdue' | 'Today' | 'Upcoming' | 'Completed' | 'Cancelled';

export default function FollowUpsScreen() {
  const { colors: theme } = useTheme();
  const { leads, followUps, updateFollowUpStatus } = usePreviewLeads();
  const [filter, setFilter] = useState<FollowUpFilter>('Today');
  const items = useMemo(
    () =>
      followUps.filter((item) => {
        if (leads.find((lead) => lead.id === item.leadId)?.archived) return false;
        if (filter === 'Completed' || filter === 'Cancelled') return item.status === filter;
        if (item.status !== 'Pending') return false;
        const due = item.due.toLocaleLowerCase();
        if (filter === 'Overdue') return due.includes('overdue');
        if (filter === 'Today') return due.includes('today');
        return !due.includes('today') && !due.includes('overdue');
      }),
    [followUps, filter, leads]
  );

  const renderItem = useCallback(({ item }: { item: FollowUp }) => {
    const lead = leads.find((candidate) => candidate.id === item.leadId);
    if (!lead) return null;
    return (
      <View style={[styles.row, { borderColor: theme.border, backgroundColor: theme.surface }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open ${lead.name}`}
          onPress={() => router.push(`/lead/${lead.id}`)}
          style={styles.rowMain}
        >
          <Text style={[styles.name, { color: theme.text }]}>{lead.name}</Text>
          <Text style={[styles.meta, { color: theme.textSecondary }]}>{lead.company}</Text>
          <Text style={[styles.due, { color: theme.accent }]}>{item.due}</Text>
        </Pressable>
        {item.status === 'Pending' ? (
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Mark follow-up for ${lead.name} complete`}
              onPress={() => updateFollowUpStatus(item.id, 'Completed')}
              style={[styles.complete, { backgroundColor: theme.successSoft }]}
            >
              <Text style={[styles.completeText, { color: theme.success }]}>Done</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Reschedule follow-up for ${lead.name}`}
              onPress={() =>
                router.push(`/schedule-follow-up?leadId=${lead.id}&followUpId=${item.id}`)
              }
              style={[styles.complete, { backgroundColor: theme.accentSoft }]}
            >
              <Text style={[styles.completeText, { color: theme.accent }]}>Reschedule</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Cancel follow-up for ${lead.name}`}
              onPress={() => updateFollowUpStatus(item.id, 'Cancelled')}
              style={[styles.complete, { backgroundColor: theme.surface }]}
            >
              <Text style={[styles.completeText, { color: theme.textSecondary }]}>Cancel</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    );
  }, [leads, theme, updateFollowUpStatus]);

  return (
    <SalesScreen padded={false}>
      <View style={styles.content}>
        <PageHeading title="Follow-ups" subtitle="Keep every next step visible." />
        <PreviewNotice />
        <ScrollView
          horizontal
          style={styles.filterScroll}
          contentContainerStyle={styles.filters}
          showsHorizontalScrollIndicator={false}
          accessibilityLabel="Filter follow-ups by due status"
        >
          {(['Overdue', 'Today', 'Upcoming', 'Completed', 'Cancelled'] as const).map((value) => {
            const selected = filter === value;
            return (
              <Pressable
                key={value}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setFilter(value)}
                style={[styles.filter, { backgroundColor: selected ? theme.accent : theme.surface, borderColor: selected ? theme.accent : theme.border }]}
              >
                <Text style={[styles.filterText, { color: selected ? theme.accentText : theme.textSecondary }]}>{value}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<EmptyState title="Nothing here yet" description="Scheduled follow-ups will appear in this list." />}
        />
      </View>
    </SalesScreen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: spacing.lg },
  filterScroll: { flexGrow: 0, marginBottom: spacing.md },
  filters: { flexDirection: 'row', gap: spacing.sm },
  filter: { minHeight: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: radius.md, paddingHorizontal: spacing.md },
  filterText: { fontSize: 12, fontWeight: '600' },
  list: { flexGrow: 1, paddingBottom: spacing.lg, gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderWidth: 1, borderRadius: radius.md },
  rowMain: { flex: 1, minHeight: 64, justifyContent: 'center', gap: 2 },
  name: { ...typography.label, fontSize: 15 },
  meta: { ...typography.caption },
  due: { ...typography.caption, fontWeight: '600', marginTop: spacing.xs },
  actions: { alignItems: 'flex-end', gap: spacing.xs },
  complete: { minHeight: 36, justifyContent: 'center', borderRadius: radius.md, paddingHorizontal: spacing.sm },
  completeText: { fontSize: 11, fontWeight: '600' },
});
