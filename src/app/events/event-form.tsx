'use client';

import Button from '@/components/button';
import Input from '@/components/input';
import DatalistInput from '@/components/datalist-input';
import useEventForm from './useEventForm';
import { Card, CardTitle, CardContent } from '@/components/card';
import SpaceChildrenVertically from '@/components/space-children-vertically';
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
          label="Event Name *"
          value={eventData.eventName}
          onChange={handleEventChange}
          required
        />
        <Input
          type="date"
          id="eventDate"
          name="eventDate"
          label="Event Date *"
          value={eventData.eventDate}
          onChange={handleEventChange}
          required
        />
        {matches.map((match: MatchData, index: number) => (
          <Card key={match.id || index}>
            <CardTitle>
              <h3>Match {index + 1}</h3>
              <Button
                disabled={matches.length <= 1}
                onClick={() => removeMatch(index)}
              >
                Remove
              </Button>
            </CardTitle>
            <CardContent>
              <DatalistInput
                id={`opponent-${index}`}
                label="Opponent Archetype *"
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
                label="Wins *"
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
                label="Losses *"
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
        <Button onClick={addMatch}>Add Match</Button>

        <Input
          id="notes"
          name="notes"
          label="Notes"
          value={eventData.notes}
          onChange={handleEventChange}
          rows={4}
          isMultiline
        />
        <Button type="submit">
          {mode === 'create' ? 'Create Event' : 'Save Changes'}
        </Button>
      </SpaceChildrenVertically>
    </form>
  );
};

export default EventForm;
