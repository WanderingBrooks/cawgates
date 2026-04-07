'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import { createArchetype, updateArchetype } from '@/app/actions/archetypes';
import { type ActionResult } from '@/lib/types';
import {
  Button,
  ErrorMessage,
  Form,
  Input,
  SpaceChildrenVertically,
  FlexRowBetween,
} from '@/components';
import Link from 'next/link';
import DeleteArchetypeButton from './DeleteArchetypeButton';
import classes from './archetypeForm.module.css';
import { slugify } from '@/lib/utils';

const SubmitButton = ({ mode }: { mode: 'create' | 'edit' }) => {
  const { pending } = useFormStatus();
  const t = useTranslations('archetypeForm');

  let label = mode === 'create' ? t('create') : t('save');

  if (pending) {
    label = t('saving');
  }

  return (
    <Button type="submit" disabled={pending} variant="primary">
      {label}
    </Button>
  );
};

type ArchetypeFormProps =
  | { mode: 'create'; username: string }
  | {
      mode: 'edit';
      username: string;
      archetypeId: string;
      archetypeSlug: string;
      initialArchetypeData: {
        name: string;
        slug: string;
        isPublic: boolean;
      };
    };

const ArchetypeForm = (props: ArchetypeFormProps) => {
  const t = useTranslations('archetypeForm');
  const action = props.mode === 'create' ? createArchetype : updateArchetype;

  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    action,
    null,
  );

  const [name, setName] = useState(
    props.mode === 'edit' ? props.initialArchetypeData.name : '',
  );

  const [slug, setSlug] = useState(
    props.mode === 'edit' ? props.initialArchetypeData.slug : '',
  );

  const [isPublic, setIsPublic] = useState(
    props.mode === 'edit' ? props.initialArchetypeData.isPublic : false,
  );

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const cancelHref =
    props.mode === 'create'
      ? `/${props.username}`
      : `/${props.username}/${props.archetypeSlug}`;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);

    if (!slugManuallyEdited) {
      setSlug(slugify({ name: e.target.value }));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true);
    setSlug(e.target.value);
  };

  return (
    <Form action={formAction}>
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
        <Input
          type="checkbox"
          id="isPublic"
          name="isPublic"
          label={t('isPublic')}
          hint={t('isPublicHint')}
          checked={isPublic}
          onChange={e => setIsPublic(e.target.checked)}
        />
        {state?.error && <ErrorMessage error={state.error} />}
        <FlexRowBetween className={classes.actionRow}>
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
    </Form>
  );
};

export default ArchetypeForm;
