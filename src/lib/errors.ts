/**
 * Normalizes thrown values into short, user-safe messages.
 *
 * Never surface stack traces, SQL text, provider responses, or personal data
 * to the UI. Details stay in the console during development only.
 */

export class AppError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
  }
}

const GENERIC_MESSAGE = 'Something went wrong. Please try again.';

const SUPABASE_MESSAGE_BY_CODE: Record<string, string> = {
  invalid_credentials: 'The email or password is incorrect.',
  email_not_confirmed: 'Confirm your email address, then sign in.',
  user_already_exists: 'An account with this email already exists.',
  weak_password: 'Choose a stronger password.',
  over_email_send_rate_limit: 'Too many emails sent. Try again later.',
  validation_failed: 'Check the highlighted fields and try again.',
};

type ErrorLike = { code?: unknown; message?: unknown; status?: unknown };

function isErrorLike(value: unknown): value is ErrorLike {
  return typeof value === 'object' && value !== null;
}

export function toUserMessage(error: unknown): string {
  if (isErrorLike(error) && typeof error.code === 'string') {
    const mapped = SUPABASE_MESSAGE_BY_CODE[error.code];
    if (mapped) {
      return mapped;
    }
  }
  if (error instanceof AppError) {
    return error.message;
  }
  return GENERIC_MESSAGE;
}

/** Logs the real cause locally without ever rendering it to the user. */
export function logError(context: string, error: unknown): void {
  if (__DEV__) {
    console.warn(`[${context}]`, error);
  }
}
