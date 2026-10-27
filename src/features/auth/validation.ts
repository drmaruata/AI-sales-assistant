import { z } from 'zod';

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required.')
  .email('Enter a valid email address.');

export const passwordSchema = z.string().min(8, 'Use at least 8 characters.');

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required.'),
});

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirm your password.'),
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;

export function confirmPasswordsMatch(values: {
  password: string;
  confirmPassword: string;
}): boolean {
  return values.password === values.confirmPassword;
}

export function signUpIssues(values: SignUpValues) {
  const parsed = signUpSchema.safeParse(values);
  const issues: Partial<Record<keyof SignUpValues, string>> = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === 'string') {
        issues[field as keyof SignUpValues] = issue.message;
      }
    }
  }
  if (!issues.confirmPassword && !confirmPasswordsMatch(values)) {
    issues.confirmPassword = 'Passwords do not match.';
  }
  return issues;
}
