import SpaceChildrenVertically from '../space-children-vertically';
import classes from './page.module.css';

const Page = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={classes.pageContainer}>
      <SpaceChildrenVertically className={classes.pageContent}>
        {children}
      </SpaceChildrenVertically>
    </div>
  );
};

export default Page;
