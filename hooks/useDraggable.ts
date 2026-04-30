import React, { useState, useEffect, useRef, useCallback } from 'react';

interface DraggableOptions {
  onDrag: (pos: { x: number; y: number }) => void;
  initialPosition: { x: number; y: number };
  boundsRef?: React.RefObject<HTMLElement>;
  disabled?: boolean;
}

export const useDraggable = (
  handleRef: React.RefObject<HTMLElement>,
  elementRef: React.RefObject<HTMLElement>, // The ref of the element being moved
  options: DraggableOptions
) => {
  const { onDrag, initialPosition, boundsRef, disabled = false } = options;
  const isDraggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef(initialPosition);
  
  useEffect(() => {
    positionRef.current = initialPosition;
  }, [initialPosition]);


  const handleMouseDown = useCallback((e: MouseEvent | TouchEvent) => {
    if (disabled) return;
    
    isDraggingRef.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    offsetRef.current = {
        x: clientX - positionRef.current.x,
        y: clientY - positionRef.current.y,
    };
  }, [disabled]);

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDraggingRef.current) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    let newX = clientX - offsetRef.current.x;
    let newY = clientY - offsetRef.current.y;

    if (boundsRef?.current) {
      const bounds = boundsRef.current.getBoundingClientRect();
      const element = elementRef.current?.getBoundingClientRect();
      if(element) {
        newX = Math.max(bounds.left, Math.min(newX, bounds.right - element.width));
        newY = Math.max(bounds.top, Math.min(newY, bounds.bottom - element.height));
      }
    }
    
    positionRef.current = { x: newX, y: newY };
    onDrag({ x: newX, y: newY });
  }, [onDrag, boundsRef, elementRef]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  useEffect(() => {
    const handleElement = handleRef.current;
    if (handleElement) {
      handleElement.addEventListener('mousedown', handleMouseDown);
      handleElement.addEventListener('touchstart', handleMouseDown, { passive: true });
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleMouseMove, { passive: true });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleMouseUp);

      return () => {
        handleElement.removeEventListener('mousedown', handleMouseDown);
        handleElement.removeEventListener('touchstart', handleMouseDown);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('touchmove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [handleRef, handleMouseDown, handleMouseMove, handleMouseUp]);
};