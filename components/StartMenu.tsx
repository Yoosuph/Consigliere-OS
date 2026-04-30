
import React from 'react';
import { AppID } from '../types';
import { DESKTOP_ICONS, ICONS } from '../constants';

interface StartMenuProps {
    isOpen: boolean;
    onAppClick: (id: AppID) => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onAppClick }) => {
    if (!isOpen) return null;

    const apps = DESKTOP_ICONS;

    return (
        <div className="absolute bottom-[40px] left-0 w-[600px] h-[450px] bg-[#242424]/95 backdrop-blur-md text-white shadow-2xl border border-gray-700/50 flex animate-fade-in-up z-50">
            {/* Left Rail */}
            <div className="w-[48px] h-full flex flex-col justify-between py-2 border-r border-gray-700/30">
                <div className="flex flex-col items-center gap-2">
                    <button className="w-10 h-10 hover:bg-gray-700/50 rounded flex items-center justify-center transition-colors">
                        <div className="w-4 h-4">{ICONS.APPS}</div>
                    </button>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <button className="w-10 h-10 hover:bg-gray-700/50 rounded flex items-center justify-center transition-colors" onClick={() => onAppClick(AppID.NOTEPAD)}>
                        <div className="w-6 h-6 rounded-full overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Consigliere&backgroundColor=b6e3f4" alt="User" />
                        </div>
                    </button>
                    <button className="w-10 h-10 hover:bg-gray-700/50 rounded flex items-center justify-center transition-colors" onClick={() => onAppClick(AppID.SETTINGS)}>
                        <div className="w-4 h-4">{ICONS.SETTINGS}</div>
                    </button>
                    <button className="w-10 h-10 hover:bg-gray-700/50 rounded flex items-center justify-center transition-colors" onClick={() => window.location.reload()}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v8l9-11h-7z" /></svg>
                    </button>
                </div>
            </div>

            {/* App List */}
            <div className="w-64 h-full flex flex-col pt-2 bg-[#2d2d2d]/50">
                <div className="px-4 py-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">All apps</h3>
                </div>
                <div className="overflow-y-auto h-full pb-4 custom-scrollbar">
                    <ul className="px-2">
                        {apps.map(({ id, title, icon }) => (
                            <li key={id}>
                                <button
                                    onClick={() => onAppClick(id)}
                                    className="w-full flex items-center gap-4 p-2 hover:bg-gray-700/50 transition-colors text-sm text-left"
                                >
                                    <div className="w-5 h-5 flex-shrink-0">{icon}</div>
                                    <span>{title}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Tiles Area */}
            <div className="flex-1 p-4 overflow-y-auto">
                 <h3 className="text-sm font-semibold mb-4 ml-1">Productivity</h3>
                 <div className="grid grid-cols-3 gap-2">
                     <button onClick={() => onAppClick(AppID.BROWSER)} className="bg-[#0078D7] hover:bg-[#0078D7]/80 h-24 flex flex-col items-center justify-center gap-2 transition-colors relative group">
                        <div className="w-8 h-8">{ICONS.CHROME_BROWSER}</div>
                        <span className="text-xs absolute bottom-2 left-2">Browser</span>
                     </button>
                     <button onClick={() => onAppClick(AppID.GEMINI_ASSISTANT)} className="bg-[#6B21A8] hover:bg-[#6B21A8]/80 h-24 flex flex-col items-center justify-center gap-2 transition-colors relative group">
                        <div className="w-8 h-8">{ICONS.GEMINI_ASSISTANT}</div>
                        <span className="text-xs absolute bottom-2 left-2">Gemini</span>
                     </button>
                     <button onClick={() => onAppClick(AppID.EXPLORER)} className="bg-[#2d2d2d] hover:bg-[#3d3d3d] border border-gray-600/50 h-24 flex flex-col items-center justify-center gap-2 transition-colors relative">
                        <div className="w-8 h-8">{ICONS.EXPLORER}</div>
                        <span className="text-xs absolute bottom-2 left-2">Explorer</span>
                     </button>
                 </div>

                 <h3 className="text-sm font-semibold mt-6 mb-4 ml-1">Explore</h3>
                 <div className="grid grid-cols-3 gap-2">
                     <button onClick={() => onAppClick(AppID.NOTEPAD)} className="bg-[#2d2d2d] hover:bg-[#3d3d3d] border border-gray-600/50 h-24 flex flex-col items-center justify-center gap-2 transition-colors col-span-2 relative">
                         <div className="absolute top-2 left-2 w-6 h-6">{ICONS.NOTEPAD}</div>
                         <span className="text-sm">About Me</span>
                     </button>
                     <button onClick={() => onAppClick(AppID.TERMINAL)} className="bg-[#1e1e1e] hover:bg-[#2e2e2e] h-24 flex flex-col items-center justify-center gap-2 transition-colors relative border border-gray-700">
                        <div className="w-8 h-8">{ICONS.TERMINAL}</div>
                        <span className="text-xs absolute bottom-2 left-2">Terminal</span>
                     </button>
                 </div>
            </div>
        </div>
    );
};

export default StartMenu;
