import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { BackLink, ListRow, PageHeading, SalesScreen, type ListTone } from '@/components/sales-ui';
import { Icon } from '@/components/icon';
import { useTheme } from '@/components/ui';
import { MIN_TOUCH_TARGET, radius, spacing, TAB_BAR_CLEARANCE, typography } from '@/theme';

const topics: { title: string; tone: ListTone }[] = [
  { title: 'Getting started', tone: 'accent' },
  { title: 'Connect your channels', tone: 'peach' },
  { title: 'Manage leads', tone: 'mint' },
  { title: 'AI replies', tone: 'danger' },
  { title: 'Billing and subscription', tone: 'sky' },
  { title: 'Contact support', tone: 'accent' },
];

export default function HelpScreen() {
  const { colors: theme } = useTheme();
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLocaleLowerCase();
  const visible = topics.filter((topic) => topic.title.toLocaleLowerCase().includes(normalized));

  return (
    <SalesScreen padded={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BackLink label="More" onPress={() => router.back()} />
        <PageHeading title="Help & Support" />

        <View
          style={[
            styles.search,
            {
              backgroundColor: theme.field,
              borderColor: theme.border,
            },
          ]}
        >
          <Icon name="search" size={20} color={theme.textSecondary} />
          <TextInput
            accessibilityLabel="Search help topics"
            placeholder="Search for help..."
            placeholderTextColor={theme.textSecondary}
            value={query}
            onChangeText={setQuery}
            style={[styles.searchInput, typography.body, { color: theme.text }]}
          />
        </View>

        {visible.map((topic) => (
          <ListRow
            key={topic.title}
            title={topic.title}
            icon="help"
            tone={topic.tone}
            onPress={() => Alert.alert(topic.title, 'Help articles are a preview in this build.')}
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
  search: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
  searchInput: { flex: 1, minHeight: MIN_TOUCH_TARGET },
});
