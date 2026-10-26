import { z } from 'zod';

/**
 * Client-safe configuration only.
 *
 * Everything here ships in the app bundle, so it must be non-secret.
 * Service-role keys and AI provider credentials never belong in this file
 * or in any `EXPO_PUBLIC_*` variable; they live in Supabase Edge Function secrets.
 */
const clientEnvSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.string().url(),
  EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  EXPO_PUBLIC_SUPABASE_JWKS_URL: z.string().url().optional(),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

function readClientEnv(): ClientEnv | null {
  const parsed = clientEnvSchema.safeParse({
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    EXPO_PUBLIC_SUPABASE_JWKS_URL: process.env.EXPO_PUBLIC_SUPABASE_JWKS_URL,
  });
  return parsed.success ? parsed.data : null;
}

export const clientEnv: ClientEnv | null = readClientEnv();

export const isSupabaseConfigured = clientEnv !== null;
