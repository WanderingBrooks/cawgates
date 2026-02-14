'use client';

import { useState } from 'react';
import { createEventWithMatches } from '@/app/actions/events';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EventFormData, MatchData } from '@/lib/types';

const CreateEventPage = () => {
  const [eventData, setEventData] = useState<EventFormData>({
    eventName: '',
    eventDate: '',
    notes: '',
  });

  const [matches, setMatches] = useState<MatchData[]>([
    { opponentArchetype: '', wins: 0, losses: 0 },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const addMatch = () => {
    setMatches([...matches, { opponentArchetype: '', wins: 0, losses: 0 }]);
  };

  const removeMatch = (index: number) => {
    setMatches(matches.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createEventWithMatches(eventData, matches);
    } catch (error) {
      console.error('Failed to create event:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
          <CardDescription>Add event details and match results</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                type="text"
                placeholder="Enter event name"
                value={eventData.eventName}
                onChange={e =>
                  setEventData({ ...eventData, eventName: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDate">Event Date & Time</Label>
              <Input
                id="eventDate"
                type="datetime-local"
                value={eventData.eventDate}
                onChange={e =>
                  setEventData({ ...eventData, eventDate: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this event"
                value={eventData.notes}
                onChange={e =>
                  setEventData({ ...eventData, notes: e.target.value })
                }
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Matches</h3>
                <Button
                  type="button"
                  onClick={addMatch}
                  variant="outline"
                  size="sm"
                >
                  + Add Match
                </Button>
              </div>

              {matches.map((match, index) => (
                <Card key={index} className="bg-muted">
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <Label htmlFor={`deck-${index}`}>Opponent Deck</Label>
                      <Input
                        id={`deck-${index}`}
                        type="text"
                        placeholder="Opponent Deck"
                        value={match.opponentArchetype}
                        onChange={e => {
                          const updated = [...matches];
                          updated[index].opponentArchetype = e.target.value;
                          setMatches(updated);
                        }}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`wins-${index}`}>Wins</Label>
                        <Input
                          id={`wins-${index}`}
                          type="number"
                          placeholder="0"
                          value={match.wins}
                          onChange={e => {
                            const updated = [...matches];
                            updated[index].wins = parseInt(e.target.value) || 0;
                            setMatches(updated);
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`losses-${index}`}>Losses</Label>
                        <Input
                          id={`losses-${index}`}
                          type="number"
                          placeholder="0"
                          value={match.losses}
                          onChange={e => {
                            const updated = [...matches];

                            updated[index].losses =
                              parseInt(e.target.value) || 0;

                            setMatches(updated);
                          }}
                        />
                      </div>
                    </div>
                    {matches.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeMatch(index)}
                        variant="destructive"
                        size="sm"
                        className="w-full"
                      >
                        Remove Match
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Creating...' : 'Create Event'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEventPage;
