import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import layout from '@/app/layout.module.css';

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
    <div className={`${layout.containerLg} ${layout.spacingY6}`}>
      <div className={layout.flexBetween}>
        <h1 className={`${layout.text3xl} ${layout.fontBold}`}>Events</h1>
        <Link href="/events/create">
          <Button>+ New Event</Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className={`${layout.spacingY4} ${layout.textCenter}`}>
            <p className={layout.textMuted}>No events yet. Create your first event!</p>
            <Link href="/events/create">
              <Button>Create Event</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className={layout.gridCols2}>
          {events.map((event) => {
            const totalWins = event.matches.reduce((sum, match) => sum + match.wins, 0);
            const totalLosses = event.matches.reduce((sum, match) => sum + match.losses, 0);
            const winRate =
              event.matches.length > 0
                ? ((totalWins / (totalWins + totalLosses)) * 100).toFixed(1)
                : '0';

            return (
              <Link key={event.id} href={`/events/${event.id}`}>
                <Card
                  className={`${layout.hoverShadowLg} ${layout.transitionShadow} ${layout.cursorPointer}`}
                  style={{ height: '100%' }}
                >
                  <CardHeader>
                    <CardTitle className={layout.lineClamp2}>
                      {event.name || 'Untitled Event'}
                    </CardTitle>
                    <CardDescription>{event.date.toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent className={layout.spacingY4}>
                    {event.notes && (
                      <p className={`${layout.textSm} ${layout.textMuted} ${layout.lineClamp2}`}>
                        {event.notes}
                      </p>
                    )}
                    <div className={layout.gridCols3}>
                      <div>
                        <p className={`${layout.textSm} ${layout.textMuted}`}>Record</p>
                        <p className={layout.fontSemibold}>
                          {totalWins}W - {totalLosses}L
                        </p>
                      </div>
                      <div>
                        <p className={`${layout.textSm} ${layout.textMuted}`}>Win Rate</p>
                        <p className={layout.fontSemibold}>{winRate}%</p>
                      </div>
                      <div>
                        <p className={`${layout.textSm} ${layout.textMuted}`}>Matches</p>
                        <p className={layout.fontSemibold}>{event.matches.length}</p>
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
  );
};

export default EventsPage;
