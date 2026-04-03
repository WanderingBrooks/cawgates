'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import { createMatch, updateMatch } from '@/app/actions/matches';
import { type ActionResult } from '@/lib/types';
import {
  Button,
  ErrorMessage,
  Form,
  Input,
  SpaceChildrenVertically,
  OpponentArchetypeSelect,
} from '@/components';
import { MatchInputForm } from '@/lib/types';

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
  archetypeId: string;
  eventId: string;
  matchId?: string;
  initialMatchData?: MatchInputForm;
  onSuccess: () => void;
  onCancel: () => void;
};

const MatchForm = ({
  mode,
  archetypeId,
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
    },
  );

  useEffect(() => {
    if (state?.success) {
      onSuccess();
    }
  }, [state, onSuccess]);

  const handleOpponentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMatchData(prev => ({ ...prev, opponentArchetypeId: e.target.value }));
  };

  const handleNumberChange = ({
    name,
    value,
  }: {
    name: string;
    value: string;
  }) => {
    setMatchData(prev => ({
      ...prev,
      [name]: value === '' ? '' : parseInt(value, 10) || 0,
    }));
  };

  return (
    <Form action={formAction}>
      <SpaceChildrenVertically>
        <input type="hidden" name="eventId" value={eventId} />
        <input type="hidden" name="archetypeId" value={archetypeId} />
        {matchId && <input type="hidden" name="matchId" value={matchId} />}

        <OpponentArchetypeSelect
          archetypeId={archetypeId}
          id="opponentArchetypeId"
          name="opponentArchetypeId"
          label={t('opponentArchetype')}
          value={matchData.opponentArchetypeId}
          onChange={handleOpponentChange}
          required
        />
        <Input
          type="number"
          id="wins"
          name="wins"
          label={t('wins')}
          value={matchData.wins}
          onChange={e =>
            handleNumberChange({ name: 'wins', value: e.target.value })
          }
          required
        />
        <Input
          type="number"
          id="losses"
          name="losses"
          label={t('losses')}
          value={matchData.losses}
          onChange={e =>
            handleNumberChange({ name: 'losses', value: e.target.value })
          }
          required
        />

        {state?.error && <ErrorMessage error={state.error} />}
        <Button variant="secondary" type="button" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <SubmitButton />
      </SpaceChildrenVertically>
    </Form>
  );
};

export default MatchForm;
