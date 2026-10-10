'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import { createDeck, updateDeck } from '@/app/actions/decks';
import { type ActionResult } from '@/lib/types';
import Button from '../Button';
import ErrorMessage from '../ErrorMessage';
import Form from '../Form';
import Input from '../Input';
import SpaceChildrenVertically from '../SpaceChildrenVertically';
import FlexRowBetween from '../FlexRowBetween';
import FormatSelect from '../FormatSelect';
import Link from 'next/link';
import DeleteDeckButton from './DeleteDeckButton';
import classes from './deckForm.module.css';
import { slugify } from '@/lib/utils';

const SubmitButton = ({
  mode,
  isActionPending,
}: {
  mode: 'create' | 'edit';
  isActionPending: boolean;
}) => {
  const { pending: isFormPending } = useFormStatus();
  const t = useTranslations('deckForm');

  // Saving while either the form or the action reports pending. The action's
  // isPending is the one that matters: the format dialog renders its own
  // <form> inside this one (via a portal), and once that inner form has been
  // submitted useFormStatus here stops reporting pending, which left the
  // button clickable mid-request and allowed duplicate submits.
  const isSaving = isFormPending || isActionPending;

  let label = mode === 'create' ? t('create') : t('save');

  if (isSaving) {
    label = t('saving');
  }

  return (
    <Button type="submit" disabled={isSaving} variant="primary">
      {label}
    </Button>
  );
};

type DeckFormProps =
  | { mode: 'create'; username: string }
  | {
      mode: 'edit';
      username: string;
      deckId: string;
      deckSlug: string;
      initialDeckData: {
        name: string;
        slug: string;
        isPublic: boolean;
        formatId: string;
      };
      isFormatLocked: boolean;
    };

const DeckForm = (props: DeckFormProps) => {
  const t = useTranslations('deckForm');
  const action = props.mode === 'create' ? createDeck : updateDeck;

  const [state, formAction, isPending] = useActionState<
    ActionResult | null,
    FormData
  >(action, null);

  const [name, setName] = useState(
    props.mode === 'edit' ? props.initialDeckData.name : '',
  );

  const [slug, setSlug] = useState(
    props.mode === 'edit' ? props.initialDeckData.slug : '',
  );

  const [isPublic, setIsPublic] = useState(
    props.mode === 'edit' ? props.initialDeckData.isPublic : false,
  );

  const [formatId, setFormatId] = useState(
    props.mode === 'edit' ? props.initialDeckData.formatId : '',
  );

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const isFormatLocked = props.mode === 'edit' && props.isFormatLocked;

  const cancelHref =
    props.mode === 'create'
      ? `/${props.username}`
      : `/${props.username}/${props.deckSlug}`;

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
          <input type="hidden" name="deckId" value={props.deckId} />
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
        <FormatSelect
          id="formatId"
          name="formatId"
          label={t('format')}
          hint={isFormatLocked ? t('formatLockedHint') : undefined}
          value={formatId}
          onChange={setFormatId}
          isLocked={isFormatLocked}
          required
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
              <DeleteDeckButton deckId={props.deckId} />
              <div className={classes.rightButtons}>
                <Link href={cancelHref}>
                  <Button variant="secondary">{t('cancel')}</Button>
                </Link>
                <SubmitButton mode={props.mode} isActionPending={isPending} />
              </div>
            </>
          ) : (
            <>
              <Link href={cancelHref}>
                <Button variant="secondary">{t('cancel')}</Button>
              </Link>
              <SubmitButton mode={props.mode} isActionPending={isPending} />
            </>
          )}
        </FlexRowBetween>
      </SpaceChildrenVertically>
    </Form>
  );
};

export default DeckForm;
