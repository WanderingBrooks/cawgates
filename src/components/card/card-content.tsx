import SpaceChildrenVertically from '@/components/space-children-vertically';

type CardContentProps = {
  children: React.ReactNode;
};

const CardContent = ({ children }: CardContentProps) => {
  return <SpaceChildrenVertically>{children}</SpaceChildrenVertically>;
};

export default CardContent;
