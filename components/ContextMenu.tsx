import React, { useState, useRef } from 'react';
import { AppID } from '../types';
import { ICONS } from '../constants';

// FIX: Updated MenuItem to be a discriminated union type. This allows for separator
// items ({ isSeparator: true }) without requiring a `label` property, which was
// causing a type error. The type guard in `renderMenu` now correctly infers the item type.
export type MenuItem =
    | {
        label: string;
        icon?: React.ReactNode | null;
        action?: () => void;
        submenu?: MenuItem[];
        isSeparator?: false | undefined;
    }
    | { isSeparator: true };

interface ContextMenuProps {
    x: number;
    y: number;
    openApp: (appId: AppID) => void;
    onRefresh: () => void;
    onNewFolder?: () => void;
    onClose: () => void;
    items?: MenuItem[];
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, openApp, onRefresh, onNewFolder, onClose, items }) => {
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    // FIX: The `useRef` hook was called without an initial value, causing an error.
    // Initialized it with `undefined` and updated the type to `number | undefined` to
    // correctly handle the state where no timer is active.
    // Fix: Initialize useRef with `undefined` to satisfy its signature (Expected 1 argument, but got 0).
    const timerRef = useRef<number | undefined>(undefined);

    const menuItems: MenuItem[] = [
        {
            label: 'New',
            icon: null,
            submenu: [
                { label: 'Folder', icon: ICONS.FOLDER, action: onNewFolder },
            ]
        },
        { isSeparator: true },
        { label: 'Personalize', icon: ICONS.SETTINGS, action: () => openApp(AppID.SETTINGS) },
        { label: 'Refresh', icon: null, action: onRefresh },
    ];
    
    const handleMouseEnter = (label: string) => {
        clearTimeout(timerRef.current);
        setOpenSubmenu(label);
    };
    
    const handleMouseLeave = () => {
        timerRef.current = window.setTimeout(() => {
            setOpenSubmenu(null);
        }, 200);
    };

    const renderMenu = (items: MenuItem[]) => (
        <ul className="bg-[#2B2B2B]/95 backdrop-blur-xl text-white shadow-[0_8px_16px_rgba(0,0,0,0.5)] border border-gray-600/50 rounded-md p-1 min-w-[180px] z-[1000] text-sm font-sans">
            {items.map((item, index) => {
                if ('label' in item) {
                    const hasSubmenu = item.submenu && item.submenu.length > 0;
                    return (
                         <li 
                            key={item.label} 
                            className="relative px-1"
                            onMouseEnter={() => hasSubmenu && handleMouseEnter(item.label)}
                            onMouseLeave={() => hasSubmenu && handleMouseLeave()}
                        >
                            <button
                                onClick={(e) => {
                                    if (item.action) {
                                        e.stopPropagation();
                                        item.action();
                                        onClose();
                                    } else if (!hasSubmenu) {
                                        e.stopPropagation();
                                        onClose();
                                    }
                                }}
                                disabled={!item.action && !hasSubmenu}
                                className="w-full flex items-center justify-between gap-2 px-2 py-1.5 hover:bg-white/10 rounded transition-colors text-left disabled:text-gray-500 disabled:hover:bg-transparent disabled:cursor-default"
                            >
                               <div className="flex items-center gap-3">
                                   <div className="w-4 h-4 flex items-center justify-center">{item.icon}</div>
                                   <span className="text-gray-100">{item.label}</span>
                               </div>
                               {hasSubmenu && <div className="w-3 h-3 text-gray-400">{ICONS.SUBMENU_ARROW_RIGHT}</div>}
                            </button>
                            {hasSubmenu && openSubmenu === item.label && (
                                <div className="absolute left-[calc(100%-4px)] top-0">
                                    {renderMenu(item.submenu!)}
                                </div>
                            )}
                        </li>
                    );
                } else {
                    return <li key={`sep-${index}`}><div className="h-[1px] bg-gray-600/50 my-1 mx-2" /></li>;
                }
            })}
        </ul>
    );

    return (
        <div
            className="absolute z-[1000] animate-fade-in"
            style={{ top: y, left: x }}
            onClick={(e) => e.stopPropagation()}
        >
            {renderMenu(items || menuItems)}
        </div>
    );
};

export default ContextMenu;