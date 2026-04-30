import React, { useRef } from 'react';
import { AppID } from '../types';
import { useDraggable } from '../hooks/useDraggable';

interface DraggableDesktopIconProps {
  id: AppID;
  title: string;
  icon: React.ReactNode;
  onDoubleClick: (id: AppID) => void;
  position: { x: number; y: number };
  onDrag: (pos: { x: number; y: number }) => void;
  desktopRef: React.RefObject<HTMLElement>;
}

const DesktopIcon: React.FC<DraggableDesktopIconProps> = ({
  id,
  title,
  icon,
  onDoubleClick,
  position,
  onDrag,
  desktopRef,
}) => {
  const iconRef = useRef<HTMLDivElement>(null);

  useDraggable(iconRef, iconRef, {
    initialPosition: position,
    onDrag,
    boundsRef: desktopRef,
  });

  return (
    <div
      ref={iconRef}
      className="absolute flex flex-col items-center justify-start text-center w-[84px] h-[92px] p-1 border border-transparent rounded hover:bg-white/10 hover:border-white/20 focus:bg-white/20 focus:border-white/30 focus:outline-none transition-colors duration-75 cursor-default group"
      style={{
        top: position.y,
        left: position.x,
        touchAction: 'none',
      }}
      onDoubleClick={() => onDoubleClick(id)}
      tabIndex={0}
    >
      <div className="w-[42px] h-[42px] mb-1.5 mt-1 flex items-center justify-center pointer-events-none drop-shadow-md">
        {icon}
      </div>
      <span
        className="text-white text-xs font-normal pointer-events-none leading-tight line-clamp-2 px-1 rounded-sm group-focus:bg-blue-600/60"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
      >
        {title}
      </span>
    </div>
  );
};

export default DesktopIcon;