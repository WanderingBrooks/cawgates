import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { cn } from '@/lib/utils';
import Button from '../Button';
import LogoutButton from './LogoutButton';
import NavLinks, { type NavLink } from './NavLinks';
import classes from './siteHeader.module.css';

type SiteHeaderProps = {
  // The user whose pages are being shown. Omitted on pages that don't
  // belong to anyone (login, register), which then show only the app name.
  ownerUsername?: string;
  isOwner?: boolean;
  // The owner's formats that the viewer can see
  formats?: { id: string; name: string }[];
  viewerUsername: string | null;
};

/**
 * App-wide header: the app name, navigation for the profile being viewed,
 * and the viewer's account actions. On phones the navigation moves to a
 * tab bar fixed to the bottom of the screen.
 *
 * When someone views another user's profile the links point at that
 * user's events and formats. The strip under the header says whose profile
 * it is, with a way back to the viewer's own events or a prompt to sign up.
 *
 * With a single format the link is named after it and opens it directly,
 * otherwise it's "Formats" and opens the most played one.
 */
const SiteHeader = async ({
  ownerUsername,
  isOwner = false,
  formats = [],
  viewerUsername,
}: SiteHeaderProps) => {
  const t = await getTranslations('siteHeader');
  const tGuest = await getTranslations('guestBanner');

  const links: NavLink[] = ownerUsername
    ? [
        {
          href: `/${ownerUsername}/events`,
          label: t('events'),
          section: 'events',
        },
        // Guests without a visible format would only reach a 404
        ...(isOwner || formats.length > 0
          ? [
              formats.length === 1
                ? {
                    href: `/${ownerUsername}/matchups/${formats[0].id}`,
                    label: formats[0].name,
                    section: 'matchups' as const,
                  }
                : {
                    href: `/${ownerUsername}/matchups`,
                    label: t('matchups'),
                    section: 'matchups' as const,
                  },
            ]
          : []),
      ]
    : [];

  const homeHref = viewerUsername ? `/${viewerUsername}/events` : '/';
  const isViewingOtherProfile = !!ownerUsername && !isOwner;

  return (
    <>
      <header className={classes.header}>
        <div className={classes.bar}>
          <div className={classes.left}>
            <Link href={homeHref} className={cn('text-bold', classes.appName)}>
              {t('appName')}
            </Link>
            {links.length > 0 && (
              <nav className={classes.nav}>
                <NavLinks
                  links={links}
                  linkClassName={classes.navLink}
                  activeClassName={cn('text-strong', classes.navLinkActive)}
                />
              </nav>
            )}
          </div>
          <div className={classes.account}>
            {viewerUsername && (
              <>
                <span className={classes.username}>{viewerUsername}</span>
                <LogoutButton />
              </>
            )}
            {!viewerUsername && isViewingOtherProfile && (
              <>
                <Link href="/login">
                  <Button variant="secondary">{t('login')}</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary">{t('register')}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
        {isViewingOtherProfile && (
          <div className={classes.strip}>
            <p className={cn('text-small', classes.stripText)}>
              {viewerUsername
                ? tGuest.rich('viewingSignedIn', {
                    username: ownerUsername,
                    back: chunks => (
                      <Link href={`/${viewerUsername}/events`}>{chunks}</Link>
                    ),
                  })
                : tGuest.rich('viewingSignedOut', {
                    username: ownerUsername,
                    login: chunks => <Link href="/login">{chunks}</Link>,
                    register: chunks => <Link href="/register">{chunks}</Link>,
                  })}
            </p>
          </div>
        )}
      </header>
      {links.length > 0 && (
        <nav className={classes.tabBar}>
          <NavLinks
            links={links}
            linkClassName={cn('text-small', classes.tab)}
            activeClassName={cn('text-strong', classes.tabActive)}
          />
        </nav>
      )}
    </>
  );
};

export default SiteHeader;
