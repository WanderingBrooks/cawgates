'use client';

import { useId, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import classes from './tooltip.module.css';

type TooltipProps = {
  content: string;
  children: React.ReactNode;
  className?: string;
};

// Space between the bubble and the text, and the closest the bubble gets
// to the edge of the screen
const GAP_PX = 4;
const EDGE_PX = 8;

/**
 * Places the bubble centred above the trigger, shifted sideways to stay on
 * screen and flipped below the trigger when there's no room above.
 */
const positionBubble = ({
  trigger,
  bubble,
}: {
  trigger: HTMLElement;
  bubble: HTMLElement;
}) => {
  const triggerRect = trigger.getBoundingClientRect();
  const bubbleRect = bubble.getBoundingClientRect();
  const screenWidth = document.documentElement.clientWidth;

  const centredLeft =
    triggerRect.left + triggerRect.width / 2 - bubbleRect.width / 2;

  const left = Math.max(
    EDGE_PX,
    Math.min(centredLeft, screenWidth - bubbleRect.width - EDGE_PX),
  );

  const aboveTop = triggerRect.top - bubbleRect.height - GAP_PX;
  const top = aboveTop < EDGE_PX ? triggerRect.bottom + GAP_PX : aboveTop;

  bubble.style.setProperty('--tooltip-left', `${left}px`);
  bubble.style.setProperty('--tooltip-top', `${top}px`);
};

// Renders `children` with a dotted underline; hovering, focusing, or
// tapping it shows a small popover above the text containing `content`.
// The popover sits in the browser's top layer, so it isn't clipped by
// scrolling containers such as a table wrapped in .table-scroll.
const Tooltip = ({ content, children, className }: TooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const trigger = triggerRef.current;
    const bubble = bubbleRef.current;

    if (!isOpen || !trigger || !bubble) {
      return;
    }

    bubble.showPopover();
    positionBubble({ trigger, bubble });

    // The bubble doesn't follow the text, so close it once the page moves
    const close = () => setIsOpen(false);

    window.addEventListener('scroll', close, { capture: true });
    window.addEventListener('resize', close);

    return () => {
      window.removeEventListener('scroll', close, { capture: true });
      window.removeEventListener('resize', close);
    };
  }, [isOpen]);

  return (
    <span className={cn(classes.tooltip, className)}>
      <button
        ref={triggerRef}
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
        <span
          ref={bubbleRef}
          popover="manual"
          role="tooltip"
          id={tooltipId}
          className={cn('text-tooltip', classes.bubble)}
        >
          {content}
        </span>
      )}
    </span>
  );
};

export default Tooltip;
