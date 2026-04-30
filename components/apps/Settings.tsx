import React, { useState, useEffect } from 'react';
import { WALLPAPERS, ICONS, APP_METADATA } from '../../constants';
import { useSystem } from '../../SystemContext';

interface SettingsProps {
    setWallpaper: (url: string) => void;
}

type Category = 'System' | 'Bluetooth' | 'Network' | 'Personalization' | 'Apps' | 'Accounts' | 'Time & Language';

const categories: { id: Category, icon: React.ReactNode, label: string }[] = [
    { id: 'System', icon: ICONS.PC, label: 'System' },
    { id: 'Bluetooth', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 15.364L9.75 19.864m0 0L5.25 15.364m4.5 4.5V4.136m0 0L14.25 8.636m0 0L9.75 13.136" /></svg>, label: 'Bluetooth & devices' },
    { id: 'Network', icon: ICONS.WIFI, label: 'Network & internet' },
    { id: 'Personalization', icon: ICONS.PERSONALIZATION, label: 'Personalization' },
    { id: 'Apps', icon: ICONS.APPS, label: 'Apps' },
    { id: 'Accounts', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>, label: 'Accounts' },
    { id: 'Time & Language', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label: 'Time & language' },
];

const Toggle: React.FC<{ checked: boolean; onChange: (val: boolean) => void }> = ({ checked, onChange }) => (
    <div 
        className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${checked ? 'bg-blue-500' : 'bg-gray-600'}`}
        onClick={() => onChange(!checked)}
    >
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
    </div>
);

const PersonalizationPanel: React.FC<{ setWallpaper: (url: string) => void }> = ({ setWallpaper }) => (
    <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl font-semibold mb-6">Personalization</h2>
        <div className="bg-[#2D2D2D] p-6 rounded-lg border border-white/5 space-y-4">
            <h3 className="text-lg font-medium">Background</h3>
            <p className="text-gray-400 text-sm mb-4">Select a background image for your desktop.</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {WALLPAPERS.map((wallpaper, idx) => (
                    <div 
                        key={wallpaper.id} 
                        className="cursor-pointer group relative rounded-md overflow-hidden" 
                        onClick={() => setWallpaper(wallpaper.url)}
                    >
                        <img
                            src={wallpaper.url}
                            alt={`Wallpaper ${wallpaper.id}`}
                            className="w-full h-28 object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500 rounded-md pointer-events-none transition-colors"></div>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-[#2D2D2D] p-6 rounded-lg border border-white/5 space-y-4">
            <h3 className="text-lg font-medium">Colors</h3>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
                <div>
                    <p className="text-sm">Choose your mode</p>
                    <p className="text-xs text-gray-400">Dark mode is currently preferred</p>
                </div>
                <select className="bg-[#1e1e1e] border border-white/10 rounded px-3 py-1 text-sm focus:outline-none focus:border-blue-500" disabled>
                    <option>Dark</option>
                    <option>Light</option>
                </select>
            </div>
        </div>
    </div>
);

const SystemPanel: React.FC = () => {
    const { settings, updateSettings } = useSystem();
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(settings.deviceName);

    const handleRename = () => {
        if (newName.trim()) {
            updateSettings({ deviceName: newName.trim() });
        } else {
            setNewName(settings.deviceName);
        }
        setIsRenaming(false);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-semibold mb-6">System</h2>
            
            <div className="bg-[#2D2D2D] p-6 rounded-lg border border-white/5 flex gap-6 items-center">
                <div className="w-24 h-24 bg-blue-500/20 rounded-md flex items-center justify-center border border-blue-500/30">
                    <div className="w-12 h-12 text-blue-400">{ICONS.PC}</div>
                </div>
                <div>
                    {isRenaming ? (
                        <div className="flex items-center gap-2 mb-1">
                            <input 
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="bg-[#1e1e1e] border border-blue-500 rounded px-2 py-1 text-xl font-medium focus:outline-none focus:border-blue-400"
                                autoFocus
                                onBlur={handleRename}
                                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                            />
                            <button onClick={handleRename} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm transition-colors">Save</button>
                        </div>
                    ) : (
                        <h3 className="text-2xl font-medium mb-1">{settings.deviceName}</h3>
                    )}
                    <p className="text-sm text-gray-400">Consigliere OS build 22621.ni_release.220506-1250</p>
                    {!isRenaming && (
                        <div className="mt-2 text-sm text-blue-400 cursor-pointer hover:underline" onClick={() => setIsRenaming(true)}>Rename</div>
                    )}
                </div>
            </div>

            <div className="bg-[#2D2D2D] p-0 rounded-lg border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-5 h-5 text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" /></svg></div>
                        <div>
                            <p className="text-sm font-medium">Display</p>
                            <p className="text-xs text-gray-400">Night light: {settings.nightLight ? 'On' : 'Off'}</p>
                        </div>
                    </div>
                    <Toggle checked={settings.nightLight} onChange={(v) => updateSettings({ nightLight: v })} />
                </div>
                <div className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-5 h-5 text-gray-400">{ICONS.SOUND}</div>
                        <div>
                            <p className="text-sm font-medium">Sound</p>
                            <p className="text-xs text-gray-400">Volume: {settings.volume}%</p>
                        </div>
                    </div>
                    <div className="w-32 relative h-1 bg-gray-600 rounded-full cursor-pointer" onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                        const percentage = Math.round((x / rect.width) * 100);
                        updateSettings({ volume: percentage });
                    }}>
                        <div className="absolute top-0 left-0 h-full bg-[#0078D4] rounded-full pointer-events-none" style={{ width: `${settings.volume}%` }}></div>
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow pointer-events-none" style={{ left: `${settings.volume}%` }}></div>
                    </div>
                </div>
                <div className="flex items-center justify-between p-4 hover:bg-white/5 cursor-pointer transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-5 h-5 text-gray-400">{ICONS.BATTERY}</div>
                        <div>
                            <p className="text-sm font-medium">Power & battery</p>
                            <p className="text-xs text-gray-400">Battery saver: {settings.batterySaver ? 'On' : 'Off'}</p>
                        </div>
                    </div>
                    <Toggle checked={settings.batterySaver} onChange={(v) => updateSettings({ batterySaver: v })} />
                </div>
            </div>

            <div className="bg-[#2D2D2D] p-6 rounded-lg border border-white/5 space-y-4">
                <h3 className="text-lg font-medium">Device specifications</h3>
                <div className="grid grid-cols-[150px_1fr] gap-y-2 text-sm">
                    <div className="text-gray-400">Processor</div>
                    <div>Intel(R) Core(TM) i9-13900K @ 3.00 GHz</div>
                    <div className="text-gray-400">Installed RAM</div>
                    <div>64.0 GB (63.8 GB usable)</div>
                    <div className="text-gray-400">System type</div>
                    <div>64-bit operating system, x64-based processor</div>
                    <div className="text-gray-400">Pen and touch</div>
                    <div>No pen or touch input is available for this display</div>
                </div>
            </div>
        </div>
    );
};

const NetworkPanel: React.FC = () => {
    const { settings, updateSettings } = useSystem();
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-semibold mb-6">Network & internet</h2>
            <div className="bg-[#2D2D2D] p-6 rounded-lg border border-white/5 flex gap-6 items-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                    <div className="w-8 h-8 text-blue-400">{ICONS.WIFI}</div>
                </div>
                <div>
                    <h3 className="text-2xl font-medium mb-1">Wi-Fi</h3>
                    <p className="text-sm text-gray-400">{settings.wifiEnabled ? 'Connected, secured' : 'Not connected'}</p>
                </div>
            </div>

            <div className="bg-[#2D2D2D] p-0 rounded-lg border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-5 h-5 text-gray-400">{ICONS.WIFI}</div>
                        <div>
                            <p className="text-sm font-medium">Wi-Fi</p>
                            <p className="text-xs text-gray-400">Connect, manage known networks</p>
                        </div>
                    </div>
                    <Toggle checked={settings.wifiEnabled} onChange={(v) => updateSettings({ wifiEnabled: v })} />
                </div>
                <div className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-5 h-5 text-gray-400">{ICONS.AIRPLANE_MODE}</div>
                        <div>
                            <p className="text-sm font-medium">Airplane mode</p>
                            <p className="text-xs text-gray-400">Stop all wireless communication</p>
                        </div>
                    </div>
                    <Toggle checked={settings.airplaneMode} onChange={(v) => updateSettings({ airplaneMode: v, wifiEnabled: v ? false : settings.wifiEnabled, bluetoothEnabled: v ? false : settings.bluetoothEnabled })} />
                </div>
                <div className="flex items-center justify-between p-4 hover:bg-white/5 cursor-pointer transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-5 h-5 text-gray-400">{ICONS.VPN}</div>
                        <div>
                            <p className="text-sm font-medium">VPN</p>
                            <p className="text-xs text-gray-400">Add, connect, manage</p>
                        </div>
                    </div>
                    <Toggle checked={settings.vpnEnabled} onChange={(v) => updateSettings({ vpnEnabled: v })} />
                </div>
            </div>
        </div>
    );
};

const BluetoothPanel: React.FC = () => {
    const { settings, updateSettings } = useSystem();
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-semibold mb-6">Bluetooth & devices</h2>
            
            <div className="bg-[#2D2D2D] p-0 rounded-lg border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between p-6 hover:bg-white/5 cursor-pointer transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-6 h-6 text-blue-400"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 15.364L9.75 19.864m0 0L5.25 15.364m4.5 4.5V4.136m0 0L14.25 8.636m0 0L9.75 13.136" /></svg></div>
                        <div>
                            <p className="text-base font-medium">Bluetooth</p>
                            <p className="text-sm text-gray-400">{settings.bluetoothEnabled ? 'Discoverable as "Consigliere-PC"' : 'Turned off'}</p>
                        </div>
                    </div>
                    <Toggle checked={settings.bluetoothEnabled} onChange={(v) => updateSettings({ bluetoothEnabled: v })} />
                </div>
            </div>

            <div className="bg-[#2D2D2D] p-6 rounded-lg border border-white/5 space-y-4">
                <h3 className="text-lg font-medium">Audio</h3>
                <div className="p-4 border border-white/10 rounded-md flex items-center justify-between bg-black/20">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full">{ICONS.SOUND}</div>
                        <div>
                            <p className="font-medium text-sm">Sony WH-1000XM4</p>
                            <p className="text-xs text-gray-400">{settings.bluetoothEnabled ? 'Paired' : 'Bluetooth is off'}</p>
                        </div>
                    </div>
                    <button className="px-3 py-1 bg-[#3A3A3A] hover:bg-[#4A4A4A] rounded text-sm transition-colors" disabled={!settings.bluetoothEnabled}>Connect</button>
                </div>
                <div className="p-4 border border-white/10 rounded-md flex items-center justify-between bg-black/20">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full">{ICONS.SOUND}</div>
                        <div>
                            <p className="font-medium text-sm">AirPods Pro</p>
                            <p className="text-xs text-gray-400">{settings.bluetoothEnabled ? 'Not connected' : 'Bluetooth is off'}</p>
                        </div>
                    </div>
                    <button className="px-3 py-1 bg-[#3A3A3A] hover:bg-[#4A4A4A] rounded text-sm transition-colors" disabled={!settings.bluetoothEnabled}>Connect</button>
                </div>
            </div>
        </div>
    );
};

const AppsPanel: React.FC = () => (
    <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl font-semibold mb-6">Installed apps</h2>
        <div className="bg-[#2D2D2D] p-4 rounded-lg border border-white/5 space-y-2">
            {Object.values(APP_METADATA).map((app, index) => (
                <div key={index} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-md transition-colors border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 flex-shrink-0">{app.icon}</div>
                        <div>
                            <p className="text-base font-medium">{app.title}</p>
                            <p className="text-xs text-gray-400">System App • {(12.4 + index * 3.2).toFixed(1)} MB</p>
                        </div>
                    </div>
                    <button className="px-3 py-1 bg-[#3A3A3A] hover:bg-[#4A4A4A] rounded text-sm transition-colors disabled:opacity-50" disabled>Uninstall</button>
                </div>
            ))}
        </div>
    </div>
);

const AccountsPanel: React.FC = () => {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-semibold mb-6">Accounts</h2>
            <div className="bg-[#2D2D2D] p-6 rounded-lg border border-white/5 flex gap-6 items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20">
                    <img 
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Consigliere&backgroundColor=b6e3f4" 
                        alt="User Profile" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h3 className="text-2xl font-medium mb-1">Consigliere</h3>
                    <p className="text-sm text-gray-400 mb-2">Administrator • Local Account</p>
                    <button className="px-4 py-1.5 bg-[#3A3A3A] hover:bg-[#4A4A4A] rounded text-sm transition-colors">Manage my accounts</button>
                </div>
            </div>
            <div className="bg-[#2D2D2D] p-6 rounded-lg border border-white/5 space-y-4">
                <h3 className="text-lg font-medium">Sign-in options</h3>
                <div className="space-y-2">
                    <div className="p-4 border border-white/10 rounded-md flex items-center gap-4 bg-black/20">
                        <div className="w-6 h-6 text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg></div>
                        <div>
                            <p className="font-medium text-sm">Password</p>
                            <p className="text-xs text-gray-400">Sign in with your account's password</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TimeLanguagePanel: React.FC = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-semibold mb-6">Time & language</h2>
            <div className="bg-[#2D2D2D] p-6 rounded-lg border border-white/5 space-y-4">
                <h3 className="text-5xl font-light mb-1">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</h3>
                <p className="text-lg text-gray-400">{time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>

            <div className="bg-[#2D2D2D] p-0 rounded-lg border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <div>
                        <p className="text-sm font-medium">Set time automatically</p>
                    </div>
                    <Toggle checked={true} onChange={() => {}} />
                </div>
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <div>
                        <p className="text-sm font-medium">Time zone</p>
                        <p className="text-xs text-gray-400">(UTC) Coordinated Universal Time</p>
                    </div>
                </div>
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <div className="flex flex-col gap-1 w-full">
                        <p className="text-sm font-medium">Region</p>
                        <select className="bg-[#1e1e1e] border border-white/10 rounded px-3 py-1.5 text-sm w-full max-w-sm focus:border-blue-500">
                            <option>United States</option>
                            <option>United Kingdom</option>
                            <option>Canada</option>
                            <option>Australia</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Settings: React.FC<SettingsProps> = ({ setWallpaper }) => {
    const [activeCategory, setActiveCategory] = useState<Category>('System');

    const renderContent = () => {
        switch(activeCategory) {
            case 'Personalization':
                return <PersonalizationPanel setWallpaper={setWallpaper} />;
            case 'System':
                return <SystemPanel />;
            case 'Apps':
                return <AppsPanel />;
            case 'Bluetooth':
                return <BluetoothPanel />;
            case 'Network':
                return <NetworkPanel />;
            case 'Accounts':
                return <AccountsPanel />;
            case 'Time & Language':
                return <TimeLanguagePanel />;
            default:
                return null;
        }
    };

    return (
        <div className="h-full flex text-white bg-[#202020] font-sans">
            <aside className="w-[300px] bg-[#202020] p-4 flex-shrink-0 flex flex-col border-r border-[#303030]">
                <div className="flex items-center gap-3 mb-8 px-2 mt-4 cursor-pointer" onClick={() => setActiveCategory('Accounts')}>
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20">
                        <img 
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Consigliere&backgroundColor=b6e3f4" 
                            alt="User Profile" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Consigliere</p>
                        <p className="text-xs text-gray-400">Local Account</p>
                    </div>
                </div>

                <div className="relative mb-6">
                    <input 
                        type="text" 
                        placeholder="Find a setting" 
                        className="w-full bg-[#353535] border border-white/10 rounded-md py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <div className="absolute right-2 top-0 h-full flex items-center pointer-events-none text-gray-400">
                        <div className="w-4 h-4">{ICONS.SEARCH}</div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    <ul className="space-y-1">
                        {categories.map(({ id, icon, label }) => (
                            <li key={id}>
                                <button
                                    onClick={() => setActiveCategory(id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-left transition-colors relative ${
                                        activeCategory === id ? 'bg-[#353535]' : 'hover:bg-[#2A2A2A]'
                                    }`}
                                >
                                    {activeCategory === id && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 bg-blue-500 rounded-r-full"></div>}
                                    <div className={`w-5 h-5 flex-shrink-0 ${activeCategory === id ? 'text-blue-400' : 'text-gray-300'}`}>
                                        {icon}
                                    </div>
                                    <span className={activeCategory === id ? 'font-medium' : ''}>{label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            <main className="flex-1 p-10 overflow-y-auto bg-[#1a1a1a]">
                {renderContent()}
            </main>
        </div>
    );
};

export default Settings;