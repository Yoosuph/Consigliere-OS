// Fix: Add 'React' import to resolve "Cannot find namespace 'React'" errors.
import React, { useEffect, useRef, useCallback } from 'react';

const MIN_WIDTH = 250;
const MIN_HEIGHT = 150;

interface ResizableOptions {
  onResize: (data: { size: { width: number; height: number }, position: { x: number; y: number } }) => void;
  disabled?: boolean;
}

export const useResizable = (
  windowRef: React.RefObject<HTMLDivElement>,
  options: ResizableOptions
) => {
  const { onResize, disabled = false } = options;
  const isResizingRef = useRef(false);
  const directionRef = useRef('');
  const initialRectRef = useRef({ width: 0, height: 0, x: 0, y: 0 });
  const initialMousePosRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizingRef.current || !windowRef.current) return;

    const deltaX = e.clientX - initialMousePosRef.current.x;
    const deltaY = e.clientY - initialMousePosRef.current.y;
    const direction = directionRef.current;
    
    // We need the latest position from the style, not the initial rect,
    // because dragging can change position, but getBoundingClientRect is slow.
    const currentPosition = {
        x: parseFloat(windowRef.current.style.left),
        y: parseFloat(windowRef.current.style.top)
    };
    
    let { width, height } = initialRectRef.current;
    let { x, y } = currentPosition;


    if (direction.includes('right')) {
      width = Math.max(MIN_WIDTH, initialRectRef.current.width + deltaX);
    }
    if (direction.includes('bottom')) {
      height = Math.max(MIN_HEIGHT, initialRectRef.current.height + deltaY);
    }
    if (direction.includes('left')) {
      const newWidth = initialRectRef.current.width - deltaX;
      if (newWidth >= MIN_WIDTH) {
        width = newWidth;
        x = initialRectRef.current.x + deltaX;
      }
    }
    if (direction.includes('top')) {
      const newHeight = initialRectRef.current.height - deltaY;
      if (newHeight >= MIN_HEIGHT) {
        height = newHeight;
        y = initialRectRef.current.y + deltaY;
      }
    }

    onResize({ size: { width, height }, position: { x, y } });
  }, [onResize, windowRef]);

  const handleMouseUp = useCallback(() => {
    isResizingRef.current = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !windowRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();

    isResizingRef.current = true;
    directionRef.current = e.currentTarget.dataset.direction || '';
    
    const rect = windowRef.current.getBoundingClientRect();
    const computedStyle = getComputedStyle(windowRef.current);
    
    initialRectRef.current = {
        width: parseFloat(computedStyle.width),
        height: parseFloat(computedStyle.height),
        x: rect.left,
        y: rect.top,
    };

    initialMousePosRef.current = { x: e.clientX, y: e.clientY };
    
    document.body.style.cursor = getComputedStyle(e.currentTarget).cursor || 'auto';
    document.body.style.userSelect = 'none';

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [disabled, windowRef, handleMouseMove, handleMouseUp]);
  
  return { handleMouseDown };
};