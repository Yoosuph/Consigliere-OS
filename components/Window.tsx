import React, { useRef, useState, useEffect } from 'react';
import { useDraggable } from '../hooks/useDraggable';
import { useResizable } from '../hooks/useResizable';
import { ICONS } from '../constants';

interface WindowProps {
    id: string;
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    position: { x: number; y: number };
    size: { width: number; height: number };
    isMaximized: boolean;
    isMinimized: boolean;
    zIndex: number;
    onClose: (id: string) => void;
    onMinimize: (id: string) => void;
    onMaximize: (id: string) => void;
    onFocus: (id: string) => void;
    onDrag: (id: string, pos: { x: number; y: number }) => void;
    onResize: (id: string, data: { size: { width: number; height: number }, position: { x: number; y: number } }) => void;
    desktopRef: React.RefObject<HTMLDivElement>;
    taskbarIconRect?: DOMRect;
}

// Fix: The previous implementation of this hook was causing a cascade of parsing errors.
// Rewriting as a standard function to ensure correct parsing by TypeScript.
function usePrevious<T>(value: T): T | undefined {
    // FIX: The useRef hook was called without an initial value, which can cause type errors.
    // Initializing with `undefined` to satisfy the hook's signature and fix the "Expected 1 arguments, but got 0" error.
    const ref = useRef<T | undefined>(undefined);
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}


