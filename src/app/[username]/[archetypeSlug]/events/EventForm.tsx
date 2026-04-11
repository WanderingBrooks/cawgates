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

type EventFormProps = {
  mode: 'create' | 'edit';
  username: string;
  archetypeId: string;
  archetypeSlug: string;
  eventId?: string;
  initialEventData?: EventFormData;
};

const EventForm = ({
  mode,
  username,
  archetypeId,
  archetypeSlug,
  eventId,
  initialEventData,
}: EventFormProps) => {
  const t = useTranslations('eventForm');

  const action = mode === 'create' ? createEvent : updateEvent;

  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    action,
    null,
  );

  // Inline state management
  const [eventData, setEventData] = useState<EventFormData>(
    initialEventData || {
      eventName: '',
      eventDate: '',
      notes: '',
    },
  );

  const handleEventChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Form action={formAction}>
      <SpaceChildrenVertically>
        <input type="hidden" name="archetypeId" value={archetypeId} />
        <input type="hidden" name="eventId" value={eventId} />

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
                ? `/${username}/${archetypeSlug}/events`
                : `/${username}/${archetypeSlug}/events/${eventId}`
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
