import { getTranslations } from 'next-intl/server';
import { Page, PageTitle } from '@/components';
import LoginForm from './LoginForm';

const LoginPage = async () => {
  const t = await getTranslations('login');

  return (
    <Page>
      <PageTitle title={t('title')} />
      <LoginForm />
    </Page>
  );
};

export default LoginPage;
