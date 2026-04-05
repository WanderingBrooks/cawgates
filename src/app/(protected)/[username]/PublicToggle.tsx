'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { setArchetypePublic } from '@/app/actions/archetypes';
import { Button, ErrorMessage } from '@/components';

type PublicToggleProps = {
  archetypeId: string;
  initialIsPublic: boolean;
};

const PublicToggle = ({ archetypeId, initialIsPublic }: PublicToggleProps) => {
  const t = useTranslations('publicToggle');
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    setSaving(true);
    setError(null);

    const result = await setArchetypePublic({ archetypeId, isPublic: !isPublic });

    if (result.success) {
      setIsPublic(prev => !prev);
    } else {
      setError(result.error);
    }

    setSaving(false);
  };

  return (
    <div>
      <p>{isPublic ? t('publicHint') : t('privateHint')}</p>
      {error && <ErrorMessage error={error} />}
      <Button variant="secondary" onClick={handleToggle} disabled={saving} type="button">
        {saving ? t('saving') : t(isPublic ? 'makePrivate' : 'makePublic')}
      </Button>
    </div>
  );
};

export default PublicToggle;
