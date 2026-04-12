import classes from './select.module.css';
import { cn } from '@/lib/utils';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hint?: React.ReactNode;
  options: { value: string; label: string }[];
};

const Select = ({
  className = '',
  label,
  hint,
  options,
  ...props
}: SelectProps) => {
  return (
    <div className={classes.selectContainer}>
      {label && <label htmlFor={props.id}>{label}</label>}
      {hint && <span className="hint">{hint}</span>}
      <select
        {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
        className={cn(classes.select, className)}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
