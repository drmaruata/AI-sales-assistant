import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionButton, BackLink, Badge, PageHeading, SalesScreen } from '@/components/sales-ui';
import { Icon } from '@/components/icon';
import { useTheme } from '@/components/ui';
import { radius, shadows, spacing, TAB_BAR_CLEARANCE, typography } from '@/theme';

const features = ['Monthly lead allowance', 'AI reply drafts', 'Reminders and pipeline', 'Reports'];

export default function SubscriptionScreen() {
  const { colors: theme } = useTheme();

  return (
    <SalesScreen padded={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BackLink label="More" onPress={() => router.back()} />
        <PageHeading title="Subscription" />

        <View
          style={[styles.planCard, { backgroundColor: theme.accent, boxShadow: shadows.accent }]}
        >
          <View style={styles.planHeader}>
            <Text style={[styles.planName, { color: theme.accentText }]}>Pro plan</Text>
            <Badge label="Active" tone="mint" />
          </View>
          <Text style={[styles.price, { color: theme.accentText }]}>
            ₹4,999 <Text style={styles.priceUnit}>/ month</Text>
          </Text>
          <Text style={[styles.planNote, { color: theme.accentText }]}>
            Sample plan for design preview
          </Text>
          <ActionButton
            label="Manage subscription"
            secondary
            onPress={() =>
              Alert.alert('Manage subscription', 'Billing is a preview in this build.')
            }
          />
        </View>

        <View style={styles.features}>
          {features.map((feature) => (
            <View key={feature} style={styles.feature}>
              <Icon name="check" size={18} color={theme.success} />
              <Text style={[styles.featureText, { color: theme.text }]}>{feature}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SalesScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: TAB_BAR_CLEARANCE,
    gap: spacing.lg,
  },
  planCard: {
    gap: spacing.sm,
    borderRadius: radius.xl,
    borderCurve: 'continuous',
    padding: spacing.xl,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planName: { ...typography.heading, fontSize: 20 },
  price: { fontSize: 34, fontWeight: '800', letterSpacing: -1 },
  priceUnit: { fontSize: 16, fontWeight: '600' },
  planNote: { ...typography.body, opacity: 0.85, marginBottom: spacing.md },
  features: { gap: spacing.md },
  feature: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  featureText: { ...typography.body, fontSize: 16 },
});
