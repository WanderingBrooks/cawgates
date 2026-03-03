import { getTranslations } from 'next-intl/server';
import { PageTitle } from '@/components';
import RegisterForm from './RegisterForm';

const RegisterPage = async () => {
  const t = await getTranslations('register');

  return (
    <>
      <PageTitle title={t('title')} />
      <RegisterForm />
    </>
  );
};

export default RegisterPage;
