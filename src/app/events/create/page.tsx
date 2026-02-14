'use client';

import { useState } from 'react';
import { createEventWithMatches } from '@/app/actions/events';

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
    <form action={handleSubmit} className="space-y-4 p-4">
      <div>
        <label htmlFor="eventName" className="block font-semibold">
          Event Name
        </label>
        <input
          id="eventName"
          type="text"
          name="eventName"
          placeholder="Event Name"
          className="border px-2 py-1 rounded w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="eventDate" className="block font-semibold">
          Event Date
        </label>
        <input
          id="eventDate"
          type="datetime-local"
          name="eventDate"
          className="border px-2 py-1 rounded w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="notes" className="block font-semibold">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          placeholder="Notes"
          className="border px-2 py-1 rounded w-full"
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Matches</h3>
        {matches.map((match, index) => (
          <div key={index} className="border p-3 rounded space-y-2">
            <input
              type="text"
              placeholder="Opponent Deck"
              value={match.opponentDeck}
              onChange={e => {
                const updated = [...matches];
                updated[index].opponentDeck = e.target.value;
                setMatches(updated);
              }}
              className="border px-2 py-1 rounded w-full"
              required
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Wins"
                value={match.wins}
                onChange={e => {
                  const updated = [...matches];
                  updated[index].wins = parseInt(e.target.value) || 0;
                  setMatches(updated);
                }}
                className="border px-2 py-1 rounded flex-1"
              />
              <input
                type="number"
                placeholder="Losses"
                value={match.losses}
                onChange={e => {
                  const updated = [...matches];
                  updated[index].losses = parseInt(e.target.value) || 0;
                  setMatches(updated);
                }}
                className="border px-2 py-1 rounded flex-1"
              />
            </div>
            {matches.length > 1 && (
              <button
                type="button"
                onClick={() => removeMatch(index)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove Match
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addMatch}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Match
      </button>
      <button
        type="submit"
        disabled={isLoading}
        className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isLoading ? 'Creating...' : 'Create Event'}
      </button>
    </form>
  );
};

export default CreateEventPage;
