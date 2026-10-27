import { router, type Href } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { ListRow, PageHeading, SalesScreen, type ListTone } from '@/components/sales-ui';
import type { IconName } from '@/components/icon';
import { spacing, TAB_BAR_CLEARANCE } from '@/theme';

type HubRow = {
  label: string;
  icon: IconName;
  route: Href;
  tone: ListTone;
};

const rows: HubRow[] = [
  { label: 'Profile and workspace', icon: 'person', route: '/settings', tone: 'accent' },
  { label: 'Business profile', icon: 'storefront', route: '/business-profile', tone: 'peach' },
  { label: 'AI templates', icon: 'document', route: '/ai-templates', tone: 'accent' },
  { label: 'Team management', icon: 'team', route: '/team', tone: 'mint' },
  { label: 'Integrations', icon: 'integrations', route: '/integrations', tone: 'sky' },
  { label: 'Analytics', icon: 'analytics', route: '/analytics', tone: 'peach' },
  {
    label: 'Subscription and AI usage',
    icon: 'subscription',
    route: '/subscription',
    tone: 'accent',
  },
  { label: 'Help and support', icon: 'help', route: '/help', tone: 'sky' },
  { label: 'Delete account', icon: 'trash', route: '/data-controls', tone: 'danger' },
];

export default function MoreScreen() {
  return (
    <SalesScreen padded={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageHeading title="Settings" />
        {rows.map((row) => (
          <ListRow
            key={row.label}
            title={row.label}
            icon={row.icon}
            tone={row.tone}
            onPress={() => router.push(row.route)}
          />
        ))}
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
});
