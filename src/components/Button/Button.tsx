import { cn } from '@/lib/utils';
import classes from './button.module.css';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  variant: 'primary' | 'secondary' | 'danger';
};

const Button = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  variant,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(classes.button, variant && classes[variant], className)}
    >
      {children}
    </button>
  );
};

export default Button;
