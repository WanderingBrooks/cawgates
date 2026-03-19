'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import {
  createArchetype,
  updateArchetype,
  type ArchetypeActionResult,
} from '@/app/actions/archetypes';
import {
  Button,
  ErrorMessage,
  Input,
  SpaceChildrenVertically,
  FlexRowBetween,
} from '@/components';
import Link from 'next/link';
import DeleteArchetypeButton from './DeleteArchetypeButton';
import classes from './archetypeForm.module.css';

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
  | {
      mode: 'edit';
      archetypeId: string;
      archetypeSlug: string;
      initialName: string;
      initialSlug: string;
    };

const deriveSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const ArchetypeForm = (props: ArchetypeFormProps) => {
  const t = useTranslations('archetypeForm');
  const action = props.mode === 'create' ? createArchetype : updateArchetype;

  const [state, formAction] = useActionState<
    ArchetypeActionResult | null,
    FormData
  >(action, null);

  const [name, setName] = useState(
    props.mode === 'edit' ? props.initialName : '',
  );

  const [slug, setSlug] = useState(
    props.mode === 'edit' ? props.initialSlug : '',
  );

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const cancelHref =
    props.mode === 'create'
      ? '/archetypes'
      : `/archetypes/${props.archetypeSlug}`;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);

    if (!slugManuallyEdited) {
      setSlug(deriveSlug(e.target.value));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true);
    setSlug(e.target.value);
  };

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
          value={name}
          onChange={handleNameChange}
          required
        />
        <Input
          type="text"
          id="slug"
          name="slug"
          label={t('slug')}
          hint={t('slugHint')}
          value={slug}
          onChange={handleSlugChange}
        />
        {state?.error && <ErrorMessage error={state.error} />}
        <FlexRowBetween>
          {props.mode === 'edit' ? (
            <>
              <DeleteArchetypeButton archetypeId={props.archetypeId} />
              <div className={classes.rightButtons}>
                <Link href={cancelHref}>
                  <Button variant="secondary">{t('cancel')}</Button>
                </Link>
                <SubmitButton mode={props.mode} />
              </div>
            </>
          ) : (
            <>
              <Link href={cancelHref}>
                <Button variant="secondary">{t('cancel')}</Button>
              </Link>
              <SubmitButton mode={props.mode} />
            </>
          )}
        </FlexRowBetween>
      </SpaceChildrenVertically>
    </form>
  );
};

export default ArchetypeForm;
