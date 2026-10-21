'use client';

import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import classes from './rogueRows.module.css';

/**
 * The matchups table's rogue archetypes, collapsed into one summary row
 * that opens to list each of them. Rendered as its own <tbody> so it can
 * hold state while the rows themselves stay server-rendered.
 */
const RogueRows = ({
  count,
  statCells,
  children,
}: {
  count: number;
  // The rogue totals, in the same columns as the other rows
  statCells: ReactNode;
  // One row per rogue archetype, shown while open
  children: ReactNode;
}) => {
  const t = useTranslations('matchupsPage');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <tbody className={classes.body}>
      <tr>
        <td>
          <button
            type="button"
            className={classes.toggle}
            onClick={() => setIsOpen(prev => !prev)}
          >
            {t(isOpen ? 'rogueOpen' : 'rogueClosed', { count })}
          </button>
        </td>
        {statCells}
      </tr>
      {isOpen && children}
    </tbody>
  );
};

export default RogueRows;
