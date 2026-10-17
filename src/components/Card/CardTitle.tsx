import { cn } from '@/lib/utils';
import classes from './card.module.css';

type CardTitleProps = {
  children: React.ReactNode;
  className?: string;
};

// Muted bar at the top of a Card; its children are spread across the row
const CardTitle = ({ children, className }: CardTitleProps) => (
  <div className={cn(classes.cardTitle, className)}>{children}</div>
);

export default CardTitle;
