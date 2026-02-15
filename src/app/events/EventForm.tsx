'use client';

import { useTranslations } from 'next-intl';
import useEventForm from './useEventForm';
import {
  Card,
  CardTitle,
  CardContent,
  Button,
  Input,
  DataList,
  SpaceChildrenVertically,
} from '@/components';
import { EventFormData, MatchData } from '@/lib/types';

type EventFormProps = {
  archetypes: string[];
  mode: 'create' | 'edit';
  eventId?: string;
  initialEventData?: EventFormData;
  initialMatches?: MatchData[];
};

const EventForm = ({
  archetypes,
  mode,
  eventId,
  initialEventData,
  initialMatches,
}: EventFormProps) => {
  const t = useTranslations('eventForm');

  const {
    eventData,
    matches,
    handleEventChange,
    handleMatchChange,
    addMatch,
    removeMatch,
    handleSubmit,
  } = useEventForm({ mode, eventId, initialEventData, initialMatches });

  return (
    <form onSubmit={handleSubmit}>
      <SpaceChildrenVertically>
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
        {matches.map((match: MatchData, index: number) => (
          <Card key={match.id || index}>
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
              <DataList
                id={`opponent-${index}`}
                label={t('opponentArchetype')}
                value={match.opponentArchetype}
                onChange={e =>
                  handleMatchChange({
                    index,
                    field: 'opponentArchetype',
                    value: e.target.value,
                  })
                }
                options={archetypes}
                required
              />
              <Input
                type="number"
                id={`wins-${index}`}
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
        <Button type="submit">
          {mode === 'create' ? t('createEvent') : t('updateEvent')}
        </Button>
      </SpaceChildrenVertically>
    </form>
  );
};

export default EventForm;
