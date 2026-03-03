import { redirect } from 'next/navigation';
import { getUser } from '@/lib/session';

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return <>{children}</>;
};

export default ProtectedLayout;
