'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import { createMatch, updateMatch } from '@/app/actions/matches';
import { type ActionResult, MatchInputForm } from '@/lib/types';
import {
  Button,
  ErrorMessage,
  FlexRowBetween,
  Form,
  Input,
  SpaceChildrenVertically,
  OpponentArchetypeSelect,
  TextArea,
} from '@/components';

const SubmitButton = () => {
  const { pending } = useFormStatus();
  const t = useTranslations('matchForm');

  return (
    <Button type="submit" disabled={pending} variant="primary">
      {pending ? t('saving') : t('saveMatch')}
    </Button>
  );
};

type MatchFormProps = {
  mode: 'create' | 'edit';
  deckId: string;
  eventId: string;
  matchId?: string;
  initialMatchData?: MatchInputForm;
  onSuccess: () => void;
  onCancel: () => void;
};

const MatchForm = ({
  mode,
  deckId,
  eventId,
  matchId,
  initialMatchData,
  onSuccess,
  onCancel,
}: MatchFormProps) => {
  const t = useTranslations('matchForm');

  const action = mode === 'create' ? createMatch : updateMatch;

  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    action,
    null,
  );

  const [matchData, setMatchData] = useState<MatchInputForm>(
    initialMatchData || {
      opponentArchetypeId: '',
      wins: '',
      losses: '',
      notes: '',
    },
  );

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const isDirty = initialMatchData
    ? Object.keys(initialMatchData).some(
        key =>
          matchData[key as keyof MatchInputForm] !==
          initialMatchData[key as keyof MatchInputForm],
      )
    : Object.values(matchData).some(v => v !== '');

  const handleCancel = () => {
    if (isDirty) {
      setShowCancelConfirm(true);
    } else {
      onCancel();
    }
  };

  useEffect(() => {
    if (state?.success) {
      onSuccess();
    }
  }, [state, onSuccess]);

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
  };

  return (
    <Form action={formAction}>
      <SpaceChildrenVertically>
        <input type="hidden" name="eventId" value={eventId} />
        {matchId && <input type="hidden" name="matchId" value={matchId} />}

        <OpponentArchetypeSelect
          deckId={deckId}
          id="opponentArchetypeId"
          name="opponentArchetypeId"
          label={t('opponentArchetype')}
          value={matchData.opponentArchetypeId}
          onChange={handleChange}
          required
        />
        <Input
          type="number"
          id="wins"
          name="wins"
          label={t('wins')}
          value={matchData.wins}
          onChange={handleChange}
          required
        />
        <Input
          type="number"
          id="losses"
          name="losses"
          label={t('losses')}
          value={matchData.losses}
          onChange={handleChange}
          required
        />

        <TextArea
          id="notes"
          name="notes"
          label={t('notes')}
          value={matchData.notes ?? ''}
          onChange={handleChange}
          rows={15}
        />

        {state?.error && <ErrorMessage error={state.error} />}
        {showCancelConfirm ? (
          <SpaceChildrenVertically>
            <span>{t('discardChanges')}</span>
            <FlexRowBetween>
              <Button
                variant="secondary"
                type="button"
                onClick={() => setShowCancelConfirm(false)}
              >
                {t('keepEditing')}
              </Button>
              <Button variant="danger" type="button" onClick={onCancel}>
                {t('discard')}
              </Button>
            </FlexRowBetween>
          </SpaceChildrenVertically>
        ) : (
          <FlexRowBetween>
            <Button variant="secondary" type="button" onClick={handleCancel}>
              {t('cancel')}
            </Button>
            <SubmitButton />
          </FlexRowBetween>
        )}
      </SpaceChildrenVertically>
    </Form>
  );
};

export default MatchForm;
