import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { filterLeads, initialPreviewLeads, sortLeads } from '../../src/features/leads/preview-data.ts';

describe('filterLeads', () => {
  it('returns all leads for a blank query and All stage', () => {
    assert.equal(filterLeads(initialPreviewLeads, '  ', 'All').length, 4);
  });

  it('searches names, businesses, and notes without case sensitivity', () => {
    assert.deepEqual(
      filterLeads(initialPreviewLeads, 'GREENFIELD', 'All').map((lead) => lead.id),
      ['lead-1']
    );
    assert.deepEqual(
      filterLeads(initialPreviewLeads, 'starter plan', 'All').map((lead) => lead.id),
      ['lead-2']
    );
  });

  it('combines the query and stage filters', () => {
    assert.deepEqual(
      filterLeads(initialPreviewLeads, 'academy', 'Follow-up').map((lead) => lead.id),
      ['lead-1']
    );
    assert.deepEqual(filterLeads(initialPreviewLeads, 'academy', 'New'), []);
  });

  it('hides archived leads unless the archived view is requested', () => {
    const archived = { ...initialPreviewLeads[0], archived: true };
    assert.deepEqual(filterLeads([archived], '', 'All'), []);
    assert.deepEqual(filterLeads([archived], '', 'All', true), [archived]);
  });

  it('sorts leads by next follow-up and recency', () => {
    const leads = [
      { ...initialPreviewLeads[2], followUp: null },
      { ...initialPreviewLeads[1], followUp: 'Overdue · 9:00 AM' },
      initialPreviewLeads[0],
    ];
    assert.deepEqual(
      sortLeads(leads, 'Next follow-up').map((lead) => lead.id),
      ['lead-2', 'lead-1', 'lead-3']
    );
    assert.deepEqual(
      sortLeads(leads, 'Recently updated').map((lead) => lead.id),
      ['lead-1', 'lead-2', 'lead-3']
    );
  });
});
