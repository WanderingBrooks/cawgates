import classes from './card.module.css';

type CardTitleProps = {
  children: React.ReactNode;
  verticalAlignment?: 'flex-start' | 'center' | 'flex-end';
};

const CardTitle = ({
  children,
  verticalAlignment = 'flex-start',
}: CardTitleProps) => {
  return (
    <div
      className={classes.cardTitle}
      // This should not be style.
      // There should be a map of classes based on the verticalAlignment prop.
      style={{ alignItems: verticalAlignment }}
    >
      {children}
    </div>
  );
};

export default CardTitle;
