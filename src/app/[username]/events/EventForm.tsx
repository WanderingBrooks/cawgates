'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import { createEvent, updateEvent } from '@/app/actions/events';
import { type ActionResult } from '@/lib/types';
import {
  Button,
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

  const { mode, username } = props;

  const action = mode === 'create' ? createEvent : updateEvent;

  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    action,
    null,
  );

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
        <FlexRowBetween>
          <Link
            href={
              mode === 'create'
                ? `/${username}/events`
                : `/${username}/events/${props.eventId}`
            }
          >
            <Button variant="secondary">{t('cancel')}</Button>
          </Link>
          <SubmitButton />
        </FlexRowBetween>
      </SpaceChildrenVertically>
    </Form>
  );
};

export default EventForm;
