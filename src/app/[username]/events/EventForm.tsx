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

type CreateEventFormProps = {
  mode: 'create';
  username: string;
  archetypes: Array<{ id: string; name: string }>;
};

type EditEventFormProps = {
  mode: 'edit';
  username: string;
  archetypeId: string;
  eventId: string;
  initialEventData: EventFormData;
};

type EventFormProps = CreateEventFormProps | EditEventFormProps;

const EventForm = (props: EventFormProps) => {
  const t = useTranslations('eventForm');

  const action = props.mode === 'create' ? createEvent : updateEvent;

  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    action,
    null,
  );

  const initialData: EventFormData =
    props.mode === 'edit'
      ? props.initialEventData
      : { eventName: '', eventDate: '', notes: '' };

  const [eventData, setEventData] = useState<EventFormData>(initialData);

  const handleEventChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const cancelHref =
    props.mode === 'create'
      ? `/${props.username}/events`
      : `/${props.username}/events/${props.eventId}`;

  return (
    <Form action={formAction}>
      <SpaceChildrenVertically>
        {props.mode === 'edit' ? (
          <input type="hidden" name="archetypeId" value={props.archetypeId} />
        ) : (
          <div>
            <label htmlFor="archetypeId">{t('archetype')}</label>
            <select
              id="archetypeId"
              name="archetypeId"
              defaultValue=""
              required
            >
              <option value="" disabled>
                {t('selectArchetype')}
              </option>
              {props.archetypes.map(archetype => (
                <option key={archetype.id} value={archetype.id}>
                  {archetype.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {props.mode === 'edit' && (
          <input type="hidden" name="eventId" value={props.eventId} />
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
          <Link href={cancelHref}>
            <Button variant="secondary">{t('cancel')}</Button>
          </Link>
          <SubmitButton />
        </FlexRowBetween>
      </SpaceChildrenVertically>
    </Form>
  );
};

export default EventForm;
