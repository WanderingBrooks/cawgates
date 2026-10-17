import classes from './card.module.css';

type CardTitleProps = {
  children: React.ReactNode;
};

// Muted bar at the top of a Card; its children are spread across the row
const CardTitle = ({ children }: CardTitleProps) => (
  <div className={classes.cardTitle}>{children}</div>
);

export default CardTitle;
