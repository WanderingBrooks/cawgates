import { cn } from '@/lib/utils';
import classes from './pageTitle.module.css';
import NavMenu from '../NavMenu/NavMenu';

type PageTitleProps = {
  title: string;
  className?: string;
  disableMenu?: boolean;
};

const PageTitle = ({
  title,
  className,
  disableMenu = false,
}: PageTitleProps) => {
  return (
    <div className={cn(classes.pageTitle, className)}>
      <h1>{title}</h1>
      <NavMenu disabled={disableMenu} />
    </div>
  );
};

export default PageTitle;
