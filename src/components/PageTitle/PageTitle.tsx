import { cn } from '@/lib/utils';
import classes from './pageTitle.module.css';
import LogoutButton from './LogoutButton';

type PageTitleProps = {
  title: string;
  className?: string;
  showLogout?: boolean;
};

const PageTitle = ({
  title,
  className,
  showLogout = false,
}: PageTitleProps) => {
  return (
    <div className={cn(classes.pageTitle, className)}>
      <h1>{title}</h1>
      {showLogout && <LogoutButton />}
    </div>
  );
};

export default PageTitle;
