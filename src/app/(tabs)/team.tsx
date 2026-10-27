import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet } from 'react-native';

import {
  ActionButton,
  BackLink,
  Badge,
  LeadAvatar,
  ListRow,
  PageHeading,
  SalesScreen,
  type ListTone,
} from '@/components/sales-ui';
import { spacing, TAB_BAR_CLEARANCE } from '@/theme';

const members: {
  name: string;
  email: string;
  role: string;
  tone: ListTone;
}[] = [
  { name: 'Alex Kumar', email: 'alex@company.com', role: 'Owner', tone: 'accent' },
  { name: 'Priya Mehta', email: 'priya@company.com', role: 'Admin', tone: 'peach' },
  { name: 'Rohit Shah', email: 'rohit@company.com', role: 'Member', tone: 'neutral' },
  { name: 'Sneha Iyer', email: 'sneha@company.com', role: 'Member', tone: 'neutral' },
];

export default function TeamScreen() {
  return (
    <SalesScreen padded={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BackLink label="More" onPress={() => router.back()} />
        <PageHeading
          title="Team"
          right={
            <ActionButton
              label="Invite"
              onPress={() =>
                Alert.alert('Invite teammate', 'Team invitations are a preview in this build.')
              }
            />
          }
        />
        {members.map((member) => (
          <ListRow
            key={member.email}
            title={member.name}
            description={member.email}
            leading={<LeadAvatar name={member.name} size={48} />}
            trailing={<Badge label={member.role} tone={member.tone} />}
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
});
