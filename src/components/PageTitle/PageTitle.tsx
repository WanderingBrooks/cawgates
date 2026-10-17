import { Fragment } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import classes from './pageTitle.module.css';

type PageTitleProps = {
  title: string;
  // One item, or a list shown as "Pauper · Match wins 24 · ...". Falsy items
  // are skipped, so callers can include items conditionally.
  subtitle?: React.ReactNode | React.ReactNode[];
  // Buttons for the page, shown beside the title on wide screens and
  // below it on phones
  actions?: React.ReactNode;
  className?: string;
};

const PageTitle = ({ title, subtitle, actions, className }: PageTitleProps) => {
  const t = useTranslations('pageTitle');

  const subtitleItems = (
    Array.isArray(subtitle) ? subtitle : [subtitle]
  ).filter(item => item !== undefined && item !== null && item !== false);

  return (
    <div className={cn(classes.pageTitle, className)}>
      <div className={classes.text}>
        <h1>{title}</h1>
        {subtitleItems.length > 0 && (
          <div className={cn('text-secondary', classes.subtitle)}>
            {subtitleItems.map((item, index) => (
              <Fragment key={index}>
                {index > 0 && (
                  <span className={classes.separator}>{t('separator')}</span>
                )}
                {item}
              </Fragment>
            ))}
          </div>
        )}
      </div>
      {actions && <div className={classes.actions}>{actions}</div>}
    </div>
  );
};

export default PageTitle;
