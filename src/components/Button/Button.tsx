import { cn } from '@/lib/utils';
import classes from './button.module.css';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  variant: 'primary' | 'secondary' | 'danger';
  size?: 'default' | 'small';
};

const Button = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  variant,
  size = 'default',
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'text-nowrap',
        classes.button,
        variant && classes[variant],
        size === 'small' && cn(classes.small, 'text-small'),
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
