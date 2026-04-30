import React, { useState, useLayoutEffect, useRef } from 'react';

interface TooltipProps {
  content: string;
  targetElement: HTMLElement;
}

const Tooltip: React.FC<TooltipProps> = ({ content, targetElement }) => {
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: -9999, left: -9999 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!tooltipRef.current) return;

    const targetRect = targetElement.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    const top = targetRect.top - tooltipRect.height - 8; // 8px margin from element
    const left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);

    setPosition({ top, left });
  }, [targetElement]);

  const style: React.CSSProperties = {
      position: 'fixed',
      top: `${position.top}px`,
      left: `${position.left}px`,
      zIndex: 100,
  };

  return (
    <div
      ref={tooltipRef}
      style={style}
      className="bg-[#2B2B2B] border border-gray-600 text-white text-xs px-2 py-1 shadow-md animate-fade-in pointer-events-none"
      role="tooltip"
    >
      {content}
    </div>
  );
};

export default Tooltip;
