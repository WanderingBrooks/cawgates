'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classes from './breadcrumb.module.css';

const Breadcrumb = () => {
  const pathname = usePathname();

  const pathSegments = pathname.split('/').filter(Boolean);
  const segments = ['/', ...pathSegments];

  const breadcrumbs = segments.map((segment, index) => {
    const isLast = index === segments.length - 1;

    const href =
      index === 0 ? '/' : '/' + pathSegments.slice(0, index).join('/');

    const label = segment === '/' ? '/' : `${segment}/`;

    return {
      href,
      label,
      isLast,
    };
  });

  return (
    <nav className={classes.breadcrumbs}>
      {breadcrumbs.map(crumb => (
        <span key={crumb.href} className={classes.breadcrumbItem}>
          {crumb.isLast ? (
            <span className={classes.breadcrumbCurrent}>{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className={classes.breadcrumbLink}>
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;
