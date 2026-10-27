import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import {
  BackLink,
  Chip,
  ListRow,
  PageHeading,
  SalesScreen,
  type ListTone,
} from '@/components/sales-ui';
import { spacing, TAB_BAR_CLEARANCE } from '@/theme';

type TemplateGroup = 'All' | 'Sales' | 'Follow-up';

const templates: {
  title: string;
  group: Exclude<TemplateGroup, 'All'>;
  tone: ListTone;
}[] = [
  { title: 'Welcome message', group: 'Sales', tone: 'accent' },
  { title: 'Course enquiry reply', group: 'Sales', tone: 'peach' },
  { title: 'Pricing information', group: 'Sales', tone: 'mint' },
  { title: 'Demo invitation', group: 'Sales', tone: 'danger' },
  { title: 'Follow-up reminder', group: 'Follow-up', tone: 'sky' },
  { title: 'Objection handling', group: 'Follow-up', tone: 'accent' },
];

export default function AiTemplatesScreen() {
  const [group, setGroup] = useState<TemplateGroup>('All');
  const visible = templates.filter((item) => group === 'All' || item.group === group);

  return (
    <SalesScreen padded={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BackLink label="More" onPress={() => router.back()} />
        <PageHeading title="AI Templates" />
        <View style={styles.chips}>
          {(['All', 'Sales', 'Follow-up'] as const).map((value) => (
            <Chip
              key={value}
              label={value}
              selected={group === value}
              onPress={() => setGroup(value)}
            />
          ))}
        </View>
        {visible.map((item) => (
          <ListRow
            key={item.title}
            title={item.title}
            description="Draft with your business facts"
            icon="document"
            tone={item.tone}
            onPress={() =>
              Alert.alert(item.title, 'Template preview only. Drafts open from a lead.')
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
});
