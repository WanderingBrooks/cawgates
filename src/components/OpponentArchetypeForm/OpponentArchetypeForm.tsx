'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';

import {
  createOpponentArchetype,
  updateOpponentArchetype,
} from '@/app/actions/opponentArchetypes';
import { type OpponentArchetypeActionResult } from '@/lib/types';
import {
  Button,
  ErrorMessage,
  Form,
  Input,
  SpaceChildrenVertically,
  FlexRowBetween,
} from '@/components';

const SubmitButton = ({ mode }: { mode: 'create' | 'edit' }) => {
  const { pending } = useFormStatus();
  const t = useTranslations('opponentArchetypeForm');

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

type OpponentArchetypeFormProps =
  | {
      mode: 'create';
      archetypeId: string;
      onSuccess: (data: { id: string; name: string }) => void;
      onCancel: () => void;
    }
  | {
      mode: 'edit';
      archetypeId: string;
      opponentArchetypeId: string;
      initialName: string;
      onSuccess: (data: { id: string; name: string }) => void;
      onCancel: () => void;
    };

const OpponentArchetypeForm = (props: OpponentArchetypeFormProps) => {
  const t = useTranslations('opponentArchetypeForm');

  const action =
    props.mode === 'create' ? createOpponentArchetype : updateOpponentArchetype;

  const [state, formAction] = useActionState<
    OpponentArchetypeActionResult | null,
    FormData
  >(action, null);

  useEffect(() => {
    if (state?.success && state.data) {
      props.onSuccess(state.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const [name, setName] = useState(
    props.mode === 'edit' ? props.initialName : '',
  );

  return (
    <Form action={formAction}>
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
          onChange={e => setName(e.target.value)}
          required
        />
        {state?.error && <ErrorMessage error={state.error} />}
        <FlexRowBetween>
          <Button type="button" variant="secondary" onClick={props.onCancel}>
            {t('cancel')}
          </Button>
          <SubmitButton mode={props.mode} />
        </FlexRowBetween>
      </SpaceChildrenVertically>
    </Form>
  );
};

export default OpponentArchetypeForm;
