import classes from './pageContent.module.css';

type PageContentProps = {
  children: React.ReactNode;
};

/**
 * The centred, max-width column every page's content sits in, below the
 * SiteHeader. Rendered once by each layout rather than by individual pages.
 */
const PageContent = ({ children }: PageContentProps) => {
  return <main className={classes.pageContent}>{children}</main>;
};

export default PageContent;
