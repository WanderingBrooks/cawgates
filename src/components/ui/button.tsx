import * as React from 'react';
import styles from './button.module.css';

type ButtonVariant = 'default' | 'outline' | 'destructive';
type ButtonSize = 'default' | 'sm' | 'lg';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'default', className = '', ...props }, ref) => {
    const variantClass = styles[`variant__${variant}`] || '';
    const sizeClass = styles[`size__${size}`] || '';
    const combinedClasses = [styles.button, variantClass, sizeClass, className]
      .filter(Boolean)
      .join(' ');

    return <button ref={ref} className={combinedClasses} {...props} />;
  },
);

Button.displayName = 'Button';

export { Button };
