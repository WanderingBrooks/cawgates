'use client';

/**
 * Inline confirmation UI shown when a user attempts to cancel a form with
 * unsaved changes. Replaces the cancel/save button row in place — no dialog
 * overlay required. Renders a "Discard changes?" label above two side-by-side
 * buttons: "Keep editing" to dismiss and "Discard" to confirm abandoning edits.
 */

import { useTranslations } from 'next-intl';
import Button from '../Button';
import FlexRowBetween from '../FlexRowBetween';
import SpaceChildrenVertically from '../SpaceChildrenVertically';

type DiscardChangesConfirmProps = {
  onKeepEditing: () => void;
  onDiscard: () => void;
};

const DiscardChangesConfirm = ({
  onKeepEditing,
  onDiscard,
}: DiscardChangesConfirmProps) => {
  const t = useTranslations('discardConfirm');

  return (
    <SpaceChildrenVertically>
      <span>{t('discardChanges')}</span>
      <FlexRowBetween>
        <Button variant="secondary" type="button" onClick={onKeepEditing}>
          {t('keepEditing')}
        </Button>
        <Button variant="danger" type="button" onClick={onDiscard}>
          {t('discard')}
        </Button>
      </FlexRowBetween>
    </SpaceChildrenVertically>
  );
};

export default DiscardChangesConfirm;
