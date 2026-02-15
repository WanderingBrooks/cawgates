type EventFormInputData = {
  eventName: string;
  eventDate: string;
  notes: string;
};

type MatchInputData = {
  id?: string;
  opponentArchetype: string;
  wins: number;
  losses: number;
};

export type { EventFormInputData, MatchInputData };
