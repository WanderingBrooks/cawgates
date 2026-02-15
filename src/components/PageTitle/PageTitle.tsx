import { cn } from '@/lib/utils';
import classes from './pageTitle.module.css';

type PageTitleProps = {
  children: React.ReactNode;
  className?: string;
};

const PageTitle = ({ children, className }: PageTitleProps) => {
  return <div className={cn(classes.pageTitle, className)}>{children}</div>;
};

export default PageTitle;
