import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '@/features/auth/AuthProvider';
import { PreviewLeadsProvider } from '@/features/leads/PreviewLeadsProvider';
import { ThemePreferenceProvider, useTheme } from '@/components/ui';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemePreferenceProvider>
        <AuthProvider>
          <PreviewLeadsProvider>
            <RootNavigator />
          </PreviewLeadsProvider>
        </AuthProvider>
      </ThemePreferenceProvider>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const { name, colors: theme } = useTheme();

  return (
    <>
      <StatusBar style={name === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen
          name="add-modal"
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: [0.7, 1],
            sheetGrabberVisible: true,
            contentStyle: { backgroundColor: theme.background },
          }}
        />
      </Stack>
    </>
  );
}
