import classes from './input.module.css';
import { cn } from '@/lib/utils';

type InputProps = (
  | (React.InputHTMLAttributes<HTMLInputElement> & { isMultiline?: false })
  | (React.TextareaHTMLAttributes<HTMLTextAreaElement> & { isMultiline: true })
) & {
  label?: string;
};

const Input = ({
  className = '',
  label,
  isMultiline,
  ...props
}: InputProps) => {
  return (
    <div className={classes.inputContainer}>
      {label && <label htmlFor={props.id}>{label}</label>}
      {isMultiline ? (
        <textarea
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          className={cn(classes.input, className)}
        />
      ) : (
        <input
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          className={cn(classes.input, className)}
        />
      )}
    </div>
  );
};

export default Input;
