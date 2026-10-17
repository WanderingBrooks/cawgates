import { cn } from '@/lib/utils';
import FlexRowBetween from '../FlexRowBetween';
import classes from './formActions.module.css';

type FormActionsProps = {
  cancelButton: React.ReactNode;
  submitButton: React.ReactNode;
  // Edit forms put Delete on the left, with Cancel and Save on the right,
  // and an optional hint (like why Delete is disabled) under the row
  deleteButton?: React.ReactNode;
  deleteHint?: string;
  className?: string;
};

/**
 * The button row at the bottom of every form, so create and edit forms all
 * line up the same way.
 */
const FormActions = ({
  cancelButton,
  submitButton,
  deleteButton,
  deleteHint,
  className,
}: FormActionsProps) => {
  if (!deleteButton) {
    return (
      <FlexRowBetween className={className}>
        {cancelButton}
        {submitButton}
      </FlexRowBetween>
    );
  }

  return (
    <div className={cn(classes.formActions, className)}>
      <FlexRowBetween className={classes.row}>
        {/* Its own column, so a delete error shows under the button instead
            of squeezing between the buttons */}
        <div className={classes.deleteSlot}>{deleteButton}</div>
        <div className={classes.rightButtons}>
          {cancelButton}
          {submitButton}
        </div>
      </FlexRowBetween>
      {deleteHint && <p className="hint">{deleteHint}</p>}
    </div>
  );
};

export default FormActions;
