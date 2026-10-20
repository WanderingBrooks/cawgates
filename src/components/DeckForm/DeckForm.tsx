'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import { createDeck, deleteDeck, updateDeck } from '@/app/actions/decks';
import { type ActionResultWithData, type SavedDeck } from '@/lib/types';
import Button from '../Button';
import DeleteButton from '../DeleteButton';
import ErrorMessage from '../ErrorMessage';
import Form from '../Form';
import Input from '../Input';
import SpaceChildrenVertically from '../SpaceChildrenVertically';
import FormActions from '../FormActions';
import FormatSelect from '../FormatSelect';
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

// Shown in a dialog, so whoever opens it closes it and navigates
type DeckFormCallbacks = {
  onSuccess: (deck: SavedDeck) => void;
  onCancel: () => void;
};

type DeckFormProps = DeckFormCallbacks &
  (
    | {
        mode: 'create';
        // Preselected when adding a deck from a format's Matchups page
        initialFormatId?: string;
      }
    | {
        mode: 'edit';
        deckId: string;
        initialDeckData: {
          name: string;
          slug: string;
          formatId: string;
        };
        isFormatLocked: boolean;
        onDeleted: () => void;
      }
  );

const DeckForm = (props: DeckFormProps) => {
  const t = useTranslations('deckForm');
  const tDelete = useTranslations('deleteDeckButton');
  const action = props.mode === 'create' ? createDeck : updateDeck;

  const [state, formAction, isPending] = useActionState<
    ActionResultWithData<SavedDeck> | null,
    FormData
  >(action, null);

  useEffect(() => {
    if (state?.success) {
      props.onSuccess(state.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const [name, setName] = useState(
    props.mode === 'edit' ? props.initialDeckData.name : '',
  );

  const [slug, setSlug] = useState(
    props.mode === 'edit' ? props.initialDeckData.slug : '',
  );

  const [formatId, setFormatId] = useState(
    props.mode === 'edit'
      ? props.initialDeckData.formatId
      : (props.initialFormatId ?? ''),
  );

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const isFormatLocked = props.mode === 'edit' && props.isFormatLocked;

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
        {state?.error && <ErrorMessage error={state.error} />}
        <FormActions
          cancelButton={
            <Button type="button" variant="secondary" onClick={props.onCancel}>
              {t('cancel')}
            </Button>
          }
          submitButton={
            <SubmitButton mode={props.mode} isActionPending={isPending} />
          }
          deleteButton={
            props.mode === 'edit' ? (
              <DeleteButton
                label={tDelete('delete')}
                confirmMessage={tDelete('deleteConfirm')}
                onDelete={async () => {
                  const result = await deleteDeck(props.deckId);

                  if (result.success) {
                    props.onDeleted();
                  }

                  return result;
                }}
              />
            ) : undefined
          }
        />
      </SpaceChildrenVertically>
    </Form>
  );
};

export default DeckForm;
