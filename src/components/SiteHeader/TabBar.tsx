'use client';

import { usePathname } from 'next/navigation';
import NavLinks, { type NavLink } from './NavLinks';

// Create and edit pages pin their own Cancel and Save to the bottom of the
// screen instead, so a stray tap can't leave a half-written form
const isFormPage = (pathname: string) => {
  const lastSegment = pathname.split('/').filter(Boolean).at(-1);

  return lastSegment === 'create' || lastSegment === 'edit';
};

const TabBar = ({
  links,
  className,
  tabClassName,
  activeTabClassName,
}: {
  links: NavLink[];
  className: string;
  tabClassName: string;
  activeTabClassName: string;
}) => {
  const pathname = usePathname();

  if (isFormPage(pathname)) {
    return null;
  }

  return (
    <nav className={className}>
      <NavLinks
        links={links}
        linkClassName={tabClassName}
        activeClassName={activeTabClassName}
      />
    </nav>
  );
};

export default TabBar;
