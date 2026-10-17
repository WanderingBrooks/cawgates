import classes from './card.module.css';

type CardContentProps = {
  children: React.ReactNode;
};

const CardContent = ({ children }: CardContentProps) => (
  <div className={classes.cardContent}>{children}</div>
);

export default CardContent;
