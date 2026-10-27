import { useCallback, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  EmptyState,
  LeadRow,
  PageHeading,
  PreviewNotice,
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
import { MIN_TOUCH_TARGET, radius, spacing, typography } from '@/theme';

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

  const renderLead = useCallback(
    ({ item }: { item: Lead }) => <LeadRow lead={item} onPress={() => openLead(item)} />,
    [openLead],
  );

  const filters: StageFilter[] = ['All', ...leadStages];

  return (
    <SalesScreen padded={false}>
      <View style={styles.content}>
        <PageHeading
          title={showArchived ? 'Archived leads' : 'Leads'}
          subtitle={`${filteredLeads.length} ${showArchived ? 'archived' : 'sample'} enquiries`}
        />
        <PreviewNotice />
        <View
          style={[styles.search, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <Text
            accessibilityElementsHidden
            style={[styles.searchGlyph, { color: theme.textSecondary }]}
          >
            ⌕
          </Text>
          <TextInput
            accessibilityLabel="Search leads"
            value={query}
            onChangeText={setQuery}
            placeholder="Search name, business or note"
            placeholderTextColor={theme.textSecondary}
            returnKeyType="search"
            style={[styles.searchInput, { color: theme.text }]}
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
          {filters.map((filter) => {
            const selected = stage === filter;
            return (
              <Pressable
                key={filter}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setStage(filter)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: selected ? theme.accent : theme.surface,
                    borderColor: selected ? theme.accent : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: selected ? theme.accentText : theme.textSecondary },
                  ]}
                >
                  {filter}
                  {filter === 'All'
                    ? ` · ${showArchived ? leads.filter((lead) => lead.archived).length : leads.filter((lead) => !lead.archived).length}`
                    : ''}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <View style={styles.archiveSwitch}>
          {([false, true] as const).map((archived) => (
            <Pressable
              key={String(archived)}
              accessibilityRole="button"
              accessibilityState={{ selected: showArchived === archived }}
              onPress={() => setShowArchived(archived)}
              style={[
                styles.archiveOption,
                {
                  borderColor: showArchived === archived ? theme.accent : theme.border,
                  backgroundColor: showArchived === archived ? theme.accentSoft : theme.surface,
                },
              ]}
            >
              <Text
                style={[
                  styles.archiveText,
                  { color: showArchived === archived ? theme.accent : theme.textSecondary },
                ]}
              >
                {archived ? 'Archived' : 'Active'}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.sortRow}>
          <Text style={[styles.sortLabel, { color: theme.textSecondary }]}>Sort by</Text>
          {(['Next follow-up', 'Recently updated'] as const).map((value) => {
            const selected = sort === value;
            return (
              <Pressable
                key={value}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setSort(value)}
                style={[
                  styles.sortOption,
                  {
                    backgroundColor: selected ? theme.accentSoft : theme.surface,
                    borderColor: selected ? theme.accent : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.sortText,
                    { color: selected ? theme.accent : theme.textSecondary },
                  ]}
                >
                  {value}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <FlatList
          data={filteredLeads}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) =>
            showArchived ? (
              <View style={styles.archivedRow}>
                <View style={styles.archivedLead}>
                  <LeadRow lead={item} onPress={() => openLead(item)} />
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Restore ${item.name}`}
                  onPress={() => restoreLead(item.id)}
                  style={[styles.restore, { borderColor: theme.border }]}
                >
                  <Text style={[styles.restoreText, { color: theme.accent }]}>Restore</Text>
                </Pressable>
              </View>
            ) : (
              renderLead({ item })
            )
          }
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
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchGlyph: { fontSize: 23, marginRight: spacing.sm },
  searchInput: { flex: 1, minHeight: MIN_TOUCH_TARGET, fontSize: 14 },
  clearButton: { minHeight: MIN_TOUCH_TARGET, justifyContent: 'center', paddingLeft: spacing.sm },
  clearText: { ...typography.label },
  filterScroll: { flexGrow: 0, height: 52, marginBottom: spacing.md },
  filters: { alignItems: 'center', gap: spacing.sm },
  archiveSwitch: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  archiveOption: {
    minHeight: 40,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  archiveText: { fontSize: 12, fontWeight: '600' },
  archivedRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  archivedLead: { flex: 1 },
  restore: {
    minHeight: 44,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
  },
  restoreText: { fontSize: 12, fontWeight: '600' },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  sortLabel: { ...typography.caption, marginRight: spacing.xs },
  sortOption: {
    minHeight: 36,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
  },
  sortText: { fontSize: 11, fontWeight: '600' },
  filterChip: {
    minHeight: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: spacing.md,
  },
  filterText: { fontSize: 13, fontWeight: '600' },
  listContent: { flexGrow: 1, paddingBottom: spacing.lg },
});
