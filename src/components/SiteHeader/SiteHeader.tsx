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
  viewerUsername: string | null;
};

/**
 * App-wide header: the app name, navigation for the profile being viewed,
 * and the viewer's account actions. On phones the navigation moves to a
 * tab bar fixed to the bottom of the screen.
 *
 * When someone views another user's profile the links point at that
 * user's events and decks (formats are owner-only), and a strip under the
 * header says whose profile it is, with a way back to the viewer's own
 * events or a prompt to sign up.
 */
const SiteHeader = async ({
  ownerUsername,
  isOwner = false,
  viewerUsername,
}: SiteHeaderProps) => {
  const t = await getTranslations('siteHeader');
  const tGuest = await getTranslations('guestBanner');

  let links: NavLink[] = [];

  if (ownerUsername && isOwner) {
    links = [
      {
        href: `/${ownerUsername}/events`,
        label: t('events'),
        section: 'events',
      },
      { href: `/${ownerUsername}/decks`, label: t('decks'), section: 'decks' },
      {
        href: `/${ownerUsername}/formats`,
        label: t('formats'),
        section: 'formats',
      },
    ];
  } else if (ownerUsername) {
    links = [
      {
        href: `/${ownerUsername}/events`,
        label: t('ownerEvents', { username: ownerUsername }),
        section: 'events',
      },
      {
        href: `/${ownerUsername}/decks`,
        label: t('ownerDecks', { username: ownerUsername }),
        section: 'decks',
      },
    ];
  }

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
              <nav aria-label={t('mainNavigation')} className={classes.nav}>
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
              {tGuest('viewing', { username: ownerUsername })}{' '}
              {viewerUsername ? (
                <Link href={`/${viewerUsername}/events`}>
                  {tGuest('backToMyEvents')}
                </Link>
              ) : (
                tGuest.rich('signUpPrompt', {
                  login: chunks => <Link href="/login">{chunks}</Link>,
                  register: chunks => <Link href="/register">{chunks}</Link>,
                })
              )}
            </p>
          </div>
        )}
      </header>
      {links.length > 0 && (
        <nav aria-label={t('mainNavigation')} className={classes.tabBar}>
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
