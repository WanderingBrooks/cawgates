import { getTranslations } from 'next-intl/server';

type RecordTableRow = {
  key: string;
  archetype: string;
  matchWins: number;
  matchLosses: number;
  matchDraws: number;
  gameWins: number;
  gameLosses: number;
};

type RecordTableProps = {
  rows: RecordTableRow[];
};

const RecordTable = async ({ rows }: RecordTableProps) => {
  const t = await getTranslations('recordTable');

  if (rows.length === 0) {
    return <p>{t('noMatches')}</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>{t('archetype')}</th>
          <th>{t('matchRecord')}</th>
          <th>{t('gameRecord')}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.key}>
            <td>{row.archetype}</td>
            <td>{row.matchWins}-{row.matchLosses}-{row.matchDraws}</td>
            <td>{row.gameWins}-{row.gameLosses}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RecordTable;
