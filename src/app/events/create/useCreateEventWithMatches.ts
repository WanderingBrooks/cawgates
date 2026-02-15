import { useState } from 'react';
import { createEventWithMatches } from '@/app/actions/events';
import { EventFormInputData, MatchInputData } from '@/lib/types';

const useCreateEventWithMatches = () => {
  const [eventData, setEventData] = useState<EventFormInputData>({
    eventName: '',
    eventDate: '',
    notes: '',
  });

  const [matches, setMatches] = useState<MatchInputData[]>([
    { opponentArchetype: '', wins: 0, losses: 0 },
  ]);

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
    await createEventWithMatches(eventData, matches);
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

export default useCreateEventWithMatches;
