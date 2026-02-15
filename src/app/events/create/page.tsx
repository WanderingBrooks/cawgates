import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import Page from '@/components/page/page';
import Button from '@/components/button';
import EventForm from '../event-form';
import classes from '../../app.module.css';

const CreateEventPage = async () => {
  const t = await getTranslations('events');

  const matches = await prisma.match.findMany({
    select: { opponentArchetype: true },
    distinct: ['opponentArchetype'],
    orderBy: { opponentArchetype: 'asc' },
  });

  const archetypes = matches.map(match => match.opponentArchetype);

  return (
    <Page>
      <div className={classes.pageTitle}>
        <h1>{t('createEvent')}</h1>
        <Link href="/events">
          <Button>{t('title')}</Button>
        </Link>
      </div>

      <EventForm archetypes={archetypes} mode="create" />
    </Page>
  );
};

export default CreateEventPage;
