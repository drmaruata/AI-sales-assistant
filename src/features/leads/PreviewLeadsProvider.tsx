import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import {
  initialBusinessProfile,
  initialPreviewFollowUps,
  initialPreviewLeads,
  type BusinessProfile,
  type FollowUp,
  type Lead,
  type LeadNote,
  type LeadStage,
} from '@/features/leads/preview-data';

type PreviewLeadsContextValue = {
  leads: Lead[];
  followUps: FollowUp[];
  businessProfile: BusinessProfile;
  addLead: (
    values: Pick<Lead, 'name' | 'company' | 'summary'> &
      Partial<Pick<Lead, 'email' | 'phone' | 'source'>>,
  ) => Lead;
  updateLead: (id: string, updates: Partial<Omit<Lead, 'id'>>) => void;
  updateStage: (id: string, stage: LeadStage) => void;
  addNote: (id: string, text: string) => void;
  archiveLead: (id: string) => void;
  restoreLead: (id: string) => void;
  createFollowUp: (leadId: string, due: string) => void;
  rescheduleFollowUp: (id: string, due: string) => void;
  updateFollowUpStatus: (id: string, status: FollowUp['status']) => void;
  updateBusinessProfile: (profile: BusinessProfile) => void;
};

const PreviewLeadsContext = createContext<PreviewLeadsContextValue | null>(null);

export function PreviewLeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState(initialPreviewLeads);
  const [followUps, setFollowUps] = useState(initialPreviewFollowUps);
  const [businessProfile, setBusinessProfile] = useState(initialBusinessProfile);

  const addLead = useCallback(
    (
      values: Pick<Lead, 'name' | 'company' | 'summary'> &
        Partial<Pick<Lead, 'email' | 'phone' | 'source'>>,
    ) => {
      const lead: Lead = {
        id: `preview-${Date.now()}`,
        name: values.name.trim(),
        company: values.company.trim() || 'Independent',
        stage: 'New',
        summary: values.summary.trim() || 'No notes added yet.',
        updated: 'Just now',
        followUp: null,
        email: values.email?.trim() || undefined,
        phone: values.phone?.trim() || undefined,
        source: values.source?.trim() || undefined,
        notes: [],
      };
      setLeads((current) => [lead, ...current]);
      return lead;
    },
    [],
  );

  const updateLead = useCallback((id: string, updates: Partial<Omit<Lead, 'id'>>) => {
    setLeads((current) =>
      current.map((lead) => (lead.id === id ? { ...lead, ...updates, updated: 'Just now' } : lead)),
    );
  }, []);

  const updateStage = useCallback((id: string, stage: LeadStage) => {
    setLeads((current) =>
      current.map((lead) => {
        if (lead.id !== id || lead.stage === stage) return lead;
        const note: LeadNote = {
          id: `activity-${Date.now()}`,
          text: `Stage changed from ${lead.stage} to ${stage}.`,
          createdAt: 'Just now',
        };
        return {
          ...lead,
          stage,
          notes: [note, ...(lead.notes ?? [])],
          updated: 'Just now',
        };
      }),
    );
  }, []);

  const addNote = useCallback((id: string, text: string) => {
    const note: LeadNote = { id: `note-${Date.now()}`, text: text.trim(), createdAt: 'Just now' };
    setLeads((current) =>
      current.map((lead) =>
        lead.id === id
          ? { ...lead, notes: [note, ...(lead.notes ?? [])], updated: 'Just now' }
          : lead,
      ),
    );
  }, []);

  const archiveLead = useCallback((id: string) => {
    setLeads((current) =>
      current.map((lead) =>
        lead.id === id ? { ...lead, archived: true, followUp: null, updated: 'Just now' } : lead,
      ),
    );
    setFollowUps((current) =>
      current.map((followUp) =>
        followUp.leadId === id && followUp.status === 'Pending'
          ? { ...followUp, status: 'Cancelled' }
          : followUp,
      ),
    );
  }, []);

  const restoreLead = useCallback((id: string) => {
    setLeads((current) =>
      current.map((lead) =>
        lead.id === id ? { ...lead, archived: false, updated: 'Just now' } : lead,
      ),
    );
  }, []);

  const createFollowUp = useCallback((leadId: string, due: string) => {
    const followUp: FollowUp = {
      id: `follow-up-${Date.now()}`,
      leadId,
      due: due.trim(),
      status: 'Pending',
    };
    setFollowUps((current) => [followUp, ...current]);
    setLeads((current) =>
      current.map((lead) =>
        lead.id === leadId ? { ...lead, followUp: due.trim(), updated: 'Just now' } : lead,
      ),
    );
  }, []);

  const updateFollowUpStatus = useCallback(
    (id: string, status: FollowUp['status']) => {
      const target = followUps.find((followUp) => followUp.id === id);
      setFollowUps((current) =>
        current.map((followUp) => (followUp.id === id ? { ...followUp, status } : followUp)),
      );
      if (target) {
        const nextPending = followUps.find(
          (followUp) =>
            followUp.id !== id &&
            followUp.leadId === target.leadId &&
            followUp.status === 'Pending',
        );
        setLeads((current) =>
          current.map((lead) =>
            lead.id === target.leadId && lead.followUp === target.due
              ? {
                  ...lead,
                  followUp: status === 'Pending' ? target.due : (nextPending?.due ?? null),
                  updated: 'Just now',
                }
              : lead,
          ),
        );
      }
    },
    [followUps],
  );

  const rescheduleFollowUp = useCallback(
    (id: string, due: string) => {
      setFollowUps((current) =>
        current.map((followUp) =>
          followUp.id === id ? { ...followUp, due: due.trim() } : followUp,
        ),
      );
      const current = followUps.find((followUp) => followUp.id === id);
      setLeads((currentLeads) =>
        currentLeads.map((lead) =>
          current && lead.id === current.leadId && lead.followUp === current.due
            ? { ...lead, followUp: due.trim(), updated: 'Just now' }
            : lead,
        ),
      );
    },
    [followUps],
  );

  const updateBusinessProfile = useCallback((profile: BusinessProfile) => {
    setBusinessProfile(profile);
  }, []);

  const value = useMemo(
    () => ({
      leads,
      followUps,
      businessProfile,
      addLead,
      updateLead,
      updateStage,
      addNote,
      archiveLead,
      restoreLead,
      createFollowUp,
      rescheduleFollowUp,
      updateFollowUpStatus,
      updateBusinessProfile,
    }),
    [
      leads,
      followUps,
      businessProfile,
      addLead,
      updateLead,
      updateStage,
      addNote,
      archiveLead,
      restoreLead,
      createFollowUp,
      rescheduleFollowUp,
      updateFollowUpStatus,
      updateBusinessProfile,
    ],
  );

  return <PreviewLeadsContext.Provider value={value}>{children}</PreviewLeadsContext.Provider>;
}

export function usePreviewLeads() {
  const context = useContext(PreviewLeadsContext);
  if (!context) {
    throw new Error('usePreviewLeads must be used inside PreviewLeadsProvider.');
  }
  return context;
}
