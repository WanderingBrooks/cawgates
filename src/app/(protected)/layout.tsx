import { redirect } from 'next/navigation';
import { getUser } from '@/lib/session';
import { Page } from '@/components';

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return <Page>{children}</Page>;
};

export default ProtectedLayout;
