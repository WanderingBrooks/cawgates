import { cn } from '@/lib/utils';
import classes from './sectionHeader.module.css';
import { ReactNode } from 'react';

type SectionHeaderProps = {
  children: ReactNode;
  className?: string;
};

const SectionHeader = ({ children, className }: SectionHeaderProps) => {
  return <h2 className={cn(classes.sectionHeader, className)}>{children}</h2>;
};

export default SectionHeader;
