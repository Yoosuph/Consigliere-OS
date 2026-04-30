import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ICONS, PROJECTS_DATA } from '../../constants';
import type { Project } from '../../types';

interface Tab {
  id: string;
  url: string;
  title: string;
  history: string[];
  historyIndex: number;
  isLoading: boolean;
  faviconUrl: string;
}

const getFaviconUrl = (url: string): string => {
    if (url.startsWith('os://')) return '';
    try {
        const urlObj = new URL(url);
        return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=16`;
    } catch (error) {
        return '';
    }
};

const NewTabPage: React.FC<{ onSearch: (query: string) => void, onNavigate: (url: string) => void }> = ({ onSearch, onNavigate }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="h-full w-full bg-[#202124] flex flex-col items-center justify-center text-white p-8 overflow-y-auto">
        <div className="w-24 h-24 mb-6 flex-shrink-0 text-gray-400">{ICONS.CHROME_BROWSER}</div>
        <form onSubmit={handleSubmit} className="w-full max-w-xl mb-12 flex-shrink-0">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search DuckDuckGo or type a URL"
                className="w-full px-5 py-3 rounded-full bg-[#303134] border border-gray-500/50 hover:bg-[#38393c] focus:bg-[#38393c] focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
        </form>
        <div className="w-full max-w-xl">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {PROJECTS_DATA.filter(p => p.url).map(project => (
                    <button 
                        key={project.id} 
                        onClick={() => onNavigate(project.url!)} 
                        className="p-2 flex flex-col items-center justify-center group"
                    >
                        <div className="w-12 h-12 flex items-center justify-center bg-[#303134] group-hover:bg-[#38393c] rounded-full text-yellow-500 transition-colors mb-2">
                           <div className="w-6 h-6">{project.type === 'Folder' ? ICONS.FOLDER : ICONS.FILE}</div>
                        </div>
                        <p className="text-xs text-gray-300 truncate w-full text-center">{project.name}</p>
                    </button>
                ))}
            </div>
        </div>
        <p className="text-xs text-gray-500 mt-auto pt-4 flex-shrink-0">
            Note: Some websites may not load due to security restrictions (X-Frame-Options).
        </p>
    </div>
  );
};

const createNewTab = (id: string): Tab => ({
    id,
    url: 'os://new-tab',
    title: 'New Tab',
    history: ['os://new-tab'],
    historyIndex: 0,
    isLoading: false,
    faviconUrl: '',
});

const ChromeBrowser: React.FC = () => {
    const [tabs, setTabs] = useState<Tab[]>([createNewTab('0')]);
    const [activeTabId, setActiveTabId] = useState('0');
    const [addressBarInput, setAddressBarInput] = useState('');
    const nextTabId = useRef(1);
    const iframeRefs = useRef<{ [key: string]: HTMLIFrameElement | null }>({});

    const activeTab = tabs.find(t => t.id === activeTabId);

    useEffect(() => {
        if (activeTab) {
            setAddressBarInput(activeTab.url === 'os://new-tab' ? '' : activeTab.url);
        }
    }, [activeTab]);
    
    const handleAddTab = () => {
        const newTabId = `${nextTabId.current++}`;
        const newTab = createNewTab(newTabId);
        setTabs([...tabs, newTab]);
        setActiveTabId(newTabId);
    };

    const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
        e.stopPropagation();
        
        const closingTabIndex = tabs.findIndex(t => t.id === tabId);
        let newTabs = tabs.filter(t => t.id !== tabId);
        
        if (newTabs.length === 0) {
            const newTab = createNewTab(`${nextTabId.current++}`);
            setTabs([newTab]);
            setActiveTabId(newTab.id);
            return;
        }

        if (activeTabId === tabId) {
            const newActiveTab = newTabs[closingTabIndex] || newTabs[closingTabIndex - 1] || newTabs[0];
            setActiveTabId(newActiveTab.id);
        }
        
        setTabs(newTabs);
        delete iframeRefs.current[tabId];
    };
    
    const navigateTab = useCallback((tabId: string, newUrl: string) => {
        let finalUrl = newUrl.trim();
        if (!finalUrl) return;

        const isUrl = finalUrl.includes('.') && !finalUrl.includes(' ');
        if (isUrl) {
            if (!/^https?:\/\//i.test(finalUrl)) {
                finalUrl = 'https://' + finalUrl;
            }
        } else {
            finalUrl = `https://duckduckgo.com/?q=${encodeURIComponent(finalUrl)}`;
        }
        
        setTabs(prevTabs => prevTabs.map(tab => {
            if (tab.id === tabId) {
                const newHistory = tab.history.slice(0, tab.historyIndex + 1);
                newHistory.push(finalUrl);

                return {
                    ...tab,
                    url: finalUrl,
                    title: new URL(finalUrl).hostname,
                    isLoading: true,
                    faviconUrl: getFaviconUrl(finalUrl),
                    history: newHistory,
                    historyIndex: newHistory.length - 1,
                };
            }
            return tab;
        }));
    }, []);

    const handleNavigate = (url: string) => {
        if (activeTabId) {
            navigateTab(activeTabId, url);
        }
    };

    const handleAddressBarSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleNavigate(addressBarInput);
    };

    const handleIframeLoad = (tabId: string) => {
        try {
            setTabs(prevTabs => prevTabs.map(t => t.id === tabId ? { ...t, isLoading: false } : t));
            const iframe = iframeRefs.current[tabId];
            if (iframe && iframe.contentWindow && iframe.contentDocument) {
                const newTitle = iframe.contentDocument.title;
                 if (newTitle && newTitle.trim() !== '') {
                    setTabs(prevTabs => prevTabs.map(t => t.id === tabId ? { ...t, title: newTitle } : t));
                }
            }
        } catch (error) {
            setTabs(prevTabs => prevTabs.map(t => t.id === tabId ? { ...t, isLoading: false } : t));
        }
    };

    const go = (direction: 'back' | 'forward') => {
        if (!activeTab) return;
        const newIndex = activeTab.historyIndex + (direction === 'back' ? -1 : 1);
        if (newIndex >= 0 && newIndex < activeTab.history.length) {
            const newUrl = activeTab.history[newIndex];
            setTabs(prevTabs => prevTabs.map(tab => {
                if (tab.id === activeTabId) {
                    return { ...tab, historyIndex: newIndex, url: newUrl, isLoading: true };
                }
                return tab;
            }));
        }
    };

    const handleBack = () => go('back');
    const handleForward = () => go('forward');
    const handleReload = () => {
        if (activeTabId && activeTab && !activeTab.isLoading && activeTab.url !== 'os://new-tab') {
            const iframe = iframeRefs.current[activeTabId];
            if (iframe) {
                setTabs(prevTabs => prevTabs.map(t => t.id === activeTabId ? { ...t, isLoading: true } : t));
                iframe.src = 'about:blank';
                setTimeout(() => { iframe.src = activeTab.url; }, 0);
            }
        }
    };
    
    const canGoBack = activeTab ? activeTab.historyIndex > 0 : false;
    const canGoForward = activeTab ? activeTab.historyIndex < activeTab.history.length - 1 : false;

    return (
        <div className="h-full w-full bg-[#202124] flex flex-col text-white">
            <header className="bg-[#35363A] flex-shrink-0 pt-2 flex flex-col">
                <div className="flex items-end px-2">
                    {tabs.map(tab => {
                        const isActive = activeTabId === tab.id;
                        return (
                            <div
                                key={tab.id}
                                onClick={() => setActiveTabId(tab.id)}
                                className={`flex items-center justify-between gap-2 max-w-[200px] h-9 px-3 cursor-pointer group relative ${
                                    isActive 
                                    ? 'bg-[#202124]' 
                                    : 'hover:bg-[#4A4B50]'
                                }`}
                                style={{
                                    clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)',
                                    paddingLeft: '18px',
                                    paddingRight: '18px',
                                }}
                            >
                                {!isActive && <div className="absolute top-1/2 -translate-y-1/2 left-0 w-px h-5 bg-gray-900/50 group-first:hidden" />}
                                <div className="w-4 h-4 flex-shrink-0">
                                    {tab.isLoading ? (
                                    ICONS.LOADING_SPINNER
                                    ) : tab.faviconUrl ? (
                                    <img src={tab.faviconUrl} alt="" className="w-full h-full" />
                                    ) : (
                                    <div className="w-full h-full text-gray-400">{ICONS.BROWSER}</div>
                                    )}
                                </div>
                                <span className="text-xs truncate">{tab.title}</span>
                                <button onClick={(e) => handleCloseTab(e, tab.id)} className="p-0.5 rounded-full hover:bg-white/20 flex-shrink-0">
                                    <div className="w-4 h-4">{ICONS.CLOSE}</div>
                                </button>
                                {!isActive && <div className="absolute top-1/2 -translate-y-1/2 right-0 w-px h-5 bg-gray-900/50 group-last:hidden" />}
                                
                                {isActive && <div className="absolute -bottom-px left-0 right-0 h-px bg-[#202124] z-10" />}
                            </div>
                        );
                    })}
                    <button onClick={handleAddTab} className="p-2 mb-1 rounded-full hover:bg-white/20">{ICONS.PLUS}</button>
                </div>
                <div className="h-10 bg-[#202124] flex items-center gap-2 px-3 border-b border-gray-900/50">
                    <button onClick={handleBack} disabled={!canGoBack} className="p-1 rounded-full hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent text-gray-300">
                        {ICONS.ARROW_LEFT}
                    </button>
                    <button onClick={handleForward} disabled={!canGoForward} className="p-1 rounded-full hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent text-gray-300">
                        {ICONS.ARROW_RIGHT}
                    </button>
                    <button onClick={handleReload} disabled={!activeTab || activeTab.isLoading || activeTab.url === 'os://new-tab'} className="p-1 rounded-full hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent text-gray-300">
                        {ICONS.RELOAD}
                    </button>
                    <form onSubmit={handleAddressBarSubmit} className="flex-grow">
                        <input
                            type="text"
                            value={addressBarInput}
                            onChange={(e) => setAddressBarInput(e.target.value)}
                            onFocus={(e) => e.target.select()}
                            className="w-full h-8 px-3 rounded-full bg-[#303134] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </form>
                </div>
            </header>
            <main className="flex-grow bg-black">
                {tabs.map(tab => (
                    <div key={tab.id} className="h-full w-full" style={{ display: activeTabId === tab.id ? 'block' : 'none' }}>
                        {tab.url === 'os://new-tab' ? (
                            <NewTabPage onSearch={handleNavigate} onNavigate={handleNavigate} />
                        ) : (
                            <iframe
                                // FIX: The ref callback function must return `void`. By using parentheses `()`, the result of the assignment `(iframeRefs.current[tab.id] = el)` was being returned, causing a type error. Changed to curly braces `{}` to create a function body that correctly returns `void`.
                                ref={el => { iframeRefs.current[tab.id] = el; }}
                                src={tab.url}
                                title={tab.title}
                                className="w-full h-full border-none bg-white"
                                onLoad={() => handleIframeLoad(tab.id)}
                                sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
                            />
                        )}
                    </div>
                ))}
            </main>
        </div>
    );
};

export default ChromeBrowser;