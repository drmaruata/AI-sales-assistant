import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput } from 'react-native';

import { ActionButton, PageHeading, PreviewNotice, SalesScreen } from '@/components/sales-ui';
import { useTheme } from '@/components/ui';
import { usePreviewLeads } from '@/features/leads/PreviewLeadsProvider';
import { radius, spacing, typography } from '@/theme';

export default function EditLeadScreen() {
  const { colors: theme } = useTheme();
  const { leadId } = useLocalSearchParams<{ leadId: string }>();
  const { leads, updateLead } = usePreviewLeads();
  const lead = leads.find((item) => item.id === leadId);
  const [name, setName] = useState(lead?.name ?? '');
  const [company, setCompany] = useState(lead?.company ?? '');
  const [summary, setSummary] = useState(lead?.summary ?? '');
  const [email, setEmail] = useState(lead?.email ?? '');
  const [phone, setPhone] = useState(lead?.phone ?? '');
  const [source, setSource] = useState(lead?.source ?? '');
  const [error, setError] = useState<string | null>(null);

  function save() {
    if (!lead) {
      setError('This preview lead could not be found.');
      return;
    }
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    updateLead(lead.id, {
      name: name.trim(),
      company: company.trim() || 'Independent',
      summary: summary.trim(),
      email: email.trim(),
      phone: phone.trim(),
      source: source.trim(),
    });
    router.replace(`/lead/${lead.id}`);
  }

  return (
    <SalesScreen padded={false}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <PageHeading title="Edit lead" subtitle="Update the details you have." />
          <PreviewNotice />
          {!lead ? <Text style={[styles.error, { color: theme.danger }]}>Lead not found.</Text> : null}
          {[
            { label: 'Name *', value: name, change: setName, placeholder: 'Lead name' },
            { label: 'Business', value: company, change: setCompany, placeholder: 'Business or company' },
            { label: 'Email', value: email, change: setEmail, placeholder: 'Email address' },
            { label: 'Phone', value: phone, change: setPhone, placeholder: 'Phone number' },
            { label: 'Source', value: source, change: setSource, placeholder: 'Referral, website…' },
            { label: 'Need or context', value: summary, change: setSummary, placeholder: 'What are they looking for?' },
          ].map((field) => (
            <TextInput
              key={field.label}
              accessibilityLabel={field.label}
              value={field.value}
              onChangeText={field.change}
              placeholder={field.placeholder}
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
            />
          ))}
          {error ? <Text accessibilityRole="alert" style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}
          <ActionButton label="Save preview changes" onPress={save} disabled={!lead} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SalesScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  input: { minHeight: 48, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, fontSize: 15 },
  error: { ...typography.caption, marginBottom: spacing.md },
});
