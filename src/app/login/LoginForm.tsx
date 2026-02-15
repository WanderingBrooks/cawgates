'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import { login, type ActionResult } from '@/app/actions/auth';
import {
  Button,
  ErrorMessage,
  Input,
  SpaceChildrenVertically,
} from '@/components';
import Link from 'next/link';

/**
 * SubmitButton must be a separate component because useFormStatus() requires
 * being called from within a <form> context (as a child of the form element).
 * It cannot be called directly in LoginForm since that component renders the form itself.
 */
const SubmitButton = () => {
  const { pending } = useFormStatus();
  const t = useTranslations('login');

  return (
    <Button type="submit" disabled={pending} variant="primary">
      {pending ? t('submitting') : t('submit')}
    </Button>
  );
};

const LoginForm = () => {
  const t = useTranslations('login');

  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    login,
    null,
  );

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form action={formAction}>
      <SpaceChildrenVertically>
        <Input
          type="email"
          id="email"
          name="email"
          label={t('email')}
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
        <Input
          type="password"
          id="password"
          name="password"
          label={t('password')}
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />
        {state?.error && <ErrorMessage error={state.error} />}
        <SubmitButton />
        <Link href="/register">{t('clickHereToRegister')}</Link>
      </SpaceChildrenVertically>
    </form>
  );
};

export default LoginForm;
