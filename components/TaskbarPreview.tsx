import React from 'react';
import type { WindowInstance } from '../types';
import { ICONS } from '../constants';

interface TaskbarPreviewProps {
    window: WindowInstance;
    targetRect: DOMRect;
    children: React.ReactNode;
    onClose: (windowId: string) => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

const PREVIEW_WIDTH = 200; // width in pixels
const TASKBAR_HEIGHT = 40; // h-10 in tailwind

const TaskbarPreview: React.FC<TaskbarPreviewProps> = ({ window, targetRect, children, onClose, onMouseEnter, onMouseLeave }) => {
    const aspectRatio = window.size.height / window.size.width;
    const previewHeight = PREVIEW_WIDTH * aspectRatio;
    const scale = PREVIEW_WIDTH / window.size.width;

    // Fix: Calculate the `left` position in a local `number` variable to avoid TypeScript
    // errors when performing arithmetic on `React.CSSProperties`.
    let left = targetRect.left + (targetRect.width / 2) - (PREVIEW_WIDTH / 2);
    
    // Boundary checks to prevent preview from going off-screen
    if (left < 8) {
         left = 8;
    }
    if (typeof document !== 'undefined' && left + PREVIEW_WIDTH > document.body.clientWidth - 8) {
        left = document.body.clientWidth - PREVIEW_WIDTH - 8;
    }
    
    const style: React.CSSProperties = {
        width: PREVIEW_WIDTH,
        bottom: TASKBAR_HEIGHT + 8, // 8px margin from taskbar
        left: left,
    };

    return (
        <div 
            className="absolute bg-gray-800/90 backdrop-blur-md text-white shadow-lg rounded p-1 z-[60] animate-fade-in-up group"
            style={style}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="flex justify-between items-start px-1 pb-1">
                <span className="text-xs font-bold truncate pt-0.5">{window.title}</span>
                 <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose(window.id);
                    }}
                    className="p-0.5 rounded hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    aria-label={`Close ${window.title}`}
                >
                    <div className="w-4 h-4">{ICONS.CLOSE}</div>
                </button>
            </div>
            <div 
                className="bg-gray-900 overflow-hidden border border-black"
                style={{ height: previewHeight }}
            >
                <div 
                    className="pointer-events-none"
                    style={{
                        width: window.size.width,
                        height: window.size.height,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default TaskbarPreview;