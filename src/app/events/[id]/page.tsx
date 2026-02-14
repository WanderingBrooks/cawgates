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
import layout from '@/app/layout.module.css';

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
    <div className={`${layout.container} ${layout.spacingY6}`}>
      <Card>
        <CardHeader>
          <CardTitle style={{ fontSize: '2rem' }}>
            {event.name || 'Untitled Event'}
          </CardTitle>
          <CardDescription>
            {event.date.toLocaleDateString()} at{' '}
            {event.date.toLocaleTimeString()}
          </CardDescription>
        </CardHeader>
        <CardContent className={layout.spacingY4}>
          {event.notes && <p className="whitespace-pre-line">{event.notes}</p>}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              textAlign: 'center',
            }}
          >
            <div>
              <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Record</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {totalWins}W - {totalLosses}L
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Win Rate</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {winRate}%
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Matches</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {event.matches.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className={layout.spacingY4}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Matches</h2>
        {event.matches.length === 0 ? (
          <p style={{ opacity: 0.7 }}>No matches recorded for this event</p>
        ) : (
          <div className={layout.spacingY2}>
            {event.matches.map((match, index) => (
              <Card
                key={match.id}
                style={{ transition: 'box-shadow 0.2s', cursor: 'default' }}
                onMouseEnter={e =>
                  (e.currentTarget.style.boxShadow =
                    '0 4px 6px rgba(0,0,0,0.1)')
                }
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                <CardContent style={{ paddingTop: '1.5rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div>
                      <p style={{ fontWeight: '600' }}>Match {index + 1}</p>
                      <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                        {match.opponentArchetype}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>
                        {match.wins}W - {match.losses}L
                      </p>
                    </div>
                  </div>
                  {match.journalEntry && (
                    <p
                      style={{
                        fontSize: '0.875rem',
                        opacity: 0.7,
                        marginTop: '0.5rem',
                        fontStyle: 'italic',
                      }}
                    >
                      {match.journalEntry}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className={layout.spacingY4}>
        <Link href="/events">
          <Button variant="outline">← Back to my events</Button>
        </Link>
      </div>
    </div>
  );
};

export default EventPage;
