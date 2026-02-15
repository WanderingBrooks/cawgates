import { getTranslations } from 'next-intl/server';
import { Page, PageTitle } from '@/components';
import RegisterForm from './RegisterForm';

const RegisterPage = async () => {
  const t = await getTranslations('register');

  return (
    <Page>
      <PageTitle title={t('title')} />
      <RegisterForm />
    </Page>
  );
};

export default RegisterPage;
