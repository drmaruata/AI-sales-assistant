import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { BackLink, ListRow, PageHeading, SalesScreen, type ListTone } from '@/components/sales-ui';
import { useTheme } from '@/components/ui';
import { radius, spacing, TAB_BAR_CLEARANCE } from '@/theme';

const integrations: {
  title: string;
  description: string;
  action: string;
  tone: ListTone;
}[] = [
  {
    title: 'WhatsApp Business',
    description: 'Connect your business account',
    action: 'Connect',
    tone: 'accent',
  },
  { title: 'Gmail', description: 'Manage email enquiries', action: 'Connect', tone: 'peach' },
  { title: 'Instagram', description: 'Reply to Instagram DMs', action: 'Connect', tone: 'mint' },
  { title: 'Facebook', description: 'Manage Facebook leads', action: 'Connect', tone: 'danger' },
  { title: 'Web Form', description: 'Add a form to your website', action: 'Get code', tone: 'sky' },
];

export default function IntegrationsScreen() {
  const { colors: theme } = useTheme();

  return (
    <SalesScreen padded={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BackLink label="More" onPress={() => router.back()} />
        <PageHeading title="Integrations" />
        {integrations.map((item) => (
          <ListRow
            key={item.title}
            title={item.title}
            description={item.description}
            icon="integrations"
            tone={item.tone}
            trailing={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${item.action} ${item.title}`}
                onPress={() =>
                  Alert.alert(
                    item.title,
                    'Connections are a preview in this build. Only official provider APIs will be used.',
                  )
                }
                style={({ pressed }) => [
                  styles.connect,
                  { backgroundColor: theme.accentSoft, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Text style={[styles.connectText, { color: theme.accent }]}>{item.action}</Text>
              </Pressable>
            }
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
    gap: spacing.sm,
  },
  connect: {
    minHeight: 36,
    justifyContent: 'center',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
  },
  connectText: { fontSize: 13, fontWeight: '700' },
});
