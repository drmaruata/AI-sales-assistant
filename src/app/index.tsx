import { Redirect } from 'expo-router';

import { useAuth } from '@/features/auth/AuthProvider';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '@/components/ui';

export default function EntryScreen() {
  const { session, initialising } = useAuth();
  const { colors: theme } = useTheme();

  if (initialising) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return <Redirect href={session ? '/(tabs)' : '/(auth)/sign-in'} />;
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
