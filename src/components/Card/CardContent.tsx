import SpaceChildrenVertically from '../SpaceChildrenVertically';
import { cn } from '@/lib/utils';
import classes from './card.module.css';

type CardContentProps = {
  children: React.ReactNode;
  className?: string;
  direction?: 'vertical' | 'horizontal';
};

const CardContent = ({
  children,
  className,
  direction = 'vertical',
}: CardContentProps) => {
  if (direction === 'horizontal') {
    return (
      <div className={cn(classes.cardContent, classes.cardContentHorizontal, className)}>
        {children}
      </div>
    );
  }

  return (
    <SpaceChildrenVertically className={cn(classes.cardContent, className)}>
      {children}
    </SpaceChildrenVertically>
  );
};

export default CardContent;
