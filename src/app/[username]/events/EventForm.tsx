'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { createEvent, deleteEvent, updateEvent } from '@/app/actions/events';
import { type ActionResult, type SavedDeck } from '@/lib/types';
import {
  Button,
  DeckForm,
  DeleteButton,
  Dialog,
  DiscardChangesConfirm,
  ErrorMessage,
  Form,
  Input,
  SpaceChildrenVertically,
  FormActions,
  TextArea,
  Select,
} from '@/components';
import { EventFormData } from '@/lib/types';
import classes from './eventForm.module.css';

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
  const tDelete = useTranslations('deleteEventButton');
  const tCreateDeck = useTranslations('createDeck');
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

  // Grows when a deck is added from here, so it can be selected straight away
  const [decks, setDecks] = useState(
    props.mode === 'create' ? props.decks : [],
  );

  const [isAddDeckOpen, setIsAddDeckOpen] = useState(false);

  const handleDeckCreated = (deck: SavedDeck) => {
    setDecks(prev => [...prev, { id: deck.id, name: deck.name }]);
    setEventData(prev => ({ ...prev, deckId: deck.id }));
    setHasFormDataChanged(true);
    setIsAddDeckOpen(false);
  };

  return (
    <>
      <Form action={formAction}>
        <SpaceChildrenVertically>
          {props.mode === 'edit' && (
            <>
              <input type="hidden" name="eventId" value={props.eventId} />
              <input type="hidden" name="deckId" value={eventData.deckId} />
            </>
          )}
          {props.mode === 'create' && (
            <div className={classes.deckRow}>
              <Select
                required
                id="deckId"
                name="deckId"
                label={t('deckId')}
                value={eventData.deckId}
                onChange={handleEventChange}
                // Until the first deck is added, + Add deck is the only step
                disabled={decks.length === 0}
                options={[
                  // Placeholder empty value
                  { value: '', label: decks.length === 0 ? t('noDecks') : '' },
                  ...decks.map(deck => ({
                    value: deck.id,
                    label: deck.name,
                  })),
                ]}
              />
              <Button
                type="button"
                variant={decks.length === 0 ? 'primary' : 'secondary'}
                onClick={() => setIsAddDeckOpen(true)}
              >
                {t('addDeck')}
              </Button>
            </div>
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
            <FormActions
              cancelButton={
                <Button
                  variant="secondary"
                  type="button"
                  onClick={handleCancel}
                >
                  {t('cancel')}
                </Button>
              }
              submitButton={<SubmitButton />}
              deleteButton={
                props.mode === 'edit' ? (
                  <DeleteButton
                    label={tDelete('delete')}
                    confirmMessage={tDelete('deleteConfirm')}
                    onDelete={() => deleteEvent(props.eventId)}
                  />
                ) : undefined
              }
            />
          )}
        </SpaceChildrenVertically>
      </Form>

      {/* Outside the <form>, since React events bubble out of portals and
          typing in the deck form would mark this form as changed. Its
          format picker can open a format dialog on top, the one place
          dialogs stack. */}
      <Dialog isOpen={isAddDeckOpen} title={tCreateDeck('title')} usePortal>
        {isAddDeckOpen && (
          <DeckForm
            mode="create"
            onSuccess={handleDeckCreated}
            onCancel={() => setIsAddDeckOpen(false)}
          />
        )}
      </Dialog>
    </>
  );
};

export default EventForm;
