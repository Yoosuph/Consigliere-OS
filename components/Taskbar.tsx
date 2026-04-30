import React, { useState, useEffect } from 'react';
import type { WindowInstance, AppID } from '../types';
import { ICONS } from '../constants';
import StartMenu from './StartMenu';
import Tooltip from './Tooltip';

interface TaskbarProps {
    openWindows: WindowInstance[];
    onAppClick: (id: string) => void;
    onStartClick: (e: React.MouseEvent) => void;
    isStartMenuOpen: boolean;
    onOpenApp: (id: AppID) => void;
    onIconMouseEnter: (id: string, target: HTMLElement) => void;
    onIconMouseLeave: () => void;
    iconRefs: React.MutableRefObject<Map<string, HTMLButtonElement | null>>;
    onToggleActionCenter: () => void;
    notificationCount: number;
}

interface TooltipState {
    content: string;
    target: HTMLElement;
}


const Clock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    return (
        <div className="text-xs text-center px-2">
            <div>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div>{time.toLocaleDateString()}</div>
        </div>
    );
};


const Taskbar: React.FC<TaskbarProps> = ({ 
    openWindows, 
    onAppClick, 
    onStartClick, 
    isStartMenuOpen, 
    onOpenApp, 
    onIconMouseEnter, 
    onIconMouseLeave, 
    iconRefs,
    onToggleActionCenter,
    notificationCount,
}) => {
    const [tooltip, setTooltip] = useState<TooltipState | null>(null);

    const handleSysIconEnter = (content: string, e: React.MouseEvent<HTMLButtonElement>) => {
        setTooltip({ content, target: e.currentTarget });
    };

    const handleSysIconLeave = () => {
        setTooltip(null);
    };
    
    return (
        <>
            {tooltip && <Tooltip content={tooltip.content} targetElement={tooltip.target} />}
            <StartMenu isOpen={isStartMenuOpen} onAppClick={onOpenApp} />
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#1e1e1e]/95 backdrop-blur-md flex items-center justify-between px-1 z-50 border-t border-[#333]">
                <div className="flex items-center gap-1 h-full">
                    <button onClick={onStartClick} className="p-2 w-10 h-full flex items-center justify-center hover:bg-white/10 transition-colors text-white">
                        <div className="w-5 h-5 flex items-center justify-center">{ICONS.START}</div>
                    </button>
                    {openWindows.map(win => (
                        <button
                            key={win.id}
                            ref={node => {
                                if (node) {
                                    iconRefs.current.set(win.id, node);
                                } else {
                                    iconRefs.current.delete(win.id);
                                }
                            }}
                            onClick={() => onAppClick(win.id)}
                            onMouseEnter={(e) => onIconMouseEnter(win.id, e.currentTarget)}
                            onMouseLeave={onIconMouseLeave}
                            className={`flex items-center gap-2 h-full px-2 relative transition-colors ${win.isMinimized ? 'hover:bg-white/10' : 'bg-white/10 hover:bg-white/20'}`}
                        >
                            <div className="w-5 h-5">{win.icon}</div>
                            {/* Running indicator */}
                            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] rounded-t w-full bg-blue-400 ${win.isMinimized ? 'opacity-0' : 'opacity-100'}`}></div>
                        </button>
                    ))}
                </div>
                <div className="text-white flex items-center h-full">
                    <div className="flex items-center h-full mr-2">
                         <button 
                            onMouseEnter={(e) => handleSysIconEnter('Wi-Fi: Connected', e)}
                            onMouseLeave={handleSysIconLeave}
                            className="px-2 h-full flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                            {ICONS.WIFI}
                        </button>
                         <button 
                            onMouseEnter={(e) => handleSysIconEnter('Volume: 75%', e)}
                            onMouseLeave={handleSysIconLeave}
                            className="px-2 h-full flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                            {ICONS.SOUND}
                        </button>
                         <button
                            onMouseEnter={(e) => handleSysIconEnter('Battery: 92% Charged', e)}
                            onMouseLeave={handleSysIconLeave}
                            className="px-2 h-full flex items-center justify-center hover:bg-white/10 transition-colors"
                         >
                            {ICONS.BATTERY}
                        </button>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleActionCenter(); }}
                        className="px-2 h-full flex items-center justify-center hover:bg-white/10 transition-colors relative"
                    >
                        {ICONS.NOTIFICATION}
                        {notificationCount > 0 && (
                            <span className="absolute bottom-1 right-1 bg-blue-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-[#1e1e1e]">
                                {notificationCount}
                            </span>
                        )}
                    </button>
                    <div className="h-full flex items-center hover:bg-white/10 transition-colors cursor-pointer px-2" onClick={(e) => { e.stopPropagation(); onToggleActionCenter(); }}>
                        <Clock />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Taskbar;