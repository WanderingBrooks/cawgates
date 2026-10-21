import classes from './formFooter.module.css';

/**
 * Holds a full-page form's button row. On phones it is fixed to the bottom of
 * the screen, so Save stays in reach however long the notes get. On desktop
 * it sits under the form like any other row.
 */
const FormFooter = ({ children }: { children: React.ReactNode }) => {
  return <div className={classes.formFooter}>{children}</div>;
};

export default FormFooter;
