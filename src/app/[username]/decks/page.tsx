import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getDecksForOwner } from '@/lib/dal';
import { Button, PageTitle } from '@/components';

const DecksPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const t = await getTranslations('decks');

  const { decks, isOwner } = await getDecksForOwner({
    ownerUsername: username,
  });

  return (
    <>
      <PageTitle
        title={isOwner ? t('title') : t('guestTitle', { username })}
        actions={
          isOwner && (
            <Link href={`/${username}/decks/create`}>
              <Button variant="primary">{t('createDeck')}</Button>
            </Link>
          )
        }
      />

      {decks.length === 0 ? (
        <p>{t('noDecks')}</p>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>{t('deck')}</th>
                <th>{t('format')}</th>
                <th className="text-number">{t('events')}</th>
              </tr>
            </thead>
            <tbody>
              {decks.map(deck => (
                <tr key={deck.id}>
                  <td>
                    <Link href={`/${username}/${deck.slug}`}>{deck.name}</Link>
                  </td>
                  <td>{deck.format.name}</td>
                  <td className="text-number">{deck._count.events}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default DecksPage;
