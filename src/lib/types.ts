type EventFormData = {
  eventName: string;
  eventDate: string;
  notes: string;
};

type MatchData = {
  id?: string;
  opponentArchetype: string;
  wins: number;
  losses: number;
};

export type { EventFormData, MatchData };
