import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { signInSchema, signUpIssues } from '../../src/features/auth/validation.ts';

describe('signInSchema', () => {
  it('accepts a valid email and a non-empty password', () => {
    const parsed = signInSchema.safeParse({
      email: 'owner@example.com',
      password: 'correct-horse',
    });
    assert.equal(parsed.success, true);
  });

  it('rejects a malformed email', () => {
    const parsed = signInSchema.safeParse({ email: 'not-an-email', password: 'x' });
    assert.equal(parsed.success, false);
  });

  it('rejects an empty password', () => {
    const parsed = signInSchema.safeParse({ email: 'owner@example.com', password: '' });
    assert.equal(parsed.success, false);
  });
});

describe('signUpIssues', () => {
  it('flags a password shorter than 8 characters', () => {
    const issues = signUpIssues({
      email: 'owner@example.com',
      password: 'short',
      confirmPassword: 'short',
    });
    assert.ok(issues.password);
  });

  it('flags mismatched confirmation even when both pass schema rules', () => {
    const issues = signUpIssues({
      email: 'owner@example.com',
      password: 'longenough1',
      confirmPassword: 'longenough2',
    });
    assert.equal(issues.confirmPassword, 'Passwords do not match.');
  });

  it('reports no issues for a valid pair', () => {
    const issues = signUpIssues({
      email: 'owner@example.com',
      password: 'longenough1',
      confirmPassword: 'longenough1',
    });
    assert.deepEqual(issues, {});
  });
});
