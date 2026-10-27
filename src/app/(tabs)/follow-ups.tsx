import { useCallback, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  ActionButton,
  Card,
  Chip,
  EmptyState,
  PageHeading,
  SalesScreen,
} from '@/components/sales-ui';
import { useTheme } from '@/components/ui';
import { usePreviewLeads } from '@/features/leads/PreviewLeadsProvider';
import type { FollowUp } from '@/features/leads/preview-data';
import { spacing, TAB_BAR_CLEARANCE, typography } from '@/theme';

type FollowUpFilter = 'Overdue' | 'Today' | 'Upcoming' | 'Done' | 'Cancelled';

const filters: FollowUpFilter[] = ['Overdue', 'Today', 'Upcoming', 'Done', 'Cancelled'];

export default function FollowUpsScreen() {
  const { colors: theme } = useTheme();
  const { leads, followUps, updateFollowUpStatus } = usePreviewLeads();
  const [filter, setFilter] = useState<FollowUpFilter>('Today');

  const matches = useCallback(
    (item: FollowUp, value: FollowUpFilter) => {
      if (leads.find((lead) => lead.id === item.leadId)?.archived) return false;
      if (value === 'Done') return item.status === 'Completed';
      if (value === 'Cancelled') return item.status === 'Cancelled';
      if (item.status !== 'Pending') return false;
      const due = item.due.toLocaleLowerCase();
      if (value === 'Overdue') return due.includes('overdue');
      if (value === 'Today') return due.includes('today');
      return !due.includes('today') && !due.includes('overdue');
    },
    [leads],
  );

  const items = useMemo(
    () => followUps.filter((item) => matches(item, filter)),
    [followUps, filter, matches],
  );

  const renderItem = useCallback(
    ({ item }: { item: FollowUp }) => {
      const lead = leads.find((candidate) => candidate.id === item.leadId);
      if (!lead) return null;
      const overdue = item.due.toLocaleLowerCase().includes('overdue');

      return (
        <Card>
          <View style={styles.rowHeader}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Open ${lead.name}`}
              onPress={() => router.push(`/lead/${lead.id}`)}
              style={styles.rowCopy}
            >
              <Text style={[styles.name, { color: theme.text }]}>{lead.name}</Text>
              <Text numberOfLines={1} style={[styles.summary, { color: theme.textSecondary }]}>
                {lead.summary}
              </Text>
            </Pressable>
            <View style={styles.dueColumn}>
              <Text style={[styles.due, { color: overdue ? theme.danger : theme.accent }]}>
                {item.due}
              </Text>
              {item.status === 'Pending' ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Cancel follow-up for ${lead.name}`}
                  onPress={() => updateFollowUpStatus(item.id, 'Cancelled')}
                  style={styles.cancel}
                >
                  <Text style={[styles.cancelText, { color: theme.textFaint }]}>Cancel</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
          {item.status === 'Pending' ? (
            <View style={styles.actions}>
              <View style={styles.actionGrow}>
                <ActionButton
                  label="Complete"
                  onPress={() => updateFollowUpStatus(item.id, 'Completed')}
                />
              </View>
              <View style={styles.actionGrow}>
                <ActionButton
                  label="Reschedule"
                  secondary
                  onPress={() =>
                    router.push(`/schedule-follow-up?leadId=${lead.id}&followUpId=${item.id}`)
                  }
                />
              </View>
            </View>
          ) : null}
        </Card>
      );
    },
    [leads, theme, updateFollowUpStatus],
  );

  return (
    <SalesScreen padded={false}>
      <View style={styles.content}>
        <PageHeading title="Follow-ups" />
        <ScrollView
          horizontal
          style={styles.filterScroll}
          contentContainerStyle={styles.filters}
          showsHorizontalScrollIndicator={false}
          accessibilityLabel="Filter follow-ups by due status"
        >
          {filters.map((value) => (
            <Chip
              key={value}
              label={`${value} ${followUps.filter((item) => matches(item, value)).length}`}
              selected={filter === value}
              onPress={() => setFilter(value)}
            />
          ))}
        </ScrollView>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              title={`No ${filter.toLocaleLowerCase()} follow-ups`}
              description="Scheduled follow-ups will appear in this list."
            />
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SalesScreen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: spacing.lg },
  filterScroll: { flexGrow: 0, marginBottom: spacing.md },
  filters: { flexDirection: 'row', gap: spacing.sm, paddingRight: spacing.lg },
  list: { flexGrow: 1, paddingBottom: TAB_BAR_CLEARANCE, gap: spacing.sm },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  rowCopy: { flex: 1, gap: 2 },
  name: { fontSize: 16, fontWeight: '700' },
  summary: { ...typography.body, fontSize: 14 },
  dueColumn: { alignItems: 'flex-end' },
  due: { ...typography.label, fontSize: 13, textAlign: 'right' },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  actionGrow: { flex: 1 },
  cancel: {
    minHeight: 44,
    justifyContent: 'center',
    paddingLeft: spacing.sm,
  },
  cancelText: { ...typography.caption },
});
