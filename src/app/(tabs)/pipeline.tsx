import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { LeadAvatar, PageHeading, RoundIconButton, SalesScreen } from '@/components/sales-ui';
import { useTheme } from '@/components/ui';
import { usePreviewLeads } from '@/features/leads/PreviewLeadsProvider';
import type { LeadStage } from '@/features/leads/preview-data';
import { radius, spacing, TAB_BAR_CLEARANCE, typography } from '@/theme';

const columnOrder: LeadStage[] = ['New', 'Contacted', 'Qualified', 'Follow-up'];

export default function PipelineScreen() {
  const { colors: theme } = useTheme();
  const { leads } = usePreviewLeads();
  const { width } = useWindowDimensions();
  const activeLeads = leads.filter((lead) => !lead.archived);
  const columnWidth = Math.max(168, Math.min(240, width * 0.46));

  return (
    <SalesScreen padded={false}>
      <View style={styles.content}>
        <PageHeading
          title="Pipeline"
          right={
            <RoundIconButton icon="plus" label="Add lead" onPress={() => router.push('/add')} />
          }
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.board}
          accessibilityLabel="Sales pipeline stages"
        >
          {columnOrder.map((stage) => {
            const stageLeads = activeLeads.filter((lead) => lead.stage === stage);
            return (
              <View
                key={stage}
                style={[
                  styles.column,
                  {
                    width: columnWidth,
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View style={styles.columnHeader}>
                  <Text style={[styles.columnTitle, { color: theme.text }]}>{stage}</Text>
                  <Text style={[styles.columnCount, { color: theme.textSecondary }]}>
                    {stageLeads.length}
                  </Text>
                </View>
                {stageLeads.length === 0 ? (
                  <Text style={[styles.columnEmpty, { color: theme.textFaint }]}>
                    No leads in this stage.
                  </Text>
                ) : (
                  stageLeads.map((lead) => (
                    <View
                      key={lead.id}
                      style={[
                        styles.leadCard,
                        {
                          backgroundColor: theme.surfaceStrong,
                          borderColor: theme.hairline,
                        },
                      ]}
                    >
                      <LeadAvatar name={lead.name} size={38} />
                      <View style={styles.leadBody}>
                        <Text numberOfLines={1} style={[styles.leadName, { color: theme.text }]}>
                          {lead.name}
                        </Text>
                        <Text
                          numberOfLines={2}
                          style={[styles.leadSummary, { color: theme.textSecondary }]}
                        >
                          {lead.summary}
                        </Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </SalesScreen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: spacing.lg },
  board: {
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingBottom: TAB_BAR_CLEARANCE,
    paddingRight: spacing.lg,
  },
  column: {
    gap: spacing.sm,
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.md,
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  columnTitle: { ...typography.heading, fontSize: 20 },
  columnCount: { ...typography.label, fontSize: 15 },
  columnEmpty: { ...typography.caption, lineHeight: 17, paddingHorizontal: spacing.xs },
  leadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  leadBody: { flex: 1, gap: 2 },
  leadName: { fontSize: 15, fontWeight: '700' },
  leadSummary: { fontSize: 12, lineHeight: 16 },
});
