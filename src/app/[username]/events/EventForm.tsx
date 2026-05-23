'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { createEvent, updateEvent } from '@/app/actions/events';
import { type ActionResult } from '@/lib/types';
import {
  Button,
  DiscardChangesConfirm,
  ErrorMessage,
  Form,
  Input,
  SpaceChildrenVertically,
  FlexRowBetween,
  TextArea,
  Select,
} from '@/components';
import { EventFormData } from '@/lib/types';
import Link from 'next/link';

/**
 * SubmitButton must be a separate component because useFormStatus() requires
 * being called from within a <form> context (as a child of the form element).
 * It cannot be called directly in EventForm since that component renders the form itself.
 */
const SubmitButton = () => {
  const { pending } = useFormStatus();
  const t = useTranslations('eventForm');

  return (
    <Button type="submit" disabled={pending} variant="primary">
      {pending ? t('saving') : t('saveEvent')}
    </Button>
  );
};

type CreateEventProps = {
  mode: 'create';
  username: string;
  decks: { id: string; name: string }[];
};

type EditEventProps = {
  mode: 'edit';
  username: string;
  eventId: string;
  initialEventData: EventFormData;
};

type EventFormProps = CreateEventProps | EditEventProps;

const EventForm = (props: EventFormProps) => {
  const t = useTranslations('eventForm');
  const router = useRouter();

  const { mode, username } = props;

  const cancelHref =
    mode === 'create'
      ? `/${username}/events`
      : `/${username}/events/${props.eventId}`;

  const action = mode === 'create' ? createEvent : updateEvent;

  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    action,
    null,
  );

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [hasFormDataChanged, setHasFormDataChanged] = useState(false);

  const handleCancel = () => {
    if (hasFormDataChanged) {
      setShowCancelConfirm(true);
    } else {
      router.push(cancelHref);
    }
  };

  // Inline state management
  const [eventData, setEventData] = useState<EventFormData>(
    props.mode === 'edit'
      ? props.initialEventData
      : {
          deckId: '',
          eventName: '',
          eventDate: '',
          notes: '',
        },
  );

  const handleEventChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setEventData(prev => ({ ...prev, [name]: value }));
    setHasFormDataChanged(true);
  };

  return (
    <Form action={formAction}>
      <SpaceChildrenVertically>
        {props.mode === 'edit' && (
          <>
            <input type="hidden" name="eventId" value={props.eventId} />
            <input type="hidden" name="deckId" value={eventData.deckId} />
          </>
        )}
        {props.mode === 'create' && (
          <Select
            required
            id="deckId"
            name="deckId"
            label={t('deckId')}
            hint={t.rich('deckIdHint', {
              link: chunks => (
                <Link href={`/${username}/decks/create`}>{chunks}</Link>
              ),
            })}
            value={eventData.deckId}
            onChange={handleEventChange}
            options={[
              // Placeholder empty value
              { value: '', label: '' },
              ...props.decks.map(deck => ({
                value: deck.id,
                label: deck.name,
              })),
            ]}
          />
        )}
        <Input
          type="text"
          id="eventName"
          name="eventName"
          label={t('eventName')}
          value={eventData.eventName}
          onChange={handleEventChange}
          required
        />
        <Input
          type="date"
          id="eventDate"
          name="eventDate"
          label={t('eventDate')}
          value={eventData.eventDate}
          onChange={handleEventChange}
          required
        />
        <TextArea
          id="notes"
          name="notes"
          label={t('notes')}
          value={eventData.notes}
          onChange={handleEventChange}
          rows={25}
        />

        {state?.error && <ErrorMessage error={state.error} />}
        {showCancelConfirm ? (
          <DiscardChangesConfirm
            onKeepEditing={() => setShowCancelConfirm(false)}
            onDiscard={() => router.push(cancelHref)}
          />
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

export default EventForm;