const Window: React.FC<WindowProps> = ({
    id,
    title,
    icon,
    children,
    position,
    size,
    isMaximized,
    isMinimized,
    zIndex,
    onClose,
    onMinimize,
    onMaximize,
    onFocus,
    onDrag,
    onResize,
    desktopRef,
    taskbarIconRect,
}) => {
    const handleRef = useRef<HTMLDivElement>(null);
    const windowRef = useRef<HTMLDivElement>(null);
    
    const [isAnimating, setIsAnimating] = useState(false);
    const [isHidden, setIsHidden] = useState(isMinimized);
    const [isVisuallyMinimized, setIsVisuallyMinimized] = useState(isMinimized);
    
    const prevIsMinimized = usePrevious(isMinimized);
    const prevIsMaximized = usePrevious(isMaximized);

    useEffect(() => {
        if (prevIsMinimized === true && !isMinimized) { // Restore
            setIsHidden(false);
            setIsVisuallyMinimized(true);
            
            requestAnimationFrame(() => {
                setIsAnimating(true);
                setIsVisuallyMinimized(false);
            });
        } else if (prevIsMinimized === false && isMinimized) { // Minimize
            setIsAnimating(true);
            setIsVisuallyMinimized(true);
        }
    }, [isMinimized, prevIsMinimized]);
    
    const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
        if (e.target !== windowRef.current) return;
        if (isAnimating) {
            setIsAnimating(false);
            if (isMinimized) {
                setIsHidden(true);
            }
        }
    };


    const handleDrag = (pos: { x: number; y: number }) => {
        if (!isMaximized) {
            onDrag(id, pos);
        }
    };
    
    useDraggable(handleRef, windowRef, {
        onDrag: handleDrag,
        initialPosition: position,
        boundsRef: desktopRef,
        disabled: isMaximized,
    });

    const { handleMouseDown: handleResizeMouseDown } = useResizable(windowRef, {
        onResize: (data) => onResize(id, data),
        disabled: isMaximized,
    });
    
    let minimizeTransform = 'scale(1)';
    let minimizeOpacity = 1;

    if (taskbarIconRect) {
        const sourceRect = {
            width: size.width,
            height: size.height,
            x: position.x,
            y: position.y,
        };
        
        const targetCenterX = taskbarIconRect.left + taskbarIconRect.width / 2;
        const targetCenterY = taskbarIconRect.top + taskbarIconRect.height / 2;

        const sourceCenterX = sourceRect.x + sourceRect.width / 2;
        const sourceCenterY = sourceRect.y + sourceRect.height / 2;

        const translateX = targetCenterX - sourceCenterX;
        const translateY = targetCenterY - sourceCenterY;

        const scaleX = Math.max(0.05, taskbarIconRect.width / sourceRect.width);
        const scaleY = Math.max(0.05, taskbarIconRect.height / sourceRect.height);
        
        minimizeTransform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
        minimizeOpacity = 0;
    }

    const windowStyle: React.CSSProperties = {
        top: isMaximized ? 0 : position.y,
        left: isMaximized ? 0 : position.x,
        width: isMaximized ? '100%' : `${size.width}px`,
        height: isMaximized ? '100%' : `${size.height}px`,
        zIndex,
        display: isHidden ? 'none' : 'flex',
        transformOrigin: 'center center',
        transform: isVisuallyMinimized ? minimizeTransform : 'scale(1)',
        opacity: isVisuallyMinimized ? minimizeOpacity : 1,
        transition: isAnimating || (isMaximized !== prevIsMaximized && prevIsMaximized !== undefined)
            ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            : 'none',
    };

    return (
        <div
            ref={windowRef}
            className={`absolute flex flex-col bg-[#1A1A1A]/95 backdrop-blur-xl rounded-md shadow-[0_12px_24px_rgba(0,0,0,0.4)] border border-white/10 overflow-hidden pointer-events-auto ${isMaximized ? 'rounded-none' : ''}`}
            style={windowStyle}
            onMouseDown={() => onFocus(id)}
            onClick={(e) => { e.stopPropagation(); onFocus(id); }}
            onTransitionEnd={handleTransitionEnd}
        >
            {!isMaximized && (
                <>
                    {/* Corner handles */}
                    <div onMouseDown={handleResizeMouseDown} data-direction="top-left" className="absolute -top-1 -left-1 w-3 h-3 cursor-nwse-resize z-10" />
                    <div onMouseDown={handleResizeMouseDown} data-direction="top-right" className="absolute -top-1 -right-1 w-3 h-3 cursor-nesw-resize z-10" />
                    <div onMouseDown={handleResizeMouseDown} data-direction="bottom-left" className="absolute -bottom-1 -left-1 w-3 h-3 cursor-nesw-resize z-10" />
                    <div onMouseDown={handleResizeMouseDown} data-direction="bottom-right" className="absolute -bottom-1 -right-1 w-3 h-3 cursor-nwse-resize z-10" />
                    {/* Edge handles */}
                    <div onMouseDown={handleResizeMouseDown} data-direction="top" className="absolute top-0 left-1 right-1 h-1.5 cursor-ns-resize z-10" />
                    <div onMouseDown={handleResizeMouseDown} data-direction="bottom" className="absolute bottom-0 left-1 right-1 h-1.5 cursor-ns-resize z-10" />
                    <div onMouseDown={handleResizeMouseDown} data-direction="left" className="absolute top-1 bottom-1 left-0 w-1.5 cursor-ew-resize z-10" />
                    <div onMouseDown={handleResizeMouseDown} data-direction="right" className="absolute top-1 bottom-1 right-0 w-1.5 cursor-ew-resize z-10" />
                </>
            )}

            <header
                ref={handleRef}
                className="flex items-center justify-between h-[32px] bg-transparent flex-shrink-0 cursor-default select-none relative z-10"
                onDoubleClick={() => onMaximize(id)}
            >
                <div className="flex items-center gap-2 pl-3 pb-1 overflow-hidden pointer-events-none">
                    <div className="w-4 h-4 flex-shrink-0">{icon}</div>
                    <span className="text-xs text-gray-200 mt-[1px]">{title}</span>
                </div>
                <div className="flex items-center h-full">
                    <button onClick={(e) => { e.stopPropagation(); onMinimize(id); }} className="w-[46px] h-full flex items-center justify-center hover:bg-white/10 text-gray-300 transition-colors">{ICONS.MINIMIZE}</button>
                    <button onClick={(e) => { e.stopPropagation(); onMaximize(id); }} className="w-[46px] h-full flex items-center justify-center hover:bg-white/10 text-gray-300 transition-colors">
                        {isMaximized ? ICONS.RESTORE : ICONS.MAXIMIZE}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onClose(id); }} className="w-[46px] h-full flex items-center justify-center hover:bg-[#E81123] text-gray-300 hover:text-white transition-colors">{ICONS.CLOSE}</button>
                </div>
            </header>
            <main className="flex-grow overflow-auto min-h-0 flex flex-col bg-[#202020]" style={{ opacity: isVisuallyMinimized ? 0 : 1, transition: 'opacity 0.1s ease-in-out' }}>
                {children}
            </main>
        </div>
    );
};

export default Window;