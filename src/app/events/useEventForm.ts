import { useState } from 'react';
import {
  createEventWithMatches,
  updateEventWithMatches,
} from '@/app/actions/events';
import { EventFormInputData, MatchInputData } from '@/lib/types';

type UseEventFormProps = {
  mode: 'create' | 'edit';
  eventId?: string;
  initialEventData?: EventFormInputData;
  initialMatches?: MatchInputData[];
};

const useEventForm = ({
  mode,
  eventId,
  initialEventData,
  initialMatches,
}: UseEventFormProps) => {
  const [eventData, setEventData] = useState<EventFormInputData>(
    initialEventData || {
      eventName: '',
      eventDate: '',
      notes: '',
    },
  );

  const [matches, setMatches] = useState<MatchInputData[]>(
    initialMatches || [{ opponentArchetype: '', wins: 0, losses: 0 }],
  );

  const handleEventChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleMatchChange = ({
    index,
    field,
    value,
  }: {
    index: number;
    field: keyof MatchInputData;
    value: string | number;
  }) => {
    setMatches(prev => {
      const updated = [...prev];

      updated[index] = { ...updated[index], [field]: value };

      return updated;
    });
  };

  const addMatch = () => {
    setMatches(prev => [
      ...prev,
      { opponentArchetype: '', wins: 0, losses: 0 },
    ]);
  };

  const removeMatch = (index: number) => {
    setMatches(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'create') {
      await createEventWithMatches({ eventData, matches });
    } else if (mode === 'edit' && eventId) {
      await updateEventWithMatches({ eventId, eventData, matches });
    }
  };

  return {
    eventData,
    matches,
    handleEventChange,
    handleMatchChange,
    addMatch,
    removeMatch,
    handleSubmit,
  };
};

export default useEventForm;
