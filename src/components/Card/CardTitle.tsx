import { cn } from '@/lib/utils';
import classes from './card.module.css';

const alignClass = {
  start: undefined,
  center: classes.cardTitleAlignCenter,
  end: classes.cardTitleAlignEnd,
} as const;

type CardTitleProps = {
  children: React.ReactNode;
  align?: keyof typeof alignClass;
};

const CardTitle = ({ children, align = 'start' }: CardTitleProps) => (
  <div className={cn(classes.cardTitle, alignClass[align])}>
    {children}
  </div>
);

export default CardTitle;
