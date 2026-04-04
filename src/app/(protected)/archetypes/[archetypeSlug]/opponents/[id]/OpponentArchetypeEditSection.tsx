'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button, OpponentArchetypeForm } from '@/components';

const OpponentArchetypeEditSection = ({
  archetypeId,
  opponentArchetypeId,
  initialName,
}: {
  archetypeId: string;
  opponentArchetypeId: string;
  initialName: string;
}) => {
  const t = useTranslations('opponentArchetypePage');
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <OpponentArchetypeForm
        mode="edit"
        archetypeId={archetypeId}
        opponentArchetypeId={opponentArchetypeId}
        initialName={initialName}
        onSuccess={() => {
          setIsEditing(false);
          router.refresh();
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <Button variant="primary" onClick={() => setIsEditing(true)}>
      {t('edit')}
    </Button>
  );
};

export default OpponentArchetypeEditSection;
