'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import { createArchetype, type ArchetypeActionResult } from '@/app/actions/archetypes';
import { Button, ErrorMessage, Input, SpaceChildrenVertically, FlexRowBetween } from '@/components';
import Link from 'next/link';

const SubmitButton = () => {
  const { pending } = useFormStatus();
  const t = useTranslations('createArchetype');

  return (
    <Button type="submit" disabled={pending} variant="primary">
      {pending ? t('saving') : t('save')}
    </Button>
  );
};

const CreateArchetypeForm = () => {
  const t = useTranslations('createArchetype');
  const [state, formAction] = useActionState<ArchetypeActionResult | null, FormData>(
    createArchetype,
    null,
  );

  return (
    <form action={formAction}>
      <SpaceChildrenVertically>
        <Input
          type="text"
          id="name"
          name="name"
          label={t('name')}
          required
        />
        {state?.error && <ErrorMessage error={state.error} />}
        <FlexRowBetween>
          <Link href="/archetypes">
            <Button variant="secondary">{t('cancel')}</Button>
          </Link>
          <SubmitButton />
        </FlexRowBetween>
      </SpaceChildrenVertically>
    </form>
  );
};

export default CreateArchetypeForm;
