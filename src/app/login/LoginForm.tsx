'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import { login, type ActionResult } from '@/app/actions/auth';
import {
  Button,
  ErrorMessage,
  Input,
  SpaceChildrenVertically,
} from '@/components';

/**
 * SubmitButton must be a separate component because useFormStatus() requires
 * being called from within a <form> context (as a child of the form element).
 * It cannot be called directly in LoginForm since that component renders the form itself.
 */
const SubmitButton = () => {
  const { pending } = useFormStatus();
  const t = useTranslations('login');

  return (
    <Button type="submit" disabled={pending}>
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

  return (
    <form action={formAction}>
      <SpaceChildrenVertically>
        <Input
          type="email"
          id="email"
          name="email"
          label={t('email')}
          required
          autoComplete="email"
        />
        <Input
          type="password"
          id="password"
          name="password"
          label={t('password')}
          required
          autoComplete="current-password"
        />
        {state?.error && <ErrorMessage error={state.error} />}
        <SubmitButton />
      </SpaceChildrenVertically>
    </form>
  );
};

export default LoginForm;
