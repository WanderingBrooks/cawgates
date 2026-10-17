import { ReactNode } from 'react';

type SectionHeaderProps = {
  children: ReactNode;
};

// Spacing around it comes from the section or page it sits in
const SectionHeader = ({ children }: SectionHeaderProps) => {
  return <h2>{children}</h2>;
};

export default SectionHeader;
