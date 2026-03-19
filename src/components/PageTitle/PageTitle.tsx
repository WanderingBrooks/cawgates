import { cn } from '@/lib/utils';
import classes from './pageTitle.module.css';
import NavMenu from '../NavMenu/NavMenu';

type PageTitleProps = {
  title: string;
  subtitle?: string;
  className?: string;
  disableMenu?: boolean;
};

const PageTitle = ({
  title,
  subtitle,
  className,
  disableMenu = false,
}: PageTitleProps) => {
  return (
    <div className={cn(classes.pageTitle, className)}>
      <div>
        <h1>{title}</h1>
        <h2 className={classes.subtitle}>{subtitle}</h2>
      </div>
      <NavMenu disabled={disableMenu} />
    </div>
  );
};

export default PageTitle;
