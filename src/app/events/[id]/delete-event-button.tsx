'use client';

import { deleteEventAndMatches } from '@/app/actions/events';
import Button from '@/components/button';

const DeleteEventButton = ({ eventId }: { eventId: string }) => {
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteEventAndMatches(eventId);
    }
  };

  return <Button onClick={handleDelete}>Delete Event</Button>;
};

export default DeleteEventButton;
