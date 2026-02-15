import Breadcrumb from '../Breadcrumb';
import SpaceChildrenVertically from '../SpaceChildrenVertically';
import classes from './page.module.css';

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
