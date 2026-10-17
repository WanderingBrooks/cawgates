import Link from 'next/link';
import { getFormatter, getTranslations } from 'next-intl/server';
import { getFormatsForOwner } from '@/lib/dal';
import { cn, getMatchRecord, getWinRateTint } from '@/lib/utils';
import { PageTitle, Tooltip } from '@/components';

const FormatsPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const t = await getTranslations('formats');
  const tCommon = await getTranslations('common');
  const formatter = await getFormatter();

  const { formats } = await getFormatsForOwner({ ownerUsername: username });

  const formatRows = formats
    .map(format => {
      const matches = format.opponentArchetypes.flatMap(
        opponentArchetype => opponentArchetype.matches,
      );

      const { matchWins } = getMatchRecord({ matches });

      return {
        ...format,
        matchCount: matches.length,
        matchWinRate: matches.length === 0 ? 0 : matchWins / matches.length,
      };
    })
    // Most played formats first, alphabetical when tied
    .sort((a, b) => {
      if (b.matchCount !== a.matchCount) {
        return b.matchCount - a.matchCount;
      }

      return a.name.localeCompare(b.name);
    });

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
                <th className="text-number">{t('matches')}</th>
                <th className="text-number">
                  <Tooltip content={tCommon('matchWinPctExplainer')}>
                    {t('matchWinPct')}
                  </Tooltip>
                </th>
              </tr>
            </thead>
            <tbody>
              {formatRows.map(format => (
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
                  <td className="text-number">{format.matchCount}</td>
                  <td
                    className={cn(
                      'text-number',
                      getWinRateTint({
                        winRate: format.matchWinRate,
                        matchCount: format.matchCount,
                      }),
                    )}
                  >
                    {format.matchCount === 0
                      ? tCommon('noValue')
                      : formatter.number(format.matchWinRate, {
                          style: 'percent',
                          maximumFractionDigits: 1,
                        })}
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
