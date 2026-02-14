import { prisma } from '@/lib/prisma';
import Link from 'next/link';

interface EventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: { matches: true },
  });

  if (!event) {
    return <div className="p-4">Event not found</div>;
  }

  const totalWins = event.matches.reduce((sum, match) => sum + match.wins, 0);
  const totalLosses = event.matches.reduce(
    (sum, match) => sum + match.losses,
    0,
  );

  const winRate =
    event.matches.length > 0
      ? ((totalWins / (totalWins + totalLosses)) * 100).toFixed(1)
      : '0';

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Link
        href="/events/create"
        className="text-blue-500 hover:underline mb-4 block"
      >
        ← Create New Event
      </Link>

      <div className="border rounded p-4 mb-6 bg-gray-50">
        <h1 className="text-3xl font-bold mb-2">
          {event.name || 'Untitled Event'}
        </h1>
        <p className="text-gray-600 mb-2">
          {event.date.toLocaleDateString()} at {event.date.toLocaleTimeString()}
        </p>
        {event.notes && (
          <p className="text-gray-700 mb-2">
            <strong>Notes:</strong> {event.notes}
          </p>
        )}
        <div className="mt-4 flex gap-4">
          <div>
            <p className="text-sm text-gray-600">Record</p>
            <p className="text-2xl font-bold">
              {totalWins}W - {totalLosses}L
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Win Rate</p>
            <p className="text-2xl font-bold">{winRate}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Matches</p>
            <p className="text-2xl font-bold">{event.matches.length}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Matches</h2>
        {event.matches.length === 0 ? (
          <p className="text-gray-500">No matches recorded for this event</p>
        ) : (
          <div className="space-y-3">
            {event.matches.map((match, index) => (
              <div
                key={match.id}
                className="border rounded p-3 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">Match {index + 1}</p>
                    <p className="text-sm text-gray-600">
                      {match.opponentDeck}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      {match.wins}W - {match.losses}L
                    </p>
                  </div>
                </div>
                {match.journalEntry && (
                  <p className="text-sm text-gray-700 mt-2 italic">
                    {match.journalEntry}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
