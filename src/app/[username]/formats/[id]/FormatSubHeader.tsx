'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button, Dialog, FormatForm } from '@/components';
import classes from './formatPage.module.css';

const FormatSubHeader = ({
  formatId,
  initialName,
}: {
  formatId: string;
  initialName: string;
}) => {
  const t = useTranslations('formatPage');
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className={classes.rightAlignedButton}>
        <Button variant="primary" onClick={() => setIsDialogOpen(true)}>
          {t('edit')}
        </Button>
      </div>
      <Dialog isOpen={isDialogOpen} title={t('editTitle')} usePortal>
        <FormatForm
          mode="edit"
          formatId={formatId}
          initialName={initialName}
          onSuccess={() => {
            setIsDialogOpen(false);
            router.refresh();
          }}
          onCancel={() => setIsDialogOpen(false)}
        />
      </Dialog>
    </>
  );
};

export default FormatSubHeader;
