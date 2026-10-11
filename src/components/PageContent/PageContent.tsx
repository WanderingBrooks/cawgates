import { cn } from '@/lib/utils';
import classes from './pageContent.module.css';

type PageContentProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * The centred, max-width column every page's content sits in, below the
 * SiteHeader. Rendered once by each layout rather than by individual pages.
 */
const PageContent = ({ children, className }: PageContentProps) => {
  return <main className={cn(classes.pageContent, className)}>{children}</main>;
};

export default PageContent;
