'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type NavSection = 'events' | 'decks' | 'formats';

type NavLink = {
  href: string;
  label: string;
  section: NavSection;
};

// Deck pages live directly under the username (/[username]/[deckSlug]), so
// anything that isn't an events or formats page belongs to the Decks section
const getActiveSection = (pathname: string): NavSection => {
  const section = pathname.split('/').filter(Boolean)[1];

  if (section === 'events' || section === 'formats') {
    return section;
  }

  return 'decks';
};

const NavLinks = ({
  links,
  linkClassName,
  activeClassName,
}: {
  links: NavLink[];
  linkClassName: string;
  activeClassName: string;
}) => {
  const pathname = usePathname();
  const activeSection = getActiveSection(pathname);

  return (
    <>
      {links.map(link => {
        const isActive = link.section === activeSection;

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(linkClassName, isActive && activeClassName)}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
};

export default NavLinks;
export type { NavLink };
