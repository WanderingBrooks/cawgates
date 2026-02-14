import * as React from 'react';

import { cn } from '@/lib/utils';

const Page = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'min-h-screen max-h-screen flex justify-center overflow-auto',
        className,
      )}
    >
      <div className="max-w-full md:max-w-xl">{children}</div>
    </div>
  );
};

export { Page };
