'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import {
  createOpponentArchetype,
  updateOpponentArchetype,
  type OpponentArchetypeActionResult,
} from '@/app/actions/opponentArchetypes';
import {
  Button,
  ErrorMessage,
  Input,
  SpaceChildrenVertically,
  FlexRowBetween,
} from '@/components';
import Link from 'next/link';
import DeleteOpponentArchetypeButton from './[opponentArchetypeSlug]/edit/DeleteOpponentArchetypeButton';
import classes from './opponentArchetypeForm.module.css';
import { slugify } from '@/lib/utils';

const SubmitButton = ({ mode }: { mode: 'create' | 'edit' }) => {
  const { pending } = useFormStatus();
  const t = useTranslations('opponentArchetypeForm');

  return (
    <Button type="submit" disabled={pending} variant="primary">
      {pending ? t('saving') : mode === 'create' ? t('create') : t('save')}
    </Button>
  );
};

type OpponentArchetypeFormProps =
  | { mode: 'create'; archetypeId: string; archetypeSlug: string }
  | {
      mode: 'edit';
      archetypeId: string;
      archetypeSlug: string;
      opponentArchetypeId: string;
      opponentArchetypeSlug: string;
      initialName: string;
      initialSlug: string;
    };

const OpponentArchetypeForm = (props: OpponentArchetypeFormProps) => {
  const t = useTranslations('opponentArchetypeForm');

  const action =
    props.mode === 'create' ? createOpponentArchetype : updateOpponentArchetype;

  const [state, formAction] = useActionState<
    OpponentArchetypeActionResult | null,
    FormData
  >(action, null);

  const [name, setName] = useState(
    props.mode === 'edit' ? props.initialName : '',
  );

  const [slug, setSlug] = useState(
    props.mode === 'edit' ? props.initialSlug : '',
  );

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const cancelHref = `/archetypes/${props.archetypeSlug}/opponent-archetypes`;

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
    <form action={formAction}>
      <SpaceChildrenVertically>
        <input type="hidden" name="archetypeId" value={props.archetypeId} />
        {props.mode === 'edit' && (
          <input
            type="hidden"
            name="opponentArchetypeId"
            value={props.opponentArchetypeId}
          />
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
              <DeleteOpponentArchetypeButton
                opponentArchetypeId={props.opponentArchetypeId}
              />
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

export default OpponentArchetypeForm;
