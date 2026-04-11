import { redirect } from 'next/navigation';
import { getUser } from '@/lib/session';

/**
 * Handles the root `/` path only — redirects logged-in users to their profile
 * and unauthenticated users to the login page.
 *
 * This is NOT a global auth guard. Unauthenticated users can still access
 * `/[username]/...` routes directly; guest access to public profiles is
 * intentional and enforced per-page in the DAL via the `isPublic` flag.
 */
const RootPage = async () => {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  redirect(`/${user.username}`);
};

export default RootPage;
