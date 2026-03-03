import Breadcrumb from '../Breadcrumb';
import SpaceChildrenVertically from '../SpaceChildrenVertically';
import classes from './page.module.css';

/**
 * Top level page component that defines the styles and header
 * for the entire app. This component should not be imported or used
 * anywhere besides the RootLayout component.
 */
const Page = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={classes.pageContainer}>
      <Breadcrumb />
      <SpaceChildrenVertically className={classes.pageContent}>
        {children}
      </SpaceChildrenVertically>
    </div>
  );
};

export default Page;
