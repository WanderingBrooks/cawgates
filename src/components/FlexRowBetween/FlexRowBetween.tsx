import { cn } from '@/lib/utils';
import classes from './flexRowBetween.module.css';

type FlexRowBetweenProps = {
  children: React.ReactNode;
  className?: string;
};

const FlexRowBetween = ({ children, className }: FlexRowBetweenProps) => {
  return (
    <div className={cn(classes.flexRowBetween, className)}>{children}</div>
  );
};

export default FlexRowBetween;
