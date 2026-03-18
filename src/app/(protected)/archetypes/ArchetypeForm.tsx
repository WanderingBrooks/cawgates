'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import { createArchetype, updateArchetype, type ArchetypeActionResult } from '@/app/actions/archetypes';
import { Button, ErrorMessage, Input, SpaceChildrenVertically, FlexRowBetween } from '@/components';
import Link from 'next/link';

const SubmitButton = ({ mode }: { mode: 'create' | 'edit' }) => {
  const { pending } = useFormStatus();
  const t = useTranslations('archetypeForm');

  return (
    <Button type="submit" disabled={pending} variant="primary">
      {pending ? t('saving') : mode === 'create' ? t('create') : t('save')}
    </Button>
  );
};

type ArchetypeFormProps =
  | { mode: 'create' }
  | { mode: 'edit'; archetypeId: string; initialName: string };

const ArchetypeForm = (props: ArchetypeFormProps) => {
  const t = useTranslations('archetypeForm');
  const action = props.mode === 'create' ? createArchetype : updateArchetype;

  const [state, formAction] = useActionState<ArchetypeActionResult | null, FormData>(
    action,
    null,
  );

  const cancelHref =
    props.mode === 'create' ? '/archetypes' : `/archetypes/${props.archetypeId}`;

  return (
    <form action={formAction}>
      <SpaceChildrenVertically>
        {props.mode === 'edit' && (
          <input type="hidden" name="archetypeId" value={props.archetypeId} />
        )}
        <Input
          type="text"
          id="name"
          name="name"
          label={t('name')}
          defaultValue={props.mode === 'edit' ? props.initialName : ''}
          required
        />
        {state?.error && <ErrorMessage error={state.error} />}
        <FlexRowBetween>
          <Link href={cancelHref}>
            <Button variant="secondary">{t('cancel')}</Button>
          </Link>
          <SubmitButton mode={props.mode} />
        </FlexRowBetween>
      </SpaceChildrenVertically>
    </form>
  );
};

export default ArchetypeForm;
