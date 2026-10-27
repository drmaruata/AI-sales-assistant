import { Host, List, ListItem, Text as NativeText } from '@expo/ui';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { PageHeading, PreviewNotice, SalesScreen } from '@/components/sales-ui';
import { useTheme } from '@/components/ui';
import { usePreviewLeads } from '@/features/leads/PreviewLeadsProvider';

export default function AddActionsModal() {
  const { name, colors: theme } = useTheme();
  const { leads } = usePreviewLeads();
  const activeLeads = leads.filter((lead) => !lead.archived);

  return (
    <SalesScreen>
      <PageHeading title="Quick add" subtitle="Choose what you’d like to do" />
      <PreviewNotice />
      <Host colorScheme={name} style={styles.nativeHost}>
        <List>
          <NativeText textStyle={{ color: theme.textSecondary, fontSize: 12, fontWeight: '600' }}>
            NEW
          </NativeText>
          <ListItem
            onPress={() => router.replace('/(tabs)/add')}
            supportingText="Capture a new enquiry in your preview workspace"
            trailing={<NativeText textStyle={{ color: theme.textSecondary }}>›</NativeText>}
          >
            Add a lead
          </ListItem>

          <NativeText textStyle={{ color: theme.textSecondary, fontSize: 12, fontWeight: '600' }}>
            EXISTING LEADS
          </NativeText>
          {activeLeads.length ? (
            activeLeads.map((lead) => (
              <ListItem
                key={`note-${lead.id}`}
                onPress={() =>
                  router.replace({
                    pathname: '/note',
                    params: { leadId: lead.id },
                  })
                }
                supportingText={`Add a note for ${lead.company}`}
                trailing={<NativeText textStyle={{ color: theme.textSecondary }}>›</NativeText>}
              >
                Add note · {lead.name}
              </ListItem>
            ))
          ) : (
            <NativeText textStyle={{ color: theme.textSecondary, fontSize: 14 }}>
              Add a lead before creating a note or follow-up.
            </NativeText>
          )}
          {activeLeads.map((lead) => (
            <ListItem
              key={`follow-up-${lead.id}`}
              onPress={() =>
                router.replace({
                  pathname: '/schedule-follow-up',
                  params: { leadId: lead.id },
                })
              }
              supportingText={`Schedule a reminder for ${lead.company}`}
              trailing={<NativeText textStyle={{ color: theme.textSecondary }}>›</NativeText>}
            >
              Follow-up · {lead.name}
            </ListItem>
          ))}

          <ListItem onPress={() => router.back()}>Cancel</ListItem>
        </List>
      </Host>
    </SalesScreen>
  );
}

const styles = StyleSheet.create({
  nativeHost: { flex: 1 },
});
