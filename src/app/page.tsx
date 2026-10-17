import { redirect } from 'next/navigation';
import { getUser } from '@/lib/session';

/**
 * Handles the root `/` path only — redirects logged-in users to their events
 * page and unauthenticated users to the login page.
 *
 * This is NOT a global auth guard. Unauthenticated users can still access
 * `/[username]/...` routes directly; guest access to profiles is
 * intentional, and the DAL keeps notes private to their owner.
 */
const RootPage = async () => {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  redirect(`/${user.username}/events`);
};

export default RootPage;
