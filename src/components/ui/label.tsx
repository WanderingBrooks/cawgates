import * as React from 'react';
import styles from './label.module.css';

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = '', ...props }, ref) => (
    <label ref={ref} className={`${styles.label} ${className}`.trim()} {...props} />
  ),
);

Label.displayName = 'Label';

export { Label };
