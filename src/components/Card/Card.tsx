import { cn } from '@/lib/utils';
import classes from './card.module.css';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

// A bordered box, optionally split into a CardTitle bar and CardContent
const Card = ({ children, className }: CardProps) => (
  <article className={cn(classes.card, className)}>{children}</article>
);

export default Card;
