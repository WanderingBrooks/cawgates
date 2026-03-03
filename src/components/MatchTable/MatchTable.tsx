import { getTranslations } from 'next-intl/server';

type MatchTableRow = {
  key: string;
  archetype: string;
  wins: number;
  losses: number;
  winRate?: number;
  total?: number;
};

type MatchTableProps = {
  rows: MatchTableRow[];
};

const MatchTable = async ({ rows }: MatchTableProps) => {
  const t = await getTranslations('matchTable');

  if (rows.length === 0) {
    return <p>{t('noMatches')}</p>;
  }

  const atLeastOneMatchHasWinRate = rows.some(row => row.winRate !== undefined);
  const atLeastOneMatchHasTotal = rows.some(row => row.total !== undefined);

  return (
    <table>
      <thead>
        <tr>
          <th>{t('archetype')}</th>
          <th>{t('wins')}</th>
          <th>{t('losses')}</th>
          {atLeastOneMatchHasWinRate && <th>{t('winRate')}</th>}
          {atLeastOneMatchHasTotal && <th>{t('totalGames')}</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => {
          const winRate = ((row.winRate ?? 0) * 100).toFixed(1);

          return (
            <tr key={row.key}>
              <td>{row.archetype}</td>
              <td>{row.wins}</td>
              <td>{row.losses}</td>
              {atLeastOneMatchHasWinRate && (
                <td>{t('winRateValue', { winRate })}</td>
              )}
              {atLeastOneMatchHasTotal && <td>{row.total}</td>}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default MatchTable;
