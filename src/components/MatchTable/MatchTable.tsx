import { getTranslations } from 'next-intl/server';

type MatchTableRow = {
  key: string;
  archetype: string;
  wins: number;
  losses: number;
  winRate?: number;
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

  return (
    <table>
      <thead>
        <tr>
          <th>{t('archetype')}</th>
          <th>{t('wins')}</th>
          <th>{t('losses')}</th>
          {atLeastOneMatchHasWinRate && <th>{t('winRate')}</th>}
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
              {atLeastOneMatchHasWinRate && <td>{winRate}%</td>}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default MatchTable;
