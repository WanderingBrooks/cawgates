import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getFormatsForOwner } from '@/lib/dal';
import { Card, CardTitle, PageTitle } from '@/components';

const FormatsPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const t = await getTranslations('formats');

  const { formats } = await getFormatsForOwner({ ownerUsername: username });

  return (
    <>
      <PageTitle title={t('title')} />
      {formats.length === 0 ? (
        <p>{t('noFormats')}</p>
      ) : (
        formats.map(format => (
          <Card key={format.id}>
            <CardTitle>
              <Link href={`/${username}/formats/${format.id}`}>
                {format.name}
              </Link>
              <span>{t('deckCount', { count: format._count.decks })}</span>
            </CardTitle>
            <div>
              <span>
                {t('opponentArchetypeCount', {
                  count: format._count.opponentArchetypes,
                })}
              </span>
            </div>
          </Card>
        ))
      )}
    </>
  );
};

export default FormatsPage;
