import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';

import { getSupabaseClient } from '@/lib/supabase';
import { logError, toUserMessage } from '@/lib/errors';

type AuthResult = { error: string | null };

type AuthContextValue = {
  session: Session | null;
  /** True until the persisted session has been read, so screens can hold rendering. */
  initialising: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [initialising, setInitialising] = useState(true);

  useEffect(() => {
    // Resolve the client inside the effect so it is never constructed during
    // server-side rendering. A missing configuration throws and fails loudly,
    // which is the intended behaviour.
    let active = true;
    let unsubscribe = () => {};

    const auth = getSupabaseClient().auth;

    const { data } = auth.onAuthStateChange((_event, nextSession) => {
      if (active) {
        setSession(nextSession);
      }
    });
    unsubscribe = data.subscription.unsubscribe;

    auth
      .getSession()
      .then(({ data: sessionData }) => {
        if (active) {
          setSession(sessionData.session);
        }
      })
      .catch((error) => {
        logError('auth.getSession', error);
        if (active) {
          setSession(null);
        }
      })
      .finally(() => {
        if (active) {
          setInitialising(false);
        }
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await getSupabaseClient().auth.signInWithPassword({
      email,
      password,
    });
    return { error: error ? toUserMessage(error) : null };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await getSupabaseClient().auth.signUp({ email, password });
    return { error: error ? toUserMessage(error) : null };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await getSupabaseClient().auth.signOut();
    if (error) {
      throw error;
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ session, initialising, signIn, signUp, signOut }),
    [session, initialising, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider.');
  }
  return context;
}
