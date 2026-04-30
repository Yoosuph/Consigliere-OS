
import React, { useEffect, useState } from 'react';

export type BootState = 'booting' | 'locked' | 'login' | 'desktop';

interface BootScreenProps {
    appState: BootState;
    setAppState: (state: BootState) => void;
}


const bootLogSequence = [
    "Initializing Consigliere OS...",
    "Checking system hardware...... [OK]",
    "Loading kernel v1.0.0......... [OK]",
    "Mounting file systems......... [OK]",
    "Loading drivers:",
    "  > GPU Driver.............. [OK]",
    "  > Network Interface....... [OK]",
    "  > Input Devices........... [OK]",
    "Starting core services:",
    "  > Window Manager.......... [OK]",
    "  > Task Scheduler.......... [OK]",
    "  > Gemini AI Daemon........ [ONLINE]",
    "Finalizing setup.............. [OK]",
    "",
    "Boot sequence complete. Launching GUI...",
];


const BootScreen: React.FC<BootScreenProps> = ({ appState, setAppState }) => {
    const [bootLog, setBootLog] = useState<string[]>([]);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        if (appState === 'locked') {
            const timer = setInterval(() => setCurrentTime(new Date()), 1000);
            return () => clearInterval(timer);
        }
    }, [appState]);

    useEffect(() => {
        if (appState === 'booting') {
            const timers: number[] = [];
            
            bootLogSequence.forEach((line, index) => {
                const timer = window.setTimeout(() => {
                    setBootLog(prev => [...prev, line]);
                }, index * 150 + Math.random() * 50);
                timers.push(timer);
            });
            
            const finalTimer = window.setTimeout(() => {
                setAppState('locked');
            }, bootLogSequence.length * 150 + 500);
            timers.push(finalTimer);

            return () => timers.forEach(clearTimeout);
        }
    }, [appState, setAppState]);
    
    const handleUnlock = () => {
        setAppState('login');
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setTimeout(() => {
            setAppState('desktop');
        }, 2000);
    };

    if (appState === 'login') {
        const bgUrl = 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=1920&auto=format&fit=crop';
        return (
            <div 
                className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center animate-fade-in relative before:content-[''] before:absolute before:inset-0 before:bg-black/30 before:backdrop-blur-md"
                style={{ backgroundImage: `url(${bgUrl})` }}
            >
                <div className="relative z-10 flex flex-col items-center min-h-[300px]">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-2 border-white/20 shadow-lg">
                        <img 
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Consigliere&backgroundColor=b6e3f4" 
                            alt="User Avatar" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h2 className="text-white text-3xl font-light mb-8">Consigliere</h2>
                    
                    {isLoggingIn ? (
                        <div className="flex flex-col items-center justify-center space-y-4 h-[100px]">
                            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-white text-lg font-light tracking-wide">Welcome</span>
                        </div>
                    ) : (
                        <form onSubmit={handleLogin} className="flex flex-col items-center h-[100px]">
                            <div className="relative mb-4">
                                <input 
                                    type="password" 
                                    placeholder="PIN" 
                                    className="px-4 py-2 bg-black/20 border border-white/20 text-white placeholder-gray-300 backdrop-blur-sm rounded-none focus:outline-none focus:border-white w-64 text-center transition-colors"
                                    autoFocus
                                />
                                <button type="submit" className="absolute right-0 top-0 h-full px-3 text-white hover:bg-white/20 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-white/80 text-sm opacity-80 cursor-pointer hover:underline">Sign-in options</p>
                        </form>
                    )}
                </div>
            </div>
        );
    }

    if (appState === 'locked') {
        const bgUrl = 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=1920&auto=format&fit=crop';
        return (
            <div 
                className="h-screen w-screen bg-cover bg-center flex flex-col justify-between items-center py-24 animate-fade-in cursor-pointer select-none"
                style={{ backgroundImage: `url(${bgUrl})` }}
                onClick={handleUnlock}
            >
                <div className="text-white text-center mt-12" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                    <h1 className="text-[100px] font-medium leading-none tracking-tight">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h1>
                    <p className="text-2xl font-light mt-2">{currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
                
                <div className="text-white flex flex-col items-center opacity-70 animate-bounce mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                    </svg>
                    <span className="text-sm mt-1">Click to unlock</span>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen bg-black flex flex-col items-center justify-center font-mono p-4">
             <svg className="w-16 h-16 mb-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 12C2 7.28599 2 4.92898 3.46447 3.46447C4.92898 2 7.28599 2 12 2C16.714 2 19.071 2 20.5355 3.46447C22 4.92898 22 7.28599 22 12C22 16.714 22 19.071 20.5355 20.5355C19.071 22 16.714 22 12 22C7.28599 22 4.92898 22 3.46447 20.5355C2 19.071 2 16.714 2 12Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 2V22" stroke="currentColor" strokeWidth="2"/>
                <path d="M2 12H22" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <div className="w-full max-w-lg text-sm text-gray-300">
                {bootLog.map((line, index) => (
                     <pre key={index} className="m-0 p-0 leading-tight">{line}</pre>
                ))}
                {bootLog.length < bootLogSequence.length && <span className="w-2 h-4 bg-gray-300 animate-pulse ml-0.5 inline-block" aria-hidden="true"></span>}
            </div>
        </div>
    );
};

export default BootScreen;
