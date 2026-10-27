import { useCallback, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Icon } from '@/components/icon';
import {
  Chip,
  EmptyState,
  LeadRow,
  PageHeading,
  RoundIconButton,
  SalesScreen,
} from '@/components/sales-ui';
import { useTheme } from '@/components/ui';
import { usePreviewLeads } from '@/features/leads/PreviewLeadsProvider';
import {
  filterLeads,
  leadStages,
  sortLeads,
  type Lead,
  type LeadSort,
  type LeadStage,
} from '@/features/leads/preview-data';
import { MIN_TOUCH_TARGET, radius, spacing, TAB_BAR_CLEARANCE, typography } from '@/theme';

type StageFilter = LeadStage | 'All';

export default function LeadsScreen() {
  const { colors: theme } = useTheme();
  const { leads, restoreLead } = usePreviewLeads();
  const [query, setQuery] = useState('');
  const [stage, setStage] = useState<StageFilter>('All');
  const [sort, setSort] = useState<LeadSort>('Next follow-up');
  const [showArchived, setShowArchived] = useState(false);
  const filteredLeads = useMemo(() => {
    const selected = showArchived ? leads.filter((lead) => lead.archived) : leads;
    return sortLeads(filterLeads(selected, query, stage, showArchived), sort);
  }, [leads, query, showArchived, sort, stage]);

  const openLead = useCallback((lead: Lead) => {
    router.push(`/lead/${lead.id}`);
  }, []);

  const filters: StageFilter[] = ['All', ...leadStages];

  return (
    <SalesScreen padded={false}>
      <View style={styles.content}>
        <PageHeading
          title="Leads"
          right={
            <RoundIconButton icon="plus" label="Add lead" onPress={() => router.push('/add')} />
          }
        />

        <View style={[styles.search, { backgroundColor: theme.field, borderColor: theme.border }]}>
          <Icon name="search" size={20} color={theme.textSecondary} />
          <TextInput
            accessibilityLabel="Search leads"
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name"
            placeholderTextColor={theme.textSecondary}
            returnKeyType="search"
            style={[styles.searchInput, typography.body, { color: theme.text }]}
          />
          {query.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              onPress={() => setQuery('')}
              style={styles.clearButton}
            >
              <Text style={[styles.clearText, { color: theme.accent }]}>Clear</Text>
            </Pressable>
          ) : null}
        </View>

        <ScrollView
          horizontal
          style={styles.filterScroll}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
          accessibilityLabel="Filter leads by stage"
        >
          {filters.map((filter) => (
            <Chip
              key={filter}
              label={filter}
              selected={stage === filter}
              onPress={() => setStage(filter)}
            />
          ))}
        </ScrollView>

        <View style={styles.controls}>
          <View style={styles.segmented}>
            {([false, true] as const).map((archived) => {
              const selected = showArchived === archived;
              return (
                <Pressable
                  key={String(archived)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setShowArchived(archived)}
                  style={[
                    styles.segment,
                    {
                      backgroundColor: selected ? theme.accentSoft : 'transparent',
                      borderColor: selected ? theme.border : 'transparent',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      { color: selected ? theme.accent : theme.textSecondary },
                    ]}
                  >
                    {archived ? 'Archived' : 'Active'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Sort by ${sort}. Tap to change.`}
            onPress={() =>
              setSort(sort === 'Next follow-up' ? 'Recently updated' : 'Next follow-up')
            }
            style={styles.sortButton}
          >
            <Text style={[styles.sortText, { color: theme.textSecondary }]}>Sort: {sort}</Text>
          </Pressable>
        </View>

        <FlatList
          data={filteredLeads}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.rowLead}>
                <LeadRow lead={item} onPress={() => openLead(item)} />
              </View>
              {showArchived ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Restore ${item.name}`}
                  onPress={() => restoreLead(item.id)}
                  style={({ pressed }) => [
                    styles.restore,
                    { backgroundColor: theme.accentSoft, opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Text style={[styles.restoreText, { color: theme.accent }]}>Restore</Text>
                </Pressable>
              ) : null}
            </View>
          )}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState
              title="No matching leads"
              description={
                query
                  ? 'Try another name or clear your search.'
                  : 'There are no leads in this stage yet.'
              }
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
  search: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchInput: { flex: 1, minHeight: MIN_TOUCH_TARGET },
  clearButton: {
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    paddingLeft: spacing.sm,
  },
  clearText: { ...typography.label },
  filterScroll: { flexGrow: 0, marginBottom: spacing.sm },
  filters: { flexDirection: 'row', gap: spacing.sm, paddingRight: spacing.lg },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  segmented: { flexDirection: 'row', gap: 2 },
  segment: {
    minHeight: 36,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
  },
  segmentText: { fontSize: 12, fontWeight: '600' },
  sortButton: { minHeight: MIN_TOUCH_TARGET, justifyContent: 'center' },
  sortText: { ...typography.caption },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rowLead: { flex: 1 },
  restore: {
    minHeight: 40,
    justifyContent: 'center',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
  },
  restoreText: { fontSize: 12, fontWeight: '700' },
  listContent: { flexGrow: 1, paddingBottom: TAB_BAR_CLEARANCE, gap: spacing.sm },
});
