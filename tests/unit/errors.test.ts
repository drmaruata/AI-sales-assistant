import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { AppError, toUserMessage } from '../../src/lib/errors.ts';

describe('toUserMessage', () => {
  it('maps a known Supabase error code to a safe message', () => {
    assert.equal(
      toUserMessage({ code: 'invalid_credentials', message: 'Invalid login credentials' }),
      'The email or password is incorrect.',
    );
  });

  it('returns the generic message for an unmapped code, hiding provider detail', () => {
    const message = toUserMessage({ code: 'unexpected_thing', message: 'SQL error near SELECT' });
    assert.equal(message, 'Something went wrong. Please try again.');
    assert.ok(!message.includes('SQL'));
  });

  it('does not leak an underlying error message', () => {
    const message = toUserMessage(new Error('connect ECONNREFUSED 10.0.0.1:5432'));
    assert.ok(!message.includes('ECONNREFUSED'));
    assert.ok(!message.includes('10.0.0.1'));
  });

  it('passes through AppError messages', () => {
    assert.equal(
      toUserMessage(new AppError('VALIDATION_ERROR', 'Check the fields.')),
      'Check the fields.',
    );
  });

  it('handles null and undefined without throwing', () => {
    assert.equal(toUserMessage(null), 'Something went wrong. Please try again.');
    assert.equal(toUserMessage(undefined), 'Something went wrong. Please try again.');
  });
});
