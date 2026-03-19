import { getTranslations } from 'next-intl/server';

type RecordTableRow = {
  key: string;
  archetype: string;
  wins: number;
  losses: number;
  winRate?: number;
};

type RecordTableProps = {
  rows: RecordTableRow[];
};

const RecordTable = async ({ rows }: RecordTableProps) => {
  const t = await getTranslations('recordTable');

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
              {atLeastOneMatchHasWinRate && (
                <td>{t('winRateValue', { winRate })}</td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default RecordTable;
