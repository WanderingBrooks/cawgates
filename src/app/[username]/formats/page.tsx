import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getFormatsForOwner } from '@/lib/dal';
import { Button, PageTitle } from '@/components';

// There is no list of formats: this opens the most played one, and the
// format page has a dropdown to switch between them
const FormatsPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;

  const { formats, isOwner } = await getFormatsForOwner({
    ownerUsername: username,
  });

  if (formats.length > 0) {
    redirect(`/${username}/formats/${formats[0].id}`);
  }

  if (!isOwner) {
    notFound();
  }

  const t = await getTranslations('formats');

  return (
    <>
      <PageTitle title={t('title')} />
      <p>{t('noFormats')}</p>
      <div>
        <Link href={`/${username}/decks/create`}>
          <Button variant="primary">{t('createDeck')}</Button>
        </Link>
      </div>
    </>
  );
};

export default FormatsPage;
