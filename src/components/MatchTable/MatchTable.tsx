import { getTranslations } from 'next-intl/server';

type MatchTableRow = {
  key: string;
  archetype: string;
  wins: number;
  losses: number;
};

type MatchTableProps = {
  rows: MatchTableRow[];
  showWinRate?: boolean;
};

const MatchTable = async ({ rows, showWinRate = false }: MatchTableProps) => {
  const t = await getTranslations('matchTable');

  if (rows.length === 0) {
    return <p>{t('noMatches')}</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>{t('archetype')}</th>
          <th>{t('wins')}</th>
          <th>{t('losses')}</th>
          {showWinRate && <th>{t('winRate')}</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => {
          const total = row.wins + row.losses;

          const winRate =
            total > 0 ? ((row.wins / total) * 100).toFixed(1) : '0.0';

          return (
            <tr key={row.key}>
              <td>{row.archetype}</td>
              <td>{row.wins}</td>
              <td>{row.losses}</td>
              {showWinRate && <td>{winRate}%</td>}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default MatchTable;
