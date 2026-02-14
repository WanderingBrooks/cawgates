import * as React from 'react';
import styles from './input.module.css';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`${styles.input} ${className}`.trim()}
      {...props}
    />
  ),
);

Input.displayName = 'Input';

export { Input };
