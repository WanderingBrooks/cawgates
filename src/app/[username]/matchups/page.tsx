import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getFormatsForOwner } from '@/lib/dal';
import { CreateDeckButton, PageTitle } from '@/components';

// There is no list of formats: this opens the most played one, and the
// format page has a dropdown to switch between them. The menu links
// straight to that format, so this is only reached by typing the URL or
// when the owner has no formats yet.
const MatchupsIndexPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;

  const { formats, isOwner } = await getFormatsForOwner({
    ownerUsername: username,
  });

  if (formats.length > 0) {
    redirect(`/${username}/matchups/${formats[0].id}`);
  }

  const t = await getTranslations('matchups');

  // The menu always links here, so guests get a message instead of a 404
  return (
    <>
      <PageTitle title={t('title')} />
      <p>{isOwner ? t('noFormats') : t('noFormatsGuest')}</p>
      {isOwner && (
        <div>
          <CreateDeckButton username={username} label={t('createDeck')} />
        </div>
      )}
    </>
  );
};

export default MatchupsIndexPage;
