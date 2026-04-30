import React, { useState } from 'react';
import type { Notification } from '../types';
import { ICONS, APP_METADATA } from '../constants';
import { useSystem } from '../SystemContext';

interface ActionCenterProps {
    isOpen: boolean;
    notifications: Notification[];
    onDismiss: (id: string) => void;
    onClearAll: () => void;
    onClose: () => void;
}

const timeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "Just now";
};

const QuickActionButton: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center gap-2 w-[100px] h-[80px] rounded-md transition-colors text-xs border ${isActive ? 'bg-[#0078D4] border-transparent shadow-inner' : 'bg-[#2A2A2A] hover:bg-[#323232] border-[#3E3E3E]'} shadow-sm`}
        >
            <div className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-300'}`}>{icon}</div>
            <span className={isActive ? 'text-white' : 'text-gray-200'}>{label}</span>
        </button>
    );
};


const ActionCenter: React.FC<ActionCenterProps> = ({ isOpen, notifications, onDismiss, onClearAll, onClose }) => {
    const { settings, updateSettings } = useSystem();

    const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percentage = Math.round((x / rect.width) * 100);
        updateSettings({ volume: percentage });
    };

    return (
        <div
            className={`fixed right-3 bottom-12 w-[340px] flex flex-col gap-3 transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-[400px] opacity-0 pointer-events-none'}`}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Notifications Panel */}
            <div className="w-full bg-[#1C1C1C]/95 backdrop-blur-xl text-white shadow-2xl flex flex-col border border-white/10 rounded-lg max-h-[400px]">
                <div className="flex justify-between items-center p-4 pb-2 border-transparent flex-shrink-0">
                    <h2 className="font-semibold text-sm">Notifications</h2>
                    {notifications.length > 0 && (
                        <button onClick={onClearAll} className="text-xs text-gray-400 hover:text-white transition-colors">
                            Clear all
                        </button>
                    )}
                </div>
                <div className="flex-grow p-2 space-y-2 overflow-y-auto custom-scrollbar min-h-[100px]">
                    {notifications.length === 0 ? (
                        <div className="text-center text-gray-500 text-sm pt-4 pb-6">No new notifications</div>
                    ) : (
                        notifications.map(notif => (
                            <div key={notif.id} className="bg-[#2D2D2D]/90 p-3 rounded-md relative group animate-fade-in-up border border-white/5 shadow-sm">
                                <button onClick={() => onDismiss(notif.id)} className="absolute top-2 right-2 p-1 rounded hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-3 h-3 text-gray-400">{ICONS.CLOSE}</div>
                                </button>
                                <div className="flex items-center gap-3 mb-1.5">
                                    <div className="w-4 h-4 flex-shrink-0">{APP_METADATA[notif.appId].icon}</div>
                                    <h3 className="text-xs font-semibold">{notif.title}</h3>
                                </div>
                                <p className="text-xs text-gray-300 mb-2 leading-relaxed">{notif.message}</p>
                                <p className="text-[10px] text-gray-500 text-right">{timeSince(notif.timestamp)}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Quick Settings Panel */}
            <div className="w-full bg-[#1C1C1C]/95 backdrop-blur-xl text-white shadow-2xl flex flex-col border border-white/10 rounded-lg p-5">
                <div className="grid grid-cols-3 gap-2 mb-6">
                    <QuickActionButton icon={ICONS.WIFI} label="Wi-Fi" isActive={settings.wifiEnabled} onClick={() => updateSettings({ wifiEnabled: !settings.wifiEnabled })} />
                    <QuickActionButton icon={ICONS.BLUETOOTH} label="Bluetooth" isActive={settings.bluetoothEnabled} onClick={() => updateSettings({ bluetoothEnabled: !settings.bluetoothEnabled })} />
                    <QuickActionButton icon={ICONS.AIRPLANE_MODE} label="Airplane mode" isActive={settings.airplaneMode} onClick={() => updateSettings({ airplaneMode: !settings.airplaneMode })} />
                    <QuickActionButton icon={ICONS.BATTERY} label="Battery saver" isActive={settings.batterySaver} onClick={() => updateSettings({ batterySaver: !settings.batterySaver })} />
                    <QuickActionButton icon={ICONS.NIGHT_LIGHT} label="Night light" isActive={settings.nightLight} onClick={() => updateSettings({ nightLight: !settings.nightLight })} />
                    <QuickActionButton icon={ICONS.VPN} label="VPN" isActive={settings.vpnEnabled} onClick={() => updateSettings({ vpnEnabled: !settings.vpnEnabled })} />
                </div>
                
                <div className="flex items-center gap-4 px-2">
                    <div className="w-4 h-4 text-gray-400">{ICONS.SOUND}</div>
                    <div className="relative w-full h-1 bg-gray-600 rounded-full cursor-pointer" onClick={handleVolumeChange}>
                        <div className="absolute top-0 left-0 h-full bg-[#0078D4] rounded-full pointe-events-none" style={{ width: `${settings.volume}%` }}></div>
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow border-2 border-[#1C1C1C] pointer-events-none" style={{ left: `${settings.volume}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionCenter;
