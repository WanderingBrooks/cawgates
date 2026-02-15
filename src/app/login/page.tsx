import { getTranslations } from 'next-intl/server';
import { Page, PageTitle } from '@/components';
import LoginForm from './LoginForm';

const LoginPage = async () => {
  const t = await getTranslations('login');

  return (
    <Page>
      <PageTitle>
        <h1>{t('title')}</h1>
      </PageTitle>
      <LoginForm />
    </Page>
  );
};

export default LoginPage;
