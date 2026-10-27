import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BackLink, Badge, Card, PageHeading, SalesScreen } from '@/components/sales-ui';
import { useTheme } from '@/components/ui';
import { usePreviewLeads } from '@/features/leads/PreviewLeadsProvider';
import { radius, spacing, TAB_BAR_CLEARANCE, typography } from '@/theme';

const trendLeads = [0.18, 0.34, 0.28, 0.56, 0.48, 0.72, 0.62, 0.84];
const trendReplies = [0.08, 0.18, 0.14, 0.32, 0.3, 0.44, 0.4, 0.58];

function TrendLine({
  values,
  color,
  width,
  height,
}: {
  values: number[];
  color: string;
  width: number;
  height: number;
}) {
  const points = values.map((value, index) => ({
    x: (width / (values.length - 1)) * index,
    y: height - value * height,
  }));

  return (
    <>
      {points.slice(0, -1).map((point, index) => {
        const next = points[index + 1];
        const dx = next.x - point.x;
        const dy = next.y - point.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        return (
          <View
            key={index}
            style={{
              position: 'absolute',
              left: (point.x + next.x) / 2 - length / 2,
              top: (point.y + next.y) / 2 - 1.5,
              width: length,
              height: 3,
              borderRadius: 2,
              backgroundColor: color,
              transform: [{ rotate: `${Math.atan2(dy, dx)}rad` }],
            }}
          />
        );
      })}
    </>
  );
}

export default function AnalyticsScreen() {
  const { colors: theme } = useTheme();
  const { leads, followUps } = usePreviewLeads();
  const [chartWidth, setChartWidth] = useState(0);
  const activeLeads = leads.filter((lead) => !lead.archived);
  const metrics = [
    { label: 'Total leads', value: activeLeads.length },
    {
      label: 'Replied',
      value: activeLeads.filter((lead) => lead.stage === 'Contacted' || lead.stage === 'Qualified')
        .length,
    },
    { label: 'Follow-ups', value: followUps.filter((item) => item.status === 'Pending').length },
    { label: 'Qualified', value: activeLeads.filter((lead) => lead.stage === 'Qualified').length },
  ];

  return (
    <SalesScreen padded={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BackLink label="More" onPress={() => router.back()} />
        <PageHeading title="Analytics" right={<Badge label="Last 30 days" />} />

        <View style={styles.grid}>
          {metrics.map((metric) => (
            <Card key={metric.label} style={styles.metric}>
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                {metric.label}
              </Text>
              <Text style={[styles.metricValue, { color: theme.text }]}>{metric.value}</Text>
            </Card>
          ))}
        </View>

        <Card>
          <Text style={[typography.heading, { color: theme.text }]}>Leads trend</Text>
          <View
            style={styles.chart}
            onLayout={(event) => setChartWidth(event.nativeEvent.layout.width)}
          >
            {chartWidth > 0 ? (
              <>
                <TrendLine
                  values={trendLeads}
                  color={theme.accent}
                  width={chartWidth}
                  height={140}
                />
                <TrendLine
                  values={trendReplies}
                  color={theme.accentMuted}
                  width={chartWidth}
                  height={140}
                />
              </>
            ) : null}
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: theme.accent }]} />
              <Text style={[styles.legendText, { color: theme.textSecondary }]}>New</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: theme.accentMuted }]} />
              <Text style={[styles.legendText, { color: theme.textSecondary }]}>Replied</Text>
            </View>
            <Text style={[styles.legendText, { color: theme.textFaint }]}>· sample trend</Text>
          </View>
        </Card>
      </ScrollView>
    </SalesScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: TAB_BAR_CLEARANCE,
    gap: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  metric: {
    flexGrow: 1,
    flexBasis: '45%',
    paddingVertical: spacing.lg,
  },
  metricLabel: { ...typography.label, fontWeight: '500' },
  metricValue: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
    marginTop: 2,
  },
  chart: { height: 140, marginTop: spacing.lg, marginBottom: spacing.md },
  legend: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: radius.pill },
  legendText: { ...typography.caption },
});
