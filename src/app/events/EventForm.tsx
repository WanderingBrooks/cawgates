'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import {
  createEventWithMatches,
  updateEventWithMatches,
  type ActionResult,
} from '@/app/actions/events';
import {
  ArchetypeList,
  Card,
  CardTitle,
  CardContent,
  Button,
  ErrorMessage,
  Input,
  SpaceChildrenVertically,
} from '@/components';
import { EventFormData, MatchInput } from '@/lib/types';

/**
 * SubmitButton must be a separate component because useFormStatus() requires
 * being called from within a <form> context (as a child of the form element).
 * It cannot be called directly in EventForm since that component renders the form itself.
 */
const SubmitButton = () => {
  const { pending } = useFormStatus();
  const t = useTranslations('eventForm');

  return (
    <Button type="submit" disabled={pending}>
      {pending ? t('saving') : t('saveEvent')}
    </Button>
  );
};

type EventFormProps = {
  mode: 'create' | 'edit';
  eventId?: string;
  initialEventData?: EventFormData;
  initialMatches?: MatchInput[];
};

const EventForm = ({
  mode,
  eventId,
  initialEventData,
  initialMatches,
}: EventFormProps) => {
  const t = useTranslations('eventForm');

  const action =
    mode === 'create' ? createEventWithMatches : updateEventWithMatches;

  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    action,
    null,
  );

  // Inline state management
  const [eventData, setEventData] = useState<EventFormData>(
    initialEventData || {
      eventName: '',
      eventDate: '',
      notes: '',
    },
  );

  const [matches, setMatches] = useState<MatchInput[]>(
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
    field: keyof MatchInput;
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

  return (
    <form action={formAction}>
      <SpaceChildrenVertically>
        <input type="hidden" name="eventId" value={eventId} />

        <Input
          type="text"
          id="eventName"
          name="eventName"
          label={t('eventName')}
          value={eventData.eventName}
          onChange={handleEventChange}
          required
        />
        <Input
          type="date"
          id="eventDate"
          name="eventDate"
          label={t('eventDate')}
          value={eventData.eventDate}
          onChange={handleEventChange}
          required
        />
        {matches.map((match: MatchInput, index: number) => (
          <Card key={match.id || index}>
            {match.id && (
              <input
                type="hidden"
                name={`matches[${index}].id`}
                value={match.id}
              />
            )}
            <CardTitle>
              <h3>
                {t('matchLabel')} {index + 1}
              </h3>
              <Button
                disabled={matches.length <= 1}
                onClick={() => removeMatch(index)}
              >
                {t('removeMatch')}
              </Button>
            </CardTitle>
            <CardContent>
              <ArchetypeList
                id={`opponent-${index}`}
                name={`matches[${index}].opponentArchetype`}
                label={t('opponentArchetype')}
                value={match.opponentArchetype}
                onChange={e =>
                  handleMatchChange({
                    index,
                    field: 'opponentArchetype',
                    value: e.target.value,
                  })
                }
                required
              />
              <Input
                type="number"
                id={`wins-${index}`}
                name={`matches[${index}].wins`}
                label={t('wins')}
                value={match.wins}
                onChange={e =>
                  handleMatchChange({
                    index,
                    field: 'wins',
                    value: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
                required
              />
              <Input
                type="number"
                id={`losses-${index}`}
                name={`matches[${index}].losses`}
                label={t('losses')}
                value={match.losses}
                onChange={e =>
                  handleMatchChange({
                    index,
                    field: 'losses',
                    value: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
                required
              />
            </CardContent>
          </Card>
        ))}
        <Button onClick={addMatch}>{t('addMatch')}</Button>

        <Input
          id="notes"
          name="notes"
          label={t('notes')}
          value={eventData.notes}
          onChange={handleEventChange}
          rows={4}
          isMultiline
        />
        {state?.error && <ErrorMessage error={state.error} />}
        <SubmitButton />
      </SpaceChildrenVertically>
    </form>
  );
};

export default EventForm;
