import { cn } from '@/lib/utils';
import classes from './pageTitle.module.css';

type PageTitleProps = {
  title: string;
  subtitle?: React.ReactNode;
  // Buttons for the page, shown beside the title on wide screens and
  // below it on phones
  actions?: React.ReactNode;
  className?: string;
};

const PageTitle = ({ title, subtitle, actions, className }: PageTitleProps) => {
  return (
    <div className={cn(classes.pageTitle, className)}>
      <div className={classes.text}>
        <h1>{title}</h1>
        {subtitle && (
          <div className={cn('text-secondary', classes.subtitle)}>
            {subtitle}
          </div>
        )}
      </div>
      {actions && <div className={classes.actions}>{actions}</div>}
    </div>
  );
};

export default PageTitle;
