import React, { createContext, useContext, useState } from 'react';

export interface SystemSettings {
    wifiEnabled: boolean;
    bluetoothEnabled: boolean;
    airplaneMode: boolean;
    batterySaver: boolean;
    nightLight: boolean;
    vpnEnabled: boolean;
    volume: number;
    brightness: number;
    theme: 'dark' | 'light';
    deviceName: string;
}

interface SystemContextType {
    settings: SystemSettings;
    updateSettings: (newSettings: Partial<SystemSettings>) => void;
}

export const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<SystemSettings>({
        wifiEnabled: true,
        bluetoothEnabled: false,
        airplaneMode: false,
        batterySaver: false,
        nightLight: false,
        vpnEnabled: false,
        volume: 75,
        brightness: 80,
        theme: 'dark',
        deviceName: 'Consigliere-PC',
    });

    const updateSettings = (newSettings: Partial<SystemSettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    return (
        <SystemContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SystemContext.Provider>
    );
};

export const useSystem = () => {
    const context = useContext(SystemContext);
    if (!context) throw new Error('useSystem must be used within a SystemProvider');
    return context;
};
