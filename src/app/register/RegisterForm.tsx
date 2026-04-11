'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import { registerUser, type ActionResult } from '@/app/actions/users';
import {
  Button,
  ErrorMessage,
  Form,
  Input,
  SpaceChildrenVertically,
} from '@/components';

/**
 * SubmitButton must be a separate component because useFormStatus() requires
 * being called from within a <form> context (as a child of the form element).
 * It cannot be called directly in RegisterForm since that component renders the form itself.
 */
const SubmitButton = () => {
  const { pending } = useFormStatus();
  const t = useTranslations('register');

  return (
    <Button type="submit" disabled={pending} variant="primary">
      {pending ? t('submitting') : t('submit')}
    </Button>
  );
};

const RegisterForm = () => {
  const t = useTranslations('register');

  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    registerUser,
    null,
  );

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Form action={formAction}>
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
          type="text"
          id="username"
          name="username"
          label={t('username')}
          hint={t('usernameHint')}
          value={formData.username}
          onChange={handleChange}
          required
          autoComplete="username"
        />
        <Input
          type="password"
          id="password"
          name="password"
          label={t('password')}
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          label={t('confirmPassword')}
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />
        {state?.error && <ErrorMessage error={state.error} />}
        <SubmitButton />
      </SpaceChildrenVertically>
    </Form>
  );
};

export default RegisterForm;
