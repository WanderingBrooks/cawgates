'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type NavSection = 'events' | 'matchups';

type NavLink = {
  href: string;
  label: string;
  section: NavSection;
};

// Opponent archetypes belong to a format, so their pages sit under
// Matchups. Deck create and edit pages have no tab of their own, so none
// is highlighted there.
const getActiveSection = (pathname: string): NavSection | null => {
  const section = pathname.split('/').filter(Boolean)[1];

  if (section === 'events') {
    return 'events';
  }

  if (section === 'matchups' || section === 'opponents') {
    return 'matchups';
  }

  return null;
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
