import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { useColorScheme } from 'react-native';

import { canvasGradient, colors, radius, shadows, spacing, typography } from '@/theme';
import { logError } from '@/lib/errors';

export type ThemePreference = 'system' | 'light' | 'dark';

const THEME_PREFERENCE_KEY = '@ai-sales-assistant/theme-preference';
const ThemePreferenceContext = createContext<{
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => Promise<void>;
} | null>(null);

export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const preferenceChanged = useRef(false);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(THEME_PREFERENCE_KEY)
      .then((stored) => {
        if (
          mounted &&
          !preferenceChanged.current &&
          (stored === 'system' || stored === 'light' || stored === 'dark')
        ) {
          setPreferenceState(stored);
        }
      })
      .catch((cause: unknown) => {
        logError('load-theme-preference', cause);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const setPreference = useCallback(async (next: ThemePreference) => {
    preferenceChanged.current = true;
    setPreferenceState(next);
    try {
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, next);
    } catch (cause) {
      logError('save-theme-preference', cause);
      throw cause;
    }
  }, []);

  return (
    <ThemePreferenceContext.Provider value={{ preference, setPreference }}>
      {children}
    </ThemePreferenceContext.Provider>
  );
}

export function useTheme() {
  const scheme = useColorScheme();
  const themePreference = useContext(ThemePreferenceContext);
  if (!themePreference) {
    throw new Error('useTheme must be used inside ThemePreferenceProvider.');
  }
  const { preference, setPreference } = themePreference;
  const name = preference === 'system' ? (scheme === 'dark' ? 'dark' : 'light') : preference;
  return {
    name,
    colors: colors[name],
    preference,
    setThemePreference: setPreference,
  };
}

export function Screen({ children, testID }: { children: ReactNode; testID?: string }) {
  const { colors: theme, name } = useTheme();
  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: theme.background, experimental_backgroundImage: canvasGradient[name] },
      ]}
      testID={testID}
    >
      {children}
    </View>
  );
}

export function Title({ children }: { children: ReactNode }) {
  const { colors: theme } = useTheme();
  return <Text style={[typography.display, styles.title, { color: theme.text }]}>{children}</Text>;
}

export function Body({ children }: { children: ReactNode }) {
  const { colors: theme } = useTheme();
  return (
    <Text style={[typography.body, styles.body, { color: theme.textSecondary }]}>{children}</Text>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  const { colors: theme } = useTheme();
  return <Text style={[typography.label, { color: theme.textSecondary }]}>{children}</Text>;
}

type FieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export function Field({ label, error, ...inputProps }: FieldProps) {
  const { colors: theme } = useTheme();
  const invalid = Boolean(error);

  return (
    <View style={styles.field}>
      <FieldLabel>{label}</FieldLabel>
      <TextInput
        {...inputProps}
        accessibilityLabel={label}
        placeholderTextColor={theme.textSecondary}
        style={[
          styles.input,
          typography.body,
          {
            color: theme.text,
            backgroundColor: theme.field,
            borderColor: invalid ? theme.danger : theme.border,
          },
        ]}
      />
      {invalid ? (
        <Text
          accessibilityRole="alert"
          style={[typography.caption, styles.fieldError, { color: theme.danger }]}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

export function Button({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  testID,
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  testID?: string;
}) {
  const { colors: theme } = useTheme();
  const inactive = disabled || loading;
  const primary = variant === 'primary';
  const foreground = primary ? theme.accentText : theme.accent;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.button,
        primary
          ? { backgroundColor: theme.accent, boxShadow: shadows.accent }
          : {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              borderWidth: 1,
            },
        { opacity: inactive ? 0.6 : pressed ? 0.8 : 1 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={foreground} />
      ) : (
        <Text style={[typography.label, styles.buttonLabel, { color: foreground }]}>{label}</Text>
      )}
    </Pressable>
  );
}

export function FormError({ message, testID }: { message: string | null; testID?: string }) {
  const { colors: theme } = useTheme();
  if (!message) {
    return null;
  }
  return (
    <Text
      accessibilityRole="alert"
      testID={testID}
      style={[typography.caption, styles.formError, { color: theme.danger }]}
    >
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    marginBottom: spacing.sm,
  },
  body: {
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  field: {
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  fieldError: {
    marginTop: spacing.xs,
  },
  button: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  buttonLabel: {
    fontSize: 16,
    textAlign: 'center',
  },
  formError: {
    marginBottom: spacing.md,
  },
});
