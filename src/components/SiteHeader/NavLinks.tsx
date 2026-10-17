'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type NavSection = 'events' | 'formats';

type NavLink = {
  href: string;
  label: string;
  section: NavSection;
};

// Opponent archetypes and decks belong to a format, so their pages sit
// under Formats. Anything else belongs to Events.
const FORMAT_SECTIONS = ['formats', 'opponents', 'decks'];

const getActiveSection = (pathname: string): NavSection => {
  const section = pathname.split('/').filter(Boolean)[1];

  return FORMAT_SECTIONS.includes(section) ? 'formats' : 'events';
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
