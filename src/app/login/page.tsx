import { getTranslations } from 'next-intl/server';
import { PageTitle } from '@/components';
import LoginForm from './LoginForm';

const LoginPage = async () => {
  const t = await getTranslations('login');

  return (
    <>
      <PageTitle title={t('title')} />
      <LoginForm />
    </>
  );
};

export default LoginPage;
