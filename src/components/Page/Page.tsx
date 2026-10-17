import classes from './page.module.css';

/**
 * Top level page component that defines the styles for the entire app.
 * This component should not be imported or used anywhere besides the
 * RootLayout component.
 *
 * It spans the full width so the SiteHeader can run edge to edge; layouts
 * and pages wrap their content in PageContent to get the readable column.
 */
const Page = ({ children }: { children: React.ReactNode }) => {
  return <div className={classes.pageContainer}>{children}</div>;
};

export default Page;
