'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';

import { createFormat, updateFormat } from '@/app/actions/formats';
import { type ActionResultWithData } from '@/lib/types';
import Button from '../Button';
import ErrorMessage from '../ErrorMessage';
import Form from '../Form';
import Input from '../Input';
import SpaceChildrenVertically from '../SpaceChildrenVertically';
import FlexRowBetween from '../FlexRowBetween';
import classes from './formatForm.module.css';

const SubmitButton = ({ mode }: { mode: 'create' | 'edit' }) => {
  const { pending } = useFormStatus();
  const t = useTranslations('formatForm');

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

type FormatFormProps =
  | {
      mode: 'create';
      onSuccess: (data: { id: string; name: string }) => void;
      onCancel: () => void;
    }
  | {
      mode: 'edit';
      formatId: string;
      initialName: string;
      onSuccess: (data: { id: string; name: string }) => void;
      onCancel: () => void;
      // Shown on the left of the button row, the same as Delete deck in the
      // deck form, with an optional hint under the row
      deleteButton?: React.ReactNode;
      deleteHint?: string;
    };

const FormatForm = (props: FormatFormProps) => {
  const t = useTranslations('formatForm');

  const action = props.mode === 'create' ? createFormat : updateFormat;

  const [state, formAction] = useActionState<
    ActionResultWithData<{ id: string; name: string }> | null,
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
        {props.mode === 'edit' && (
          <input type="hidden" name="formatId" value={props.formatId} />
        )}
        <Input
          type="text"
          id="formatName"
          name="name"
          label={t('name')}
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        {state?.error && <ErrorMessage error={state.error} />}
        {props.mode === 'edit' && props.deleteButton ? (
          <>
            <FlexRowBetween>
              {props.deleteButton}
              <div className={classes.rightButtons}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={props.onCancel}
                >
                  {t('cancel')}
                </Button>
                <SubmitButton mode={props.mode} />
              </div>
            </FlexRowBetween>
            {props.deleteHint && <p className="hint">{props.deleteHint}</p>}
          </>
        ) : (
          <FlexRowBetween>
            <Button type="button" variant="secondary" onClick={props.onCancel}>
              {t('cancel')}
            </Button>
            <SubmitButton mode={props.mode} />
          </FlexRowBetween>
        )}
      </SpaceChildrenVertically>
    </Form>
  );
};

export default FormatForm;
