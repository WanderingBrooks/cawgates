import * as React from 'react';
import styles from './textarea.module.css';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', ...props }, ref) => (
    <textarea
      ref={ref}
      className={`${styles.textarea} ${className}`.trim()}
      {...props}
    />
  ),
);

Textarea.displayName = 'Textarea';

export { Textarea };
