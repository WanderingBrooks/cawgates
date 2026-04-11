import { cn } from '@/lib/utils';
import classes from './card.module.css';

const alignClass = {
  start: classes.cardTitleAlignStart,
  center: classes.cardTitleAlignCenter,
  end: classes.cardTitleAlignEnd,
} as const;

type CardTitleProps = {
  children: React.ReactNode;
  align?: keyof typeof alignClass;
  className?: string;
};

const CardTitle = ({
  children,
  align = 'start',
  className,
}: CardTitleProps) => (
  <div className={cn(classes.cardTitle, alignClass[align], className)}>
    {children}
  </div>
);

export default CardTitle;
