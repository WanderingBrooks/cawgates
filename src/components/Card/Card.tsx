import { cn } from '@/lib/utils';
import classes from './card.module.css';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const Card = ({ children, className }: CardProps) => {
  return <div className={cn(classes.card, className)}>{children}</div>;
};

export default Card;
