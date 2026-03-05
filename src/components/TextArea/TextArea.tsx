import classes from './textArea.module.css';
import { cn } from '@/lib/utils';

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  containerClassName?: string;
};

const TextArea = ({
  label,
  className,
  containerClassName,
  ...textAreaProps
}: TextAreaProps) => {
  return (
    <div className={cn(classes.textAreaContainer, containerClassName)}>
      {label && <label htmlFor={textAreaProps.id}>{label}</label>}
      <textarea
        {...textAreaProps}
        className={cn(classes.textArea, className)}
      />
    </div>
  );
};

export default TextArea;
export type { TextAreaProps };
