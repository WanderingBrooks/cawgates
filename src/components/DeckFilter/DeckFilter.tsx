'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Select from '../Select';
import classes from './deckFilter.module.css';

type DeckFilterProps = {
  decks: { slug: string; name: string; isPublic: boolean }[];
  selectedDeckSlug: string | null;
};

/**
 * Filters the current page by deck through the `?deck=<slug>` search param.
 * The URL is the only state, so a filtered page can be shared or reloaded.
 * Filter changes replace the history entry so Back leaves the page instead
 * of stepping through every deck that was picked.
 */
const DeckFilter = ({ decks, selectedDeckSlug }: DeckFilterProps) => {
  const t = useTranslations('deckFilter');
  const router = useRouter();
  const pathname = usePathname();

  const options = [
    { value: '', label: t('allDecks') },
    ...decks.map(deck => ({
      value: deck.slug,
      // Only the owner is ever given private decks
      label: deck.isPublic ? deck.name : t('privateDeck', { name: deck.name }),
    })),
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deckSlug = e.target.value;

    router.replace(
      deckSlug ? `${pathname}?deck=${encodeURIComponent(deckSlug)}` : pathname,
      { scroll: false },
    );
  };

  return (
    <div className={classes.deckFilter}>
      <Select
        id="deckFilter"
        label={t('label')}
        options={options}
        value={selectedDeckSlug ?? ''}
        onChange={handleChange}
      />
    </div>
  );
};

export default DeckFilter;
