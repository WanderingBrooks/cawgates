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

const CreateEventPage = () => {
  const [matches, setMatches] = useState([
    { opponentDeck: '', wins: 0, losses: 0 },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const addMatch = () => {
    setMatches([...matches, { opponentDeck: '', wins: 0, losses: 0 }]);
  };

  const removeMatch = (index: number) => {
    setMatches(matches.filter((_, i) => i !== index));
  };

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);

    try {
      await createEventWithMatches(formData, matches);
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
          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                type="text"
                name="eventName"
                placeholder="Enter event name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDate">Event Date & Time</Label>
              <Input
                id="eventDate"
                type="datetime-local"
                name="eventDate"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Add any notes about this event"
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
                        value={match.opponentDeck}
                        onChange={e => {
                          const updated = [...matches];
                          updated[index].opponentDeck = e.target.value;
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
