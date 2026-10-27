import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton, SalesScreen } from '@/components/sales-ui';
import { Field, useTheme } from '@/components/ui';
import { usePreviewLeads } from '@/features/leads/PreviewLeadsProvider';
import { MIN_TOUCH_TARGET, radius, spacing, typography } from '@/theme';

export default function AddLeadScreen() {
  const { colors: theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { addLead } = usePreviewLeads();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [contact, setContact] = useState('');
  const [source, setSource] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState<string | null>(null);

  function cancel() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/leads');
  }

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
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel adding a lead"
            onPress={cancel}
            style={styles.cancel}
          >
            <Text style={[styles.cancelText, { color: theme.accent }]}>Cancel</Text>
          </Pressable>

          <Text style={[typography.display, styles.title, { color: theme.text }]}>Add lead</Text>
          <Text style={[styles.preview, { color: theme.textSecondary }]}>
            Preview only. This lead stays in this session and is not saved to an account.
          </Text>

          <Field
            label="Name or business name (required)"
            value={name}
            onChangeText={(value) => {
              setName(value);
              if (error) setError(null);
            }}
            placeholder="Asha Verma"
            autoCapitalize="words"
            returnKeyType="next"
            error={error ?? undefined}
          />
          <Field
            label="Company"
            value={company}
            onChangeText={setCompany}
            placeholder="Optional"
            autoCapitalize="words"
            returnKeyType="next"
          />
          <Field
            label="Phone or email"
            value={contact}
            onChangeText={setContact}
            placeholder="Optional"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Field
            label="Source"
            value={source}
            onChangeText={setSource}
            placeholder="Walk-in, call, Instagram…"
          />
          <Field
            label="What do they need?"
            value={summary}
            onChangeText={setSummary}
            placeholder="Optional note"
          />
        </ScrollView>

        <View
          style={[
            styles.footer,
            {
              bottom: insets.bottom + spacing.md,
              backgroundColor: theme.tabBar,
              borderColor: theme.border,
            },
          ]}
        >
          <ActionButton label="Save lead" onPress={submit} />
        </View>
      </KeyboardAvoidingView>
    </SalesScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: 140 },
  cancel: { minHeight: MIN_TOUCH_TARGET, justifyContent: 'center' },
  cancelText: { ...typography.label, fontSize: 16 },
  title: { marginTop: spacing.xs, marginBottom: spacing.xs },
  preview: { ...typography.caption, lineHeight: 17, marginBottom: spacing.xl },
  footer: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    padding: spacing.sm,
  },
});
