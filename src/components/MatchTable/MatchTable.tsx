type MatchTableRow = {
  key: string;
  archetype: string;
  wins: number;
  losses: number;
};

type MatchTableProps = {
  rows: MatchTableRow[];
  showWinRate?: boolean;
  emptyMessage?: string;
  labels: {
    archetype: string;
    wins: string;
    losses: string;
    winRate: string;
  };
};

const MatchTable = ({
  rows,
  showWinRate = false,
  emptyMessage,
  labels,
}: MatchTableProps) => {
  if (rows.length === 0 && emptyMessage) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>{labels.archetype}</th>
          <th>{labels.wins}</th>
          <th>{labels.losses}</th>
          {showWinRate && <th>{labels.winRate}</th>}
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
