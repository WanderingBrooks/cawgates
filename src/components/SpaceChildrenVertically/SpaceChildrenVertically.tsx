import classes from './spaceChildrenVertically.module.css';
import { cn } from '@/lib/utils';

type SpaceChildrenVerticallyProps = {
  children: React.ReactNode;
  className?: string;
};

const SpaceChildrenVertically = ({
  children,
  className,
}: SpaceChildrenVerticallyProps) => {
  return (
    <div className={cn(classes.spaceChildrenVertically, className)}>
      {children}
    </div>
  );
};

export default SpaceChildrenVertically;
