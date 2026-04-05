import { redirect } from 'next/navigation';
import { getUser } from '@/lib/session';

const RootPage = async () => {
  const user = await getUser();
  redirect(`/${user!.username}`);
};

export default RootPage;
