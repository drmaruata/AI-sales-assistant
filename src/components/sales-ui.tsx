import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/components/ui';
import type { Lead, LeadStage } from '@/features/leads/preview-data';
import { MIN_TOUCH_TARGET, radius, spacing, typography } from '@/theme';

export function SalesScreen({
  children,
  padded = true,
}: {
  children: ReactNode;
  padded?: boolean;
}) {
  const { colors: theme } = useTheme();
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.screen, { backgroundColor: theme.background }]}
    >
      <View style={[styles.screenContent, padded && styles.padded]}>{children}</View>
    </SafeAreaView>
  );
}

export function PreviewLabel() {
  const { colors: theme } = useTheme();
  return (
    <View style={[styles.previewLabel, { backgroundColor: theme.accentSoft }]}>
      <Text style={[styles.previewText, { color: theme.accent }]}>PREVIEW DATA</Text>
    </View>
  );
}

export function PageHeading({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  const { colors: theme } = useTheme();
  return (
    <View style={styles.pageHeading}>
      <View style={styles.headingText}>
        <Text style={[typography.title, { color: theme.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

export function PreviewNotice() {
  const { colors: theme } = useTheme();
  return (
    <View style={[styles.notice, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={[styles.noticeText, { color: theme.textSecondary }]}>
        Sample workspace · Changes stay in this preview
      </Text>
    </View>
  );
}

export function SectionHeading({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  const { colors: theme } = useTheme();
  return (
    <View style={styles.sectionHeading}>
      <Text style={[typography.heading, { color: theme.text }]}>{title}</Text>
      {action && onAction ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          style={styles.smallAction}
          hitSlop={8}
        >
          <Text style={[styles.smallActionText, { color: theme.accent }]}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function LeadAvatar({ name, size = 44 }: { name: string; size?: number }) {
  const { colors: theme } = useTheme();
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toLocaleUpperCase())
    .join('');
  return (
    <View
      accessibilityElementsHidden
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: theme.accentSoft },
      ]}
    >
      <Text style={[styles.avatarText, { color: theme.accent, fontSize: size * 0.33 }]}>
        {initials}
      </Text>
    </View>
  );
}

export function StageBadge({ stage }: { stage: LeadStage }) {
  const { colors: theme } = useTheme();
  const stageColors = {
    New: { background: theme.accentSoft, foreground: theme.accent },
    'Follow-up': { background: theme.warningSoft, foreground: theme.warning },
    Contacted: { background: theme.successSoft, foreground: theme.success },
    Qualified: { background: theme.successSoft, foreground: theme.success },
  }[stage];

  return (
    <View style={[styles.stageBadge, { backgroundColor: stageColors.background }]}>
      <Text style={[styles.stageText, { color: stageColors.foreground }]}>{stage}</Text>
    </View>
  );
}

export function LeadRow({
  lead,
  onPress,
  compact = false,
}: {
  lead: Lead;
  onPress: () => void;
  compact?: boolean;
}) {
  const { colors: theme } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${lead.name}, ${lead.company}, ${lead.stage}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.leadRow,
        compact && styles.compactLeadRow,
        { borderBottomColor: theme.border, opacity: pressed ? 0.72 : 1 },
      ]}
    >
      <LeadAvatar name={lead.name} size={compact ? 40 : 44} />
      <View style={styles.leadBody}>
        <View style={styles.leadTitleLine}>
          <Text numberOfLines={1} style={[styles.leadName, { color: theme.text }]}>
            {lead.name}
          </Text>
          <StageBadge stage={lead.stage} />
        </View>
        <Text numberOfLines={1} style={[styles.leadSummary, { color: theme.textSecondary }]}>
          {lead.summary}
        </Text>
        <Text numberOfLines={1} style={[styles.leadMeta, { color: theme.textSecondary }]}>
          {lead.company} · {lead.updated}
        </Text>
      </View>
    </Pressable>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  tone = 'accent',
}: {
  label: string;
  value: string | number;
  detail: string;
  tone?: 'accent' | 'warning' | 'success';
}) {
  const { colors: theme } = useTheme();
  const palette = {
    accent: { background: theme.accentSoft, foreground: theme.accent },
    warning: { background: theme.warningSoft, foreground: theme.warning },
    success: { background: theme.successSoft, foreground: theme.success },
  }[tone];

  return (
    <View style={[styles.metricCard, { backgroundColor: palette.background }]}>
      <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.metricValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.metricDetail, { color: palette.foreground }]}>{detail}</Text>
    </View>
  );
}

export function ActionButton({
  label,
  onPress,
  secondary = false,
  accessibilityHint,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  accessibilityHint?: string;
  disabled?: boolean;
}) {
  const { colors: theme } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        {
          backgroundColor: secondary ? theme.surface : theme.accent,
          borderColor: secondary ? theme.border : theme.accent,
          opacity: disabled ? 0.55 : pressed ? 0.78 : 1,
        },
      ]}
    >
      <Text style={[styles.actionButtonText, { color: secondary ? theme.text : theme.accentText }]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  const { colors: theme } = useTheme();
  return (
    <View style={[styles.emptyState, { borderColor: theme.border }]}>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.emptyDescription, { color: theme.textSecondary }]}>{description}</Text>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  screenContent: { flex: 1 },
  padded: { paddingHorizontal: spacing.lg },
  pageHeading: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  headingText: { flex: 1, gap: spacing.xs },
  subtitle: { ...typography.body, lineHeight: 21 },
  previewLabel: {
    alignSelf: 'flex-start',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  previewText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.7 },
  notice: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  noticeText: { ...typography.caption, lineHeight: 18 },
  sectionHeading: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  smallAction: {
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  smallActionText: { ...typography.label },
  avatar: { alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText: { fontWeight: '700' },
  stageBadge: {
    alignSelf: 'flex-start',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  stageText: { fontSize: 11, fontWeight: '600' },
  leadRow: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  compactLeadRow: { minHeight: 72 },
  leadBody: { flex: 1, gap: 3 },
  leadTitleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  leadName: { flex: 1, fontSize: 15, fontWeight: '600' },
  leadSummary: { fontSize: 13, lineHeight: 18 },
  leadMeta: { fontSize: 11, lineHeight: 16 },
  metricCard: {
    flex: 1,
    minHeight: 114,
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  metricLabel: { fontSize: 12, fontWeight: '500' },
  metricValue: { fontSize: 26, fontWeight: '700', lineHeight: 32 },
  metricDetail: { fontSize: 11, fontWeight: '600' },
  actionButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
  },
  actionButtonText: { fontSize: 15, fontWeight: '600' },
  emptyState: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
    borderWidth: 1,
    borderRadius: radius.lg,
    marginTop: spacing.md,
  },
  emptyTitle: { ...typography.heading, textAlign: 'center' },
  emptyDescription: { ...typography.body, textAlign: 'center', lineHeight: 22 },
});
