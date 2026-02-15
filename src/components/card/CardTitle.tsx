import classes from './card.module.css';

type CardTitleProps = {
  children: React.ReactNode;
};

const CardTitle = ({ children }: CardTitleProps) => {
  return <div className={classes.cardTitle}>{children}</div>;
};

export default CardTitle;
