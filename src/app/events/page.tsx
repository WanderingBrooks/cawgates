import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Page } from '@/components/ui/page';

const EventsPage = async () => {
  const events = await prisma.event.findMany({
    include: {
      matches: true,
    },
    orderBy: {
      date: 'desc',
    },
  });

  return (
    <Page>
      <div className="p-4 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Events</h1>
          <Link href="/events/create">
            <Button size="default">+ New Event</Button>
          </Link>
        </div>

        {events.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">
                No events yet. Create your first event!
              </p>
              <Link href="/events/create">
                <Button>Create Event</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {events.map(event => {
              const totalWins = event.matches.reduce(
                (sum, match) => sum + match.wins,
                0,
              );

              const totalLosses = event.matches.reduce(
                (sum, match) => sum + match.losses,
                0,
              );

              const winRate =
                event.matches.length > 0
                  ? ((totalWins / (totalWins + totalLosses)) * 100).toFixed(1)
                  : '0';

              return (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <CardTitle className="line-clamp-2">
                        {event.name || 'Untitled Event'}
                      </CardTitle>
                      <CardDescription>
                        {event.date.toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Record
                          </p>
                          <p className="font-semibold">
                            {totalWins}W - {totalLosses}L
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Win Rate
                          </p>
                          <p className="font-semibold">{winRate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Matches
                          </p>
                          <p className="font-semibold">
                            {event.matches.length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Page>
  );
};

export default EventsPage;
