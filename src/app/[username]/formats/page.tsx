import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getFormatsForOwner } from '@/lib/dal';
import { PageTitle } from '@/components';

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
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>{t('format')}</th>
                <th className="text-number">{t('decks')}</th>
                <th className="text-number">{t('opponentArchetypes')}</th>
              </tr>
            </thead>
            <tbody>
              {formats.map(format => (
                <tr key={format.id}>
                  <td>
                    <Link href={`/${username}/formats/${format.id}`}>
                      {format.name}
                    </Link>
                  </td>
                  <td className="text-number">{format._count.decks}</td>
                  <td className="text-number">
                    {format._count.opponentArchetypes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default FormatsPage;
