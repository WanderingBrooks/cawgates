import classes from './card.module.css';

type CardProps = {
  children: React.ReactNode;
};

// A bordered box, optionally split into a CardTitle bar and CardContent
const Card = ({ children }: CardProps) => (
  <article className={classes.card}>{children}</article>
);

export default Card;
