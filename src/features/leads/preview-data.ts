export type LeadStage = 'New' | 'Follow-up' | 'Contacted' | 'Qualified';

export type Lead = {
  id: string;
  name: string;
  company: string;
  stage: LeadStage;
  summary: string;
  updated: string;
  followUp: string | null;
  email?: string;
  phone?: string;
  source?: string;
  archived?: boolean;
  notes?: LeadNote[];
};

export type LeadNote = {
  id: string;
  text: string;
  createdAt: string;
};

export type FollowUp = {
  id: string;
  leadId: string;
  due: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
};

export type BusinessProfile = {
  name: string;
  description: string;
  services: string;
  approvedFacts: string;
  tone: 'Friendly' | 'Professional' | 'Concise';
};

export const initialPreviewLeads: Lead[] = [
  {
    id: 'lead-1',
    name: 'Mina Patel',
    company: 'Greenfield Academy',
    stage: 'Follow-up',
    summary: 'Interested in a demo for the admissions team.',
    updated: '12 min ago',
    followUp: 'Today · 11:30 AM',
    email: 'mina@example.test',
    phone: '+1 555 010 1200',
    source: 'Website enquiry',
    notes: [{ id: 'note-1', text: 'Asked for an admissions team demo.', createdAt: 'Today · 9:15 AM' }],
  },
  {
    id: 'lead-2',
    name: 'Arjun Mehta',
    company: 'Northstar Realty',
    stage: 'New',
    summary: 'Asked for details about the starter plan.',
    updated: '38 min ago',
    followUp: 'Today · 2:00 PM',
    email: 'arjun@example.test',
    source: 'Referral',
  },
  {
    id: 'lead-3',
    name: 'Sara Khan',
    company: 'Bloom Wellness',
    stage: 'Contacted',
    summary: 'Would like to review the service options.',
    updated: 'Yesterday',
    followUp: 'Tomorrow · 10:00 AM',
    email: 'sara@example.test',
    phone: '+1 555 010 3400',
    source: 'Instagram',
  },
  {
    id: 'lead-4',
    name: 'Kabir Shah',
    company: 'Cedar & Co.',
    stage: 'New',
    summary: 'Looking for a simple way to track enquiries.',
    updated: 'Yesterday',
    followUp: null,
    source: 'Walk-in',
  },
];

export const initialPreviewFollowUps: FollowUp[] = [
  { id: 'follow-up-1', leadId: 'lead-1', due: 'Today · 11:30 AM', status: 'Pending' },
  { id: 'follow-up-2', leadId: 'lead-2', due: 'Today · 2:00 PM', status: 'Pending' },
  { id: 'follow-up-3', leadId: 'lead-3', due: 'Tomorrow · 10:00 AM', status: 'Pending' },
];

export const initialBusinessProfile: BusinessProfile = {
  name: 'Sample workspace',
  description: 'A small business helping customers find the right service.',
  services: 'Introductory consultation, Starter plan',
  approvedFacts: 'We respond within one business day. A consultation helps us understand each customer’s needs.',
  tone: 'Friendly',
};

export const leadStages: LeadStage[] = ['New', 'Follow-up', 'Contacted', 'Qualified'];

export type LeadSort = 'Next follow-up' | 'Recently updated';

export function sortLeads(leads: Lead[], sort: LeadSort) {
  return [...leads].sort((left, right) => {
    if (sort === 'Next follow-up') {
      const rank = (value: string | null) => {
        if (!value) return 4;
        const normalized = value.toLocaleLowerCase();
        if (normalized.includes('overdue')) return 0;
        if (normalized.includes('today')) return 1;
        if (normalized.includes('tomorrow')) return 2;
        return 3;
      };
      return rank(left.followUp) - rank(right.followUp);
    }

    const age = (value: string) => {
      if (value.toLocaleLowerCase().includes('just now')) return 0;
      const minutes = value.match(/(\d+)\s*min/i);
      if (minutes) return Number(minutes[1]);
      if (value.toLocaleLowerCase().includes('yesterday')) return 1440;
      return Number.MAX_SAFE_INTEGER;
    };
    return age(left.updated) - age(right.updated);
  });
}

export function filterLeads(
  leads: Lead[],
  query: string,
  stage: LeadStage | 'All',
  includeArchived = false
) {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  return leads.filter((lead) => {
    if (lead.archived && !includeArchived) return false;
    const matchesStage = stage === 'All' || lead.stage === stage;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      `${lead.name} ${lead.company} ${lead.summary}`.toLocaleLowerCase().includes(normalizedQuery);

    return matchesStage && matchesQuery;
  });
}
