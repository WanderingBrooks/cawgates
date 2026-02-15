import SpaceChildrenVertically from '@/components/SpaceChildrenVertically';

type CardContentProps = {
  children: React.ReactNode;
};

const CardContent = ({ children }: CardContentProps) => {
  return <SpaceChildrenVertically>{children}</SpaceChildrenVertically>;
};

export default CardContent;
