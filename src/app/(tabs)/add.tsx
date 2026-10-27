import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';

import { ActionButton, PageHeading, PreviewNotice, SalesScreen } from '@/components/sales-ui';
import { useTheme } from '@/components/ui';
import { usePreviewLeads } from '@/features/leads/PreviewLeadsProvider';
import { radius, spacing, typography } from '@/theme';

export default function AddLeadScreen() {
  const { colors: theme } = useTheme();
  const { addLead } = usePreviewLeads();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [summary, setSummary] = useState('');
  const [contact, setContact] = useState('');
  const [source, setSource] = useState('');
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (!name.trim()) {
      setError('Enter a name to add this sample lead.');
      return;
    }
    setError(null);
    const isEmail = contact.includes('@');
    const lead = addLead({
      name,
      company,
      summary,
      email: isEmail ? contact : '',
      phone: isEmail ? '' : contact,
      source,
    });
    router.replace(`/lead/${lead.id}`);
  }

  return (
    <SalesScreen padded={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <PageHeading
            title="Add a lead"
            subtitle="Capture the basics. You can add details later."
          />
          <PreviewNotice />
          <View style={[styles.notice, { backgroundColor: theme.accentSoft }]}>
            <Text style={[styles.noticeText, { color: theme.accent }]}>
              Preview only. This lead stays on this screen session and is not saved to an account.
            </Text>
          </View>
          <Text style={[styles.label, { color: theme.text }]}>Name *</Text>
          <TextInput
            accessibilityLabel="Lead name"
            autoCapitalize="words"
            value={name}
            onChangeText={(value) => {
              setName(value);
              if (error) setError(null);
            }}
            placeholder="e.g. Priya Sharma"
            placeholderTextColor={theme.textSecondary}
            returnKeyType="next"
            style={[
              styles.input,
              { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text },
            ]}
          />
          {error ? (
            <Text accessibilityRole="alert" style={[styles.error, { color: theme.danger }]}>
              {error}
            </Text>
          ) : null}
          <Text style={[styles.label, styles.optionalLabel, { color: theme.text }]}>
            Business (optional)
          </Text>
          <TextInput
            accessibilityLabel="Business name"
            autoCapitalize="words"
            value={company}
            onChangeText={setCompany}
            placeholder="Business or company"
            placeholderTextColor={theme.textSecondary}
            returnKeyType="next"
            style={[
              styles.input,
              { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text },
            ]}
          />
          <Text style={[styles.label, styles.optionalLabel, { color: theme.text }]}>
            Phone or email (optional)
          </Text>
          <TextInput
            accessibilityLabel="Lead phone or email"
            value={contact}
            onChangeText={setContact}
            placeholder="Phone number or email"
            placeholderTextColor={theme.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[
              styles.input,
              { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text },
            ]}
          />
          <Text style={[styles.label, styles.optionalLabel, { color: theme.text }]}>
            How did they find you? (optional)
          </Text>
          <TextInput
            accessibilityLabel="Lead source"
            value={source}
            onChangeText={setSource}
            placeholder="e.g. Referral, website"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text },
            ]}
          />
          <Text style={[styles.label, styles.optionalLabel, { color: theme.text }]}>
            What are they looking for? (optional)
          </Text>
          <TextInput
            accessibilityLabel="Lead note"
            value={summary}
            onChangeText={setSummary}
            placeholder="A short note to help you remember"
            placeholderTextColor={theme.textSecondary}
            multiline
            textAlignVertical="top"
            style={[
              styles.input,
              styles.multiline,
              { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text },
            ]}
          />
          <ActionButton label="Add to preview" onPress={submit} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SalesScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  notice: { padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.lg },
  noticeText: { ...typography.caption, lineHeight: 18 },
  label: { ...typography.label, marginBottom: spacing.xs },
  optionalLabel: { marginTop: spacing.lg },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 15,
  },
  multiline: { minHeight: 104, marginBottom: spacing.xl },
  error: { ...typography.caption, marginTop: spacing.xs },
});
