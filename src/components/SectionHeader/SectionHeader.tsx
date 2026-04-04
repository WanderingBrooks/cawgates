import { cn } from '@/lib/utils';
import classes from './sectionHeader.module.css';
import { ReactNode } from 'react';

type SectionHeaderProps = {
  children: ReactNode;
  className?: string;
};

const SectionHeader = ({ children, className }: SectionHeaderProps) => {
  return (
    <p className={cn('text-label', classes.sectionHeader, className)}>
      {children}
    </p>
  );
};

export default SectionHeader;
