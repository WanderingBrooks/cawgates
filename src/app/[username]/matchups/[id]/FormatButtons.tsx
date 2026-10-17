'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { deleteFormat } from '@/app/actions/formats';
import { Button, DeleteButton, Dialog, FormatForm } from '@/components';
import classes from './matchupsPage.module.css';

// Add and edit buttons for the Format dropdown. Deleting lives inside the
// edit dialog, the same way Delete deck lives in the deck form.
const FormatButtons = ({
  username,
  formatId,
  formatName,
  deckCount,
  opponentArchetypeCount,
}: {
  username: string;
  formatId: string;
  formatName: string;
  deckCount: number;
  opponentArchetypeCount: number;
}) => {
  const t = useTranslations('matchupsPage');
  const tDelete = useTranslations('deleteFormatButton');
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className={classes.filterButtons}>
      <Button variant="secondary" onClick={() => setIsCreateOpen(true)}>
        {t('addFormat')}
      </Button>
      <Button variant="secondary" onClick={() => setIsEditOpen(true)}>
        {t('editFormat')}
      </Button>

      <Dialog isOpen={isCreateOpen} title={t('addFormatTitle')} usePortal>
        <FormatForm
          mode="create"
          onSuccess={format => {
            setIsCreateOpen(false);
            router.push(`/${username}/matchups/${format.id}`);
          }}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Dialog>

      <Dialog isOpen={isEditOpen} title={t('editFormatTitle')} usePortal>
        <FormatForm
          mode="edit"
          formatId={formatId}
          initialName={formatName}
          onSuccess={() => {
            setIsEditOpen(false);
            router.refresh();
          }}
          onCancel={() => setIsEditOpen(false)}
          deleteButton={
            <DeleteButton
              label={tDelete('delete')}
              confirmMessage={
                opponentArchetypeCount > 0
                  ? tDelete('deleteConfirmWithArchetypes', {
                      count: opponentArchetypeCount,
                    })
                  : tDelete('deleteConfirm')
              }
              onDelete={() => deleteFormat({ formatId })}
              disabled={deckCount > 0}
            />
          }
          deleteHint={deckCount > 0 ? tDelete('hasDecksHint') : undefined}
        />
      </Dialog>
    </div>
  );
};

export default FormatButtons;
