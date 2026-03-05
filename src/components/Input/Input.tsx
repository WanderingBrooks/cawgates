import classes from './input.module.css';
import { cn } from '@/lib/utils';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const Input = ({ className = '', label, ...props }: InputProps) => {
  return (
    <div className={classes.inputContainer}>
      {label && <label htmlFor={props.id}>{label}</label>}
      <input
        {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        className={cn(classes.input, className)}
      />
    </div>
  );
};

export default Input;
