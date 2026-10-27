import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { clientEnv } from './env';

let cachedClient: SupabaseClient | null = null;

/**
 * Creates the client on first use rather than at import time.
 *
 * Creating it eagerly runs Supabase auth initialisation as an import side effect,
 * which touches storage and crashes server-side rendering, where no `window` or
 * `localStorage` exists.
 */
export function getSupabaseClient(): SupabaseClient {
  // Fail loudly rather than silently running unauthenticated.
  // The message names variables only, never their values.
  if (!clientEnv) {
    throw new Error(
      'Supabase client configuration is missing. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env (see .env.example).',
    );
  }
  if (!cachedClient) {
    cachedClient = createClient(
      clientEnv.EXPO_PUBLIC_SUPABASE_URL,
      clientEnv.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      },
    );
  }
  return cachedClient;
}
