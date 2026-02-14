import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Page } from '@/components/ui/page';

interface EventPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EventPage = async ({ params }: EventPageProps) => {
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
    <Page>
      <div className="p-4 max-w-2xl mx-auto space-y-6">
        <Link href="/events/create">
          <Button variant="outline">← Create New Event</Button>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              {event.name || 'Untitled Event'}
            </CardTitle>
            <CardDescription>
              {event.date.toLocaleDateString()} at{' '}
              {event.date.toLocaleTimeString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {event.notes && (
              <p className="text-sm">
                <strong>Notes:</strong> {event.notes}
              </p>
            )}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Record</p>
                <p className="text-2xl font-bold">
                  {totalWins}W - {totalLosses}L
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold">{winRate}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Matches</p>
                <p className="text-2xl font-bold">{event.matches.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Matches</h2>
          {event.matches.length === 0 ? (
            <p className="text-muted-foreground">
              No matches recorded for this event
            </p>
          ) : (
            <div className="space-y-3">
              {event.matches.map((match, index) => (
                <Card
                  key={match.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">Match {index + 1}</p>
                        <p className="text-sm text-muted-foreground">
                          {match.opponentArchetype}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          {match.wins}W - {match.losses}L
                        </p>
                      </div>
                    </div>
                    {match.journalEntry && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        {match.journalEntry}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Page>
  );
};

export default EventPage;
