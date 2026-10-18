'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { createMatch, deleteMatch, updateMatch } from '@/app/actions/matches';
import { type ActionResult, MatchInputForm } from '@/lib/types';
import {
  Button,
  DeleteButton,
  DiscardChangesConfirm,
  ErrorMessage,
  Form,
  FormActions,
  Input,
  SpaceChildrenVertically,
  OpponentArchetypeSelect,
  TextArea,
} from '@/components';
import { NOTES_ROWS } from '@/lib/utils';
import classes from './matchForm.module.css';

const SubmitButton = ({ isActionPending }: { isActionPending: boolean }) => {
  const { pending: isFormPending } = useFormStatus();
  const t = useTranslations('matchForm');

  // Saving while either the form or the action reports pending. The action's
  // isPending is the one that matters: the opponent archetype dialog renders
  // its own <form> inside this one (via a portal), and once that inner form
  // has been submitted useFormStatus here stops reporting pending, which left
  // Save clickable mid-request and allowed duplicate matches.
  const isSaving = isFormPending || isActionPending;

  return (
    <Button type="submit" disabled={isSaving} variant="primary">
      {isSaving ? t('saving') : t('saveMatch')}
    </Button>
  );
};

type CreateMatchProps = {
  mode: 'create';
};

type EditMatchProps = {
  mode: 'edit';
  matchId: string;
  initialMatchData: MatchInputForm;
};

type MatchFormProps = {
  username: string;
  deckId: string;
  eventId: string;
} & (CreateMatchProps | EditMatchProps);

// Saving, cancelling and deleting all go back to the event page
const MatchForm = (props: MatchFormProps) => {
  const t = useTranslations('matchForm');
  const tDelete = useTranslations('deleteMatchButton');
  const router = useRouter();

  const { mode, username, deckId, eventId } = props;

  const eventHref = `/${username}/events/${eventId}`;

  const action = mode === 'create' ? createMatch : updateMatch;

  const [state, formAction, isPending] = useActionState<
    ActionResult | null,
    FormData
  >(action, null);

  const [matchData, setMatchData] = useState<MatchInputForm>(
    props.mode === 'edit'
      ? props.initialMatchData
      : {
          opponentArchetypeId: '',
          wins: '',
          losses: '',
          notes: '',
        },
  );

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [hasFormDataChanged, setHasFormDataChanged] = useState(false);

  const handleCancel = () => {
    if (hasFormDataChanged) {
      setShowCancelConfirm(true);
    } else {
      router.push(eventHref);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value: givenValue } = e.target;

    let value: string | number = '';

    if (givenValue !== '' && (name === 'wins' || name === 'losses')) {
      value = parseInt(givenValue, 10) || 0;
    } else {
      value = givenValue;
    }

    setMatchData(prev => ({
      ...prev,
      [name]: value,
    }));

    setHasFormDataChanged(true);
  };

  return (
    <Form action={formAction}>
      <SpaceChildrenVertically>
        <input type="hidden" name="eventId" value={eventId} />
        {props.mode === 'edit' && (
          <input type="hidden" name="matchId" value={props.matchId} />
        )}

        <OpponentArchetypeSelect
          deckId={deckId}
          id="opponentArchetypeId"
          name="opponentArchetypeId"
          label={t('opponentArchetype')}
          value={matchData.opponentArchetypeId}
          onChange={handleChange}
          required
        />
        <div className={classes.recordRow}>
          <Input
            type="number"
            inputMode="numeric"
            id="wins"
            name="wins"
            label={t('wins')}
            value={matchData.wins}
            onChange={handleChange}
            className="text-number"
            required
          />
          <Input
            type="number"
            inputMode="numeric"
            id="losses"
            name="losses"
            label={t('losses')}
            value={matchData.losses}
            onChange={handleChange}
            className="text-number"
            required
          />
        </div>

        <TextArea
          id="notes"
          name="notes"
          label={t('notes')}
          value={matchData.notes ?? ''}
          onChange={handleChange}
          rows={NOTES_ROWS}
        />

        {state?.error && <ErrorMessage error={state.error} />}
        {showCancelConfirm ? (
          <DiscardChangesConfirm
            onKeepEditing={() => setShowCancelConfirm(false)}
            onDiscard={() => router.push(eventHref)}
          />
        ) : (
          <FormActions
            cancelButton={
              <Button variant="secondary" type="button" onClick={handleCancel}>
                {t('cancel')}
              </Button>
            }
            submitButton={<SubmitButton isActionPending={isPending} />}
            deleteButton={
              props.mode === 'edit' ? (
                <DeleteButton
                  label={tDelete('delete')}
                  confirmMessage={tDelete('deleteConfirm')}
                  onDelete={() => deleteMatch(props.matchId)}
                />
              ) : undefined
            }
          />
        )}
      </SpaceChildrenVertically>
    </Form>
  );
};

export default MatchForm;
