import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { ActionButton, PageHeading, PreviewNotice, SalesScreen } from '@/components/sales-ui';
import { useTheme } from '@/components/ui';
import { radius, spacing, typography } from '@/theme';

export default function SetupPreviewScreen() {
  const { colors: theme } = useTheme();
  const [step, setStep] = useState(0);
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');

  function continueSetup() {
    if (step < 2) {
      setStep((current) => current + 1);
      return;
    }
    router.replace('/(tabs)/add');
  }

  return (
    <SalesScreen>
      <Text style={[styles.step, { color: theme.accent }]}>SETUP PREVIEW · STEP {step + 1} OF 3</Text>
      <PageHeading
        title={step === 0 ? 'Welcome to FollowUp' : step === 1 ? 'Tell us about your business' : 'You’re ready to start'}
        subtitle={
          step === 0
            ? 'Keep enquiries organised and make the next follow-up easy to see.'
            : step === 1
              ? 'This helps tailor your workspace. You can change it later.'
              : 'Add a first lead to see how the workflow feels.'
        }
      />
      <PreviewNotice />
      {step === 0 ? (
        <View style={[styles.info, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.infoTitle, { color: theme.text }]}>You stay in control</Text>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            Reply suggestions are drafts for you to review. Your customer messages are never sent automatically.
          </Text>
        </View>
      ) : null}
      {step === 1 ? (
        <>
          <Text style={[styles.label, { color: theme.text }]}>Business name</Text>
          <TextInput
            accessibilityLabel="Business name"
            value={businessName}
            onChangeText={setBusinessName}
            placeholder="e.g. Greenfield Academy"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
          />
          <Text style={[styles.label, styles.secondLabel, { color: theme.text }]}>Business type (optional)</Text>
          <TextInput
            accessibilityLabel="Business type"
            value={businessType}
            onChangeText={setBusinessType}
            placeholder="e.g. Coaching centre"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
          />
        </>
      ) : null}
      {step === 2 ? (
        <View style={[styles.info, { backgroundColor: theme.accentSoft, borderColor: theme.accent }]}>
          <Text style={[styles.infoTitle, { color: theme.accent }]}>{businessName || 'Your workspace'}</Text>
          <Text style={[styles.infoText, { color: theme.text }]}>
            {businessType ? `${businessType} · ` : ''}Workspace creation and profile syncing are not connected in this preview.
          </Text>
        </View>
      ) : null}
      <View style={styles.button}>
        <ActionButton label={step < 2 ? 'Continue' : 'Add your first lead'} onPress={continueSetup} />
      </View>
    </SalesScreen>
  );
}

const styles = StyleSheet.create({
  step: { ...typography.caption, fontWeight: '700', letterSpacing: 0.8, marginBottom: spacing.md },
  info: { padding: spacing.lg, borderWidth: 1, borderRadius: radius.lg, gap: spacing.sm, marginTop: spacing.md },
  infoTitle: { ...typography.heading },
  infoText: { ...typography.body, lineHeight: 22 },
  label: { ...typography.label, marginBottom: spacing.xs },
  secondLabel: { marginTop: spacing.lg },
  input: { minHeight: 48, borderWidth: 1, borderRadius: radius.md, paddingHorizontal: spacing.md, fontSize: 15 },
  button: { marginTop: spacing.xl },
});
