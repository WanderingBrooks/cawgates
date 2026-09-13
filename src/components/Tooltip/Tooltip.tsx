'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/utils';
import classes from './tooltip.module.css';

type TooltipProps = {
  content: string;
  children: React.ReactNode;
  className?: string;
};

// Renders `children` with a dotted underline; hovering, focusing, or
// tapping it shows a small popover above the text containing `content`.
const Tooltip = ({ content, children, className }: TooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipId = useId();

  return (
    <span className={cn(classes.tooltip, className)}>
      <button
        type="button"
        className={classes.trigger}
        aria-describedby={tooltipId}
        onClick={() => setIsOpen(open => !open)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      >
        {children}
      </button>
      {isOpen && (
        <span role="tooltip" id={tooltipId} className={classes.bubble}>
          {content}
        </span>
      )}
    </span>
  );
};

export default Tooltip;
