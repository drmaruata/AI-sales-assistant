import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ActionButton, PageHeading, PreviewNotice, SalesScreen } from '@/components/sales-ui';
import { useTheme } from '@/components/ui';
import { usePreviewLeads } from '@/features/leads/PreviewLeadsProvider';
import type { BusinessProfile } from '@/features/leads/preview-data';
import { radius, spacing, typography } from '@/theme';

export default function BusinessProfileScreen() {
  const { colors: theme } = useTheme();
  const { businessProfile, updateBusinessProfile } = usePreviewLeads();
  const [values, setValues] = useState(businessProfile);

  function update<K extends keyof BusinessProfile>(key: K, value: BusinessProfile[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function save() {
    updateBusinessProfile(values);
    router.replace('/(tabs)/settings');
  }

  const fields: {
    key: 'name' | 'description' | 'services' | 'approvedFacts';
    label: string;
    multiline?: boolean;
  }[] = [
    { key: 'name', label: 'Business name' },
    { key: 'description', label: 'About your business', multiline: true },
    { key: 'services', label: 'Products and services', multiline: true },
    { key: 'approvedFacts', label: 'Approved facts and FAQs for reply drafts', multiline: true },
  ];

  return (
    <SalesScreen padded={false}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <PageHeading
          title="Business profile"
          subtitle="Keep the facts used in reply drafts accurate."
        />
        <PreviewNotice />
        <View style={[styles.privacy, { backgroundColor: theme.accentSoft }]}>
          <Text style={[styles.privacyTitle, { color: theme.accent }]}>About AI data use</Text>
          <Text style={[styles.privacyText, { color: theme.text }]}>
            When AI drafting is connected, selected business details and the context you choose may
            be sent to the configured AI provider. Review the facts before saving. This preview does
            not send data to an AI service.
          </Text>
        </View>
        {fields.map((field) => (
          <View key={field.key} style={styles.field}>
            <Text style={[styles.label, { color: theme.text }]}>{field.label}</Text>
            <TextInput
              accessibilityLabel={field.label}
              value={values[field.key]}
              onChangeText={(value) => update(field.key, value)}
              placeholder={field.label}
              placeholderTextColor={theme.textSecondary}
              multiline={field.multiline}
              textAlignVertical={field.multiline ? 'top' : 'center'}
              style={[
                styles.input,
                field.multiline && styles.multiline,
                { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text },
              ]}
            />
          </View>
        ))}
        <Text style={[styles.label, { color: theme.text }]}>Preferred reply tone</Text>
        <View style={styles.tones}>
          {(['Friendly', 'Professional', 'Concise'] as const).map((tone) => {
            const selected = values.tone === tone;
            return (
              <Pressable
                key={tone}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => update('tone', tone)}
                style={[
                  styles.tone,
                  {
                    backgroundColor: selected ? theme.accentSoft : theme.surface,
                    borderColor: selected ? theme.accent : theme.border,
                  },
                ]}
              >
                <Text style={[styles.toneText, { color: selected ? theme.accent : theme.text }]}>
                  {tone}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <ActionButton label="Save preview profile" onPress={save} />
      </ScrollView>
    </SalesScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  privacy: {
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  privacyTitle: { ...typography.label },
  privacyText: { ...typography.caption, lineHeight: 19 },
  field: { marginBottom: spacing.md, gap: spacing.xs },
  label: { ...typography.label, marginBottom: spacing.xs },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 15,
  },
  multiline: { minHeight: 88 },
  tones: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  tone: {
    minHeight: 44,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  toneText: { fontSize: 13, fontWeight: '600' },
});
