type EventFormData = {
  eventName: string;
  eventDate: string;
  notes: string;
};

type MatchData = {
  opponentArchetype: string;
  wins: number;
  losses: number;
};

export type { EventFormData, MatchData };
