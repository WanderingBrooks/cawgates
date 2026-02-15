'use client';

import useCreateEventWithMatches from './useCreateEventWithMatches';
import {
  Card,
  CardTitle,
  CardContent,
  SpaceChildrenVertically,
  Button,
  Input,
  DataList,
} from '@/components';

const CreateEventForm = ({ archetypes }: { archetypes: string[] }) => {
  const {
    eventData,
    matches,
    handleEventChange,
    handleMatchChange,
    addMatch,
    removeMatch,
    handleSubmit,
  } = useCreateEventWithMatches();

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
        {matches.map((match, index) => (
          <Card key={index}>
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
              <DataList
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
        <Input
          id="notes"
          name="notes"
          label="Notes"
          value={eventData.notes}
          onChange={handleEventChange}
          rows={4}
          isMultiline
        />
        <Button onClick={addMatch}>Add Match</Button>
        <Button type="submit">Create Event</Button>
      </SpaceChildrenVertically>
    </form>
  );
};

export default CreateEventForm;
