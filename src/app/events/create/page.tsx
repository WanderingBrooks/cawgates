import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { Page, Button } from '@/components';
import EventForm from '../EventForm';
import classes from '../../app.module.css';

const CreateEventPage = async () => {
  const t = await getTranslations('createEvent');

  const matches = await prisma.match.findMany({
    select: { opponentArchetype: true },
    distinct: ['opponentArchetype'],
    orderBy: { opponentArchetype: 'asc' },
  });

  const archetypes = matches.map(match => match.opponentArchetype);

  return (
    <Page>
      <div className={classes.pageTitle}>
        <h1>{t('title')}</h1>
        <Link href="/events">
          <Button>{t('viewEvents')}</Button>
        </Link>
      </div>

      <EventForm archetypes={archetypes} mode="create" />
    </Page>
  );
};

export default CreateEventPage;
