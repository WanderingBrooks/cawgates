import { cn } from '@/lib/utils';
import classes from './card.module.css';

type CardContentProps = {
  children: React.ReactNode;
  className?: string;
};

const CardContent = ({ children, className }: CardContentProps) => (
  <div className={cn(classes.cardContent, className)}>{children}</div>
);

export default CardContent;
