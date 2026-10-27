import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/icon';
import { useTheme } from '@/components/ui';
import type { Lead, LeadStage } from '@/features/leads/preview-data';
import {
  avatarTints,
  canvasGradient,
  MIN_TOUCH_TARGET,
  radius,
  shadows,
  spacing,
  typography,
  type ThemeColors,
} from '@/theme';

export function SalesScreen({
  children,
  padded = true,
}: {
  children: ReactNode;
  padded?: boolean;
}) {
  const { colors: theme, name } = useTheme();
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[
        styles.screen,
        { backgroundColor: theme.background, experimental_backgroundImage: canvasGradient[name] },
      ]}
    >
      <View style={[styles.screenContent, padded && styles.padded]}>{children}</View>
    </SafeAreaView>
  );
}

export function PreviewLabel() {
  const { colors: theme } = useTheme();
  return (
    <View style={[styles.previewLabel, { backgroundColor: theme.accentSoft }]}>
      <Text style={[styles.previewText, { color: theme.accent }]}>PREVIEW</Text>
    </View>
  );
}

export function PageHeading({
  title,
  eyebrow,
  subtitle,
  right,
}: {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  const { colors: theme } = useTheme();
  return (
    <View style={styles.pageHeading}>
      <View style={styles.headingText}>
        {eyebrow ? (
          <Text style={[styles.eyebrow, { color: theme.textSecondary }]}>{eyebrow}</Text>
        ) : null}
        <Text style={[typography.display, { color: theme.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

export function RoundIconButton({
  icon,
  onPress,
  label,
  variant = 'primary',
}: {
  icon: IconName;
  onPress: () => void;
  label: string;
  variant?: 'primary' | 'ghost';
}) {
  const { colors: theme } = useTheme();
  const primary = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.roundButton,
        primary
          ? { backgroundColor: theme.accent, boxShadow: shadows.accent }
          : { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 },
        { opacity: pressed ? 0.78 : 1 },
      ]}
    >
      <Icon name={icon} size={22} color={primary ? theme.accentText : theme.text} />
    </Pressable>
  );
}

export function Card({
  children,
  onPress,
  accessibilityLabel,
  style,
}: {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors: theme } = useTheme();
  const cardStyle = [
    styles.card,
    { backgroundColor: theme.surface, borderColor: theme.border, boxShadow: shadows.card },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => [...cardStyle, { opacity: pressed ? 0.8 : 1 }]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

export function PreviewNotice() {
  const { colors: theme } = useTheme();
  return (
    <View style={styles.notice}>
      <View style={[styles.noticeDot, { backgroundColor: theme.textFaint }]} />
      <Text style={[styles.noticeText, { color: theme.textSecondary }]}>
        Sample workspace · changes stay in this preview
      </Text>
    </View>
  );
}

export type ListTone = 'accent' | 'mint' | 'peach' | 'sky' | 'danger' | 'neutral';

function tonePalette(theme: ThemeColors, tone: ListTone) {
  switch (tone) {
    case 'mint':
      return { background: theme.successSoft, foreground: theme.success };
    case 'peach':
      return { background: theme.peachSoft, foreground: theme.warning };
    case 'sky':
      return { background: theme.skySoft, foreground: theme.sky };
    case 'danger':
      return { background: theme.dangerSoft, foreground: theme.danger };
    case 'neutral':
      return { background: theme.surfaceStrong, foreground: theme.text };
    default:
      return { background: theme.accentSoft, foreground: theme.accent };
  }
}

export function Badge({ label, tone = 'accent' }: { label: string; tone?: ListTone }) {
  const { colors: theme } = useTheme();
  const palette = tonePalette(theme, tone);
  return (
    <View style={[styles.badge, { backgroundColor: palette.background }]}>
      <Text style={[styles.badgeText, { color: palette.foreground }]}>{label}</Text>
    </View>
  );
}

export function ListRow({
  title,
  description,
  icon,
  leading,
  trailing,
  tone = 'accent',
  onPress,
}: {
  title: string;
  description?: string;
  icon?: IconName;
  leading?: ReactNode;
  trailing?: ReactNode;
  tone?: ListTone;
  onPress?: () => void;
}) {
  const { colors: theme } = useTheme();
  const palette = tonePalette(theme, tone);
  const content = (
    <>
      {icon ? (
        <View style={[styles.listRowIcon, { backgroundColor: palette.background }]}>
          <Icon name={icon} size={22} color={palette.foreground} />
        </View>
      ) : null}
      {leading}
      <View style={styles.listRowBody}>
        <Text style={[styles.listRowTitle, { color: theme.text }]}>{title}</Text>
        {description ? (
          <Text style={[styles.listRowDescription, { color: theme.textSecondary }]}>
            {description}
          </Text>
        ) : null}
      </View>
      {trailing}
      {onPress && !trailing ? <Icon name="chevronRight" size={18} color={theme.textFaint} /> : null}
    </>
  );
  const rowStyle = [
    styles.listRow,
    { backgroundColor: theme.surface, borderColor: theme.border, boxShadow: shadows.card },
  ];

  if (!onPress) {
    return <View style={rowStyle}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [...rowStyle, { opacity: pressed ? 0.8 : 1 }]}
    >
      {content}
    </Pressable>
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
          accessibilityLabel={action}
          onPress={onAction}
          style={styles.smallAction}
          hitSlop={8}
        >
          <Text style={[styles.smallActionText, { color: theme.accent }]}>{action}</Text>
          <Icon name="chevronRight" size={14} color={theme.accent} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function LeadAvatar({ name, size = 48 }: { name: string; size?: number }) {
  const { name: scheme } = useTheme();
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toLocaleUpperCase())
    .join('');
  const palette = avatarTints[scheme];
  const tint = palette[hashName(name) % palette.length];

  return (
    <View
      accessibilityElementsHidden
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: tint.background,
        },
      ]}
    >
      <Text style={[styles.avatarText, { color: tint.foreground, fontSize: size * 0.32 }]}>
        {initials}
      </Text>
    </View>
  );
}

function hashName(name: string) {
  let hash = 0;
  for (let index = 0; index < name.length; index += 1) {
    hash = (hash + name.charCodeAt(index)) % 997;
  }
  return hash;
}

export function StageBadge({ stage }: { stage: LeadStage }) {
  const { colors: theme } = useTheme();
  const stageColors = {
    New: { background: theme.surfaceStrong, foreground: theme.text, dot: theme.text },
    'Follow-up': { background: theme.skySoft, foreground: theme.sky, dot: theme.sky },
    Contacted: { background: theme.warningSoft, foreground: theme.warning, dot: theme.warning },
    Qualified: { background: theme.accentSoft, foreground: theme.accent, dot: theme.accent },
  }[stage];

  return (
    <View style={[styles.stageBadge, { backgroundColor: stageColors.background }]}>
      <View style={[styles.stageDot, { backgroundColor: stageColors.dot }]} />
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
  const followUp = lead.followUp ?? 'No follow-up';
  const overdue = followUp.toLocaleLowerCase().includes('overdue');

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`${lead.name}, ${lead.company}, ${lead.stage}`}
      style={compact ? styles.compactLeadCard : undefined}
    >
      <View style={styles.leadRowContent}>
        <LeadAvatar name={lead.name} size={compact ? 44 : 48} />
        <View style={styles.leadBody}>
          <Text numberOfLines={1} style={[styles.leadName, { color: theme.text }]}>
            {lead.name}
          </Text>
          <Text numberOfLines={1} style={[styles.leadSummary, { color: theme.textSecondary }]}>
            {lead.company} · {lead.summary}
          </Text>
        </View>
        <View style={styles.leadAside}>
          <StageBadge stage={lead.stage} />
          <Text
            numberOfLines={1}
            style={[styles.leadFollowUp, { color: overdue ? theme.danger : theme.accent }]}
          >
            {followUp}
          </Text>
        </View>
      </View>
    </Card>
  );
}

export function MetricCard({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: string | number;
  tone?: 'neutral' | 'danger' | 'accent' | 'success';
}) {
  const { colors: theme } = useTheme();
  const valueColor = {
    neutral: theme.text,
    danger: theme.danger,
    accent: theme.accent,
    success: theme.success,
  }[tone];

  return (
    <Card style={styles.metricCard}>
      <Text style={[styles.metricValue, { color: valueColor }]}>{value}</Text>
      <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>{label}</Text>
    </Card>
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
        secondary
          ? { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }
          : { backgroundColor: theme.accent, boxShadow: shadows.accent },
        { opacity: disabled ? 0.5 : pressed ? 0.8 : 1 },
      ]}
    >
      <Text style={[styles.actionButtonText, { color: secondary ? theme.text : theme.accentText }]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Chip({
  label,
  selected = false,
  onPress,
  accessibilityLabel,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}) {
  const { colors: theme } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected
          ? { backgroundColor: theme.accent, borderColor: theme.accent }
          : { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 },
        { opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <Text style={[styles.chipText, { color: selected ? theme.accentText : theme.text }]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function BackLink({ label, onPress }: { label: string; onPress: () => void }) {
  const { colors: theme } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Back to ${label}`}
      onPress={onPress}
      hitSlop={8}
      style={styles.backLink}
    >
      <Icon name="back" size={16} color={theme.accent} />
      <Text style={[styles.backText, { color: theme.accent }]}>{label}</Text>
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
    <View
      style={[styles.emptyState, { backgroundColor: theme.surface, borderColor: theme.border }]}
    >
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
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  headingText: { flex: 1, gap: 2 },
  eyebrow: { ...typography.body, fontSize: 14 },
  subtitle: { ...typography.body, lineHeight: 21 },
  previewLabel: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
  },
  previewText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  noticeDot: { width: 4, height: 4, borderRadius: 2 },
  noticeText: { ...typography.caption, lineHeight: 17 },
  sectionHeading: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  smallAction: {
    minHeight: MIN_TOUCH_TARGET,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingLeft: spacing.sm,
  },
  smallActionText: { ...typography.label, fontSize: 14 },
  avatar: { alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText: { fontWeight: '700' },
  stageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  stageDot: { width: 6, height: 6, borderRadius: 3 },
  stageText: { fontSize: 12, fontWeight: '600' },
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    borderCurve: 'continuous',
    padding: spacing.lg,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },
  listRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  listRowIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderCurve: 'continuous',
  },
  listRowBody: { flex: 1, gap: 2 },
  listRowTitle: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
  listRowDescription: { fontSize: 13, lineHeight: 18 },
  leadRowContent: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  compactLeadCard: { padding: spacing.md },
  leadBody: { flex: 1, gap: 3 },
  leadName: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
  leadSummary: { fontSize: 13, lineHeight: 18 },
  leadAside: { alignItems: 'flex-end', gap: 6, maxWidth: '38%' },
  leadFollowUp: { fontSize: 12, fontWeight: '600' },
  metricCard: { flex: 1, minWidth: 96, paddingVertical: spacing.md, paddingHorizontal: spacing.md },
  metricValue: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  metricLabel: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  actionButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
  },
  actionButtonText: { fontSize: 16, fontWeight: '600' },
  roundButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderCurve: 'continuous',
  },
  chip: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
  },
  chipText: { fontSize: 14, fontWeight: '600' },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    alignSelf: 'flex-start',
    minHeight: 32,
  },
  backText: { ...typography.label, fontSize: 14 },
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
