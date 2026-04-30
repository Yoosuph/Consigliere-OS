import React, { useState, useRef, useCallback, useLayoutEffect, useEffect } from 'react';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import Window from './components/Window';
import ContextMenu from './components/ContextMenu';
import BootScreen from './components/BootScreen';
import TaskbarPreview from './components/TaskbarPreview';
import ActionCenter from './components/ActionCenter';
import { BootState } from './components/BootScreen';
import { AppID } from './types';
import type { WindowInstance, Notification, FileSystemItem } from './types';
import { APP_METADATA, DESKTOP_ICONS, ICONS } from './constants';
import { cloneDeep, findNodeByPath } from './utils';

// Import app components
import ChromeBrowser from './components/apps/ChromeBrowser';
import Notepad from './components/apps/Notepad';
import Explorer from './components/apps/Explorer';
import GeminiAssistant from './components/apps/GeminiAssistant';
import RecycleBin from './components/apps/RecycleBin';
import Settings from './components/apps/Settings';
import Terminal from './components/apps/Terminal';

const initialFileSystem: FileSystemItem = {
    id: 'root',
    name: 'This PC',
    type: 'folder',
    modified: '2023-10-27',
    children: [
        {
            id: 'about-folder',
            name: 'about',
            type: 'folder',
            modified: new Date().toISOString().split('T')[0],
            children: [
                {
                    id: 'me-file',
                    name: 'me',
                    type: 'file',
                    modified: new Date().toISOString().split('T')[0],
                    size: '1 KB',
                    content: `Cybersecurity specialist | Web & Software Developer | Researcher
5+ years of experience building secure systems, apps, and awareness campaigns.
Graduate of Agricultural Economics & Extension, Federal University Dutse, Nigeria.
Currently at Defenhub.ng | Mixing tech, research, and strategy.`
                }
            ]
        },
        {
            id: 'philosophy-file',
            name: 'philosophy',
            type: 'file',
            modified: new Date().toISOString().split('T')[0],
            size: '1 KB',
            content: `Lifelong learner.  
Deep interests: Philosophy, Physics, Coding.  
Mission: Become a polymath.  
Belief: "Knowledge is infinite; curiosity is the terminal command."`
        },
        { 
            id: 'docs', 
            name: 'Documents', 
            type: 'folder', 
            modified: '2023-10-27', 
            children: [
                { id: 'doc-1', name: 'resume.pdf', type: 'file', size: '128 KB', modified: '2023-10-27' },
                { id: 'doc-2', name: 'project-notes.txt', type: 'file', size: '2 KB', modified: '2023-10-24', content: 'Project Alpha: Needs more tests.\nProject Beta: Ready for deployment.' },
                {
                    id: 'work',
                    name: 'Work',
                    type: 'folder',
                    modified: '2023-09-12',
                    children: [
                        { id: 'work-1', name: 'quarterly-report.docx', type: 'file', size: '78 KB', modified: '2023-09-11' }
                    ]
                }
            ] 
        },
        { id: 'downloads', name: 'Downloads', type: 'folder', modified: '2023-10-26', children: [] },
        { id: 'pictures', name: 'Pictures', type: 'folder', modified: '2023-10-25', children: [] },
        { id: 'music', name: 'Music', type: 'folder', modified: '2023-08-01', children: [] },
        { id: 'videos', name: 'Videos', type: 'folder', modified: '2023-09-15', children: [] },
        { id: 'desktop-folder', name: 'Desktop', type: 'folder', modified: '2023-10-27', children: [] },
    ]
};


interface DesktopIconState {
  id: string;
  title: string;
  icon: React.ReactNode;
  position: { x: number; y: number };
  isFileSystemItem?: boolean;
}

interface RenamingInfo {
    path: string[];
    id: string;
}

// Helper for recursive ID update needed for copying folders
const updateIds = (item: FileSystemItem, idCounter: React.MutableRefObject<number>): FileSystemItem => {
    const newItem: FileSystemItem = { ...item, id: `item-${idCounter.current++}` };
    if (newItem.type === 'folder' && newItem.children) {
        newItem.children = newItem.children.map(child => updateIds(child, idCounter));
    }
    return newItem;
};


const AppContent: React.FC = () => {
    const [windows, setWindows] = useState<WindowInstance[]>([]);
    const [icons, setIcons] = useState<DesktopIconState[]>(() =>
        DESKTOP_ICONS.map((icon, index) => ({
            ...icon,
            position: { x: 16, y: 16 + index * 100 }, // Initial stacked position
        }))
    );
    const [nextZIndex, setNextZIndex] = useState(10);
    const [wallpaper, setWallpaper] = useState('https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=1920&auto=format&fit=crop');
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
    const [isStartMenuOpen, setStartMenuOpen] = useState(false);
    const [preview, setPreview] = useState<{ windowId: string; targetRect: DOMRect } | null>(null);
    const desktopAreaRef = useRef<HTMLDivElement>(null);
    const nextWindowId = useRef(0);
    const nextItemId = useRef(100);
    const previewTimerRef = useRef<number | null>(null);
    
    const [isActionCenterOpen, setIsActionCenterOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const nextNotificationId = useRef(0);
    
    const [fileSystem, setFileSystem] = useState<FileSystemItem>(initialFileSystem);
    const [renamingInfo, setRenamingInfo] = useState<RenamingInfo | null>(null);

    const taskbarIconRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());
    const [taskbarIconRects, setTaskbarIconRects] = useState<Record<string, DOMRect>>({});

    const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
        const newNotification: Notification = {
            ...notification,
            id: `notif-${nextNotificationId.current++}`,
            timestamp: new Date(),
        };
        setNotifications(prev => [newNotification, ...prev].slice(0, 10)); // Keep max 10 notifications
    }, []);
    
    const dismissNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const clearAllNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    const toggleActionCenter = useCallback(() => {
        setIsActionCenterOpen(prev => !prev);
        if (isStartMenuOpen) setStartMenuOpen(false);
    }, [isStartMenuOpen]);
    
    useEffect(() => {
        const timer1 = setTimeout(() => addNotification({ appId: AppID.GEMINI_ASSISTANT, title: 'Welcome!', message: 'The AI Assistant is online and ready to help.' }), 1000);
        const timer2 = setTimeout(() => addNotification({ appId: AppID.SETTINGS, title: 'System Tip', message: 'You can change your wallpaper in the Settings app.' }), 3000);
        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, [addNotification]);
    
    const changeWallpaper = useCallback((url: string) => {
        setWallpaper(url);
        addNotification({ appId: AppID.SETTINGS, title: 'Personalization', message: 'Desktop wallpaper changed.' });
    }, [addNotification]);


    const calculateIconLayout = useCallback(() => {
        if (!desktopAreaRef.current) return;
        const iconWidth = 84, iconHeight = 92, horizontalPadding = 12, verticalPadding = 12;
        const desktopHeight = desktopAreaRef.current.clientHeight;
        if (desktopHeight <= 0) return;
        const effectiveIconHeight = iconHeight + verticalPadding;
        const availableHeight = desktopHeight - (verticalPadding * 2);
        const iconsPerColumn = Math.max(1, Math.floor(availableHeight / effectiveIconHeight));
        
        let fileSystemIcons: DesktopIconState[] = [];
        const desktopFolder = findNodeByPath(fileSystem, ['This PC', 'Desktop']);
        if (desktopFolder && desktopFolder.children) {
            fileSystemIcons = desktopFolder.children.map(item => ({
                id: `fs-${item.id}`,
                title: item.name,
                icon: item.type === 'folder' ? ICONS.FOLDER : (item.name.endsWith('.txt') || item.name.endsWith('.md') ? ICONS.FILE_TEXT : ICONS.FILE),
                position: { x: 0, y: 0 },
                isFileSystemItem: true
            }));
        }
        
        const allIcons = [...DESKTOP_ICONS.map(i => ({ ...i, id: i.id as string })), ...fileSystemIcons];

        setIcons(prev => {
            return allIcons.map((icon, index) => {
                const existing = prev.find(p => p.id === icon.id);
                if (existing) {
                    return { ...icon, position: existing.position, title: icon.title };
                }
                const col = Math.floor(index / iconsPerColumn);
                const row = index % iconsPerColumn;
                return { ...icon, position: { x: col * (iconWidth + horizontalPadding) + horizontalPadding, y: row * effectiveIconHeight + verticalPadding } };
            });
        });
    }, [fileSystem]);

    const updateTaskbarRects = useCallback(() => {
        const newRects: Record<string, DOMRect> = {};
        taskbarIconRefs.current.forEach((node, id) => node && (newRects[id] = node.getBoundingClientRect()));
        setTaskbarIconRects(newRects);
    }, []);

    useLayoutEffect(() => {
        calculateIconLayout();
        updateTaskbarRects();
        window.addEventListener('resize', calculateIconLayout);
        window.addEventListener('resize', updateTaskbarRects);
        return () => { window.removeEventListener('resize', calculateIconLayout); window.removeEventListener('resize', updateTaskbarRects); };
    }, [calculateIconLayout, updateTaskbarRects, windows.length]);


    const focusWindow = useCallback((id: string) => {
        setWindows(prev => prev.map(win => win.id === id ? { ...win, zIndex: nextZIndex, isMinimized: false } : win));
        setNextZIndex(prev => prev + 1);
    }, [nextZIndex]);
    
    const handleNewFolder = useCallback((path: string[]) => {
        setFileSystem(prevFs => {
            const newFs = cloneDeep(prevFs);
            let currentDir = findNodeByPath(newFs, ['This PC', ...path]);
            if (!currentDir || currentDir.type !== 'folder') return prevFs;

            if (!currentDir.children) currentDir.children = [];
            
            const existingNames = new Set(currentDir.children.map(item => item.name));
            let newFolderName = 'New folder';
            let counter = 2;
            while (existingNames.has(newFolderName)) {
                newFolderName = `New folder (${counter++})`;
            }

            const newFolder: FileSystemItem = {
                id: `item-${nextItemId.current++}`,
                name: newFolderName,
                type: 'folder',
                modified: new Date().toISOString().split('T')[0],
                children: []
            };

            currentDir.children.push(newFolder);
            setRenamingInfo({ path, id: newFolder.id });
            return newFs;
        });
        closeContextMenu();
    }, []);

    const handleRenameItem = useCallback((path: string[], id: string, newName: string) => {
        setFileSystem(prevFs => {
            const newFs = cloneDeep(prevFs);
            let currentDir = findNodeByPath(newFs, ['This PC', ...path]);
            if (!currentDir || !currentDir.children) return prevFs;

            const item = currentDir.children.find(c => c.id === id);
            if (item) item.name = newName;
            
            return newFs;
        });
        setRenamingInfo(null);
    }, []);
    
    const handleCreateFile = useCallback((path: string[], filename: string) => {
        setFileSystem(prevFs => {
            const newFs = cloneDeep(prevFs);
            const currentDir = findNodeByPath(newFs, ['This PC', ...path]);
            if (!currentDir || currentDir.type !== 'folder') return prevFs;

            if (!currentDir.children) currentDir.children = [];
            
            if (currentDir.children.some(c => c.name === filename)) {
                // 'touch' updates timestamp, here we'll just do nothing if file exists.
                return prevFs;
            }

            currentDir.children.push({
                id: `item-${nextItemId.current++}`,
                name: filename,
                type: 'file',
                modified: new Date().toISOString().split('T')[0],
                content: '',
                size: '0 KB',
            });
            
            return newFs;
        });
    }, []);

    const handleCreateFolder = useCallback((path: string[], folderName: string) => {
        setFileSystem(prevFs => {
            const newFs = cloneDeep(prevFs);
            const parentDir = findNodeByPath(newFs, ['This PC', ...path]);

            if (!parentDir || parentDir.type !== 'folder' || (parentDir.children && parentDir.children.some(c => c.name === folderName))) {
                return prevFs;
            }
    
            if (!parentDir.children) parentDir.children = [];
            
            parentDir.children.push({
                id: `item-${nextItemId.current++}`,
                name: folderName,
                type: 'folder',
                modified: new Date().toISOString().split('T')[0],
                children: [],
            });
            
            return newFs;
        });
    }, []);

    const handleUpdateFileContent = useCallback((path: string[], filename: string, content: string) => {
        setFileSystem(prevFs => {
            const newFs = cloneDeep(prevFs);
            const parentDir = findNodeByPath(newFs, ['This PC', ...path]);
            if (!parentDir || parentDir.type !== 'folder' || !parentDir.children) return prevFs;

            const file = parentDir.children.find(c => c.name === filename && c.type === 'file');
            if (file) {
                file.content = content;
                file.size = `${Math.ceil(content.length / 1024)} KB`;
                file.modified = new Date().toISOString().split('T')[0];
            } else {
                // If file doesn't exist, create it (nano behavior)
                 parentDir.children.push({
                    id: `item-${nextItemId.current++}`,
                    name: filename,
                    type: 'file',
                    modified: new Date().toISOString().split('T')[0],
                    content: content,
                    size: `${Math.ceil(content.length / 1024)} KB`,
                });
            }

            return newFs;
        });
    }, []);

    const handleDeleteItem = useCallback((path: string[], itemName: string) => {
        setFileSystem(prevFs => {
            const newFs = cloneDeep(prevFs);
            const parentDir = findNodeByPath(newFs, ['This PC', ...path]);
            
            if (!parentDir || parentDir.type !== 'folder' || !parentDir.children) return prevFs;
            
            parentDir.children = parentDir.children.filter(c => c.name !== itemName);
            
            return newFs;
        });
    }, []);

    const handleCopyItem = useCallback((sourceAbsPath: string[], destAbsPath: string[]) => {
        setFileSystem(prevFs => {
            const newFs = cloneDeep(prevFs);
            
            const sourceParentPath = sourceAbsPath.slice(0, -1);
            const sourceName = sourceAbsPath[sourceAbsPath.length - 1];
            
            const sourceParentDir = findNodeByPath(newFs, ['This PC', ...sourceParentPath]);
            const sourceItem = sourceParentDir?.children?.find(c => c.name === sourceName);

            if (!sourceItem) return prevFs; 

            let destParentPath = destAbsPath.slice(0, -1);
            let destName = destAbsPath[destAbsPath.length - 1];

            let destParentDir = findNodeByPath(newFs, ['This PC', ...destParentPath]);
            
            const destItemAsDir = findNodeByPath(newFs, ['This PC', ...destAbsPath]);
            if (destItemAsDir && destItemAsDir.type === 'folder') {
                destParentDir = destItemAsDir;
                destName = sourceName;
            }

            if (!destParentDir || destParentDir.type !== 'folder') return prevFs;
            
            if (!destParentDir.children) destParentDir.children = [];
            if (destParentDir.children.some(c => c.name === destName)) return prevFs;

            const newItem = updateIds(cloneDeep(sourceItem), nextItemId);
            newItem.name = destName;
            newItem.modified = new Date().toISOString().split('T')[0];
            destParentDir.children.push(newItem);
            
            return newFs;
        });
    }, []);

    const handleMoveItem = useCallback((sourceAbsPath: string[], destAbsPath: string[]) => {
        setFileSystem(prevFs => {
            const newFs = cloneDeep(prevFs);

            const sourceParentPath = sourceAbsPath.slice(0, -1);
            const sourceName = sourceAbsPath[sourceAbsPath.length - 1];

            const sourceParentDir = findNodeByPath(newFs, ['This PC', ...sourceParentPath]);
            const sourceItemIndex = sourceParentDir?.children?.findIndex(c => c.name === sourceName);
            
            if (!sourceParentDir || sourceItemIndex === undefined || sourceItemIndex === -1) return prevFs;
            
            const [sourceItem] = sourceParentDir.children.splice(sourceItemIndex, 1);
            
            let destParentPath = destAbsPath.slice(0, -1);
            let destName = destAbsPath[destAbsPath.length - 1];

            let destParentDir = findNodeByPath(newFs, ['This PC', ...destParentPath]);

            const destItemAsDir = findNodeByPath(newFs, ['This PC', ...destAbsPath]);
            if (destItemAsDir && destItemAsDir.type === 'folder') {
                destParentDir = destItemAsDir;
                destName = sourceName;
            }

            if (!destParentDir || destParentDir.type !== 'folder') {
                sourceParentDir.children.splice(sourceItemIndex, 0, sourceItem);
                return prevFs;
            }

            if (!destParentDir.children) destParentDir.children = [];
            if (destParentDir.children.some(c => c.name === destName)) {
                sourceParentDir.children.splice(sourceItemIndex, 0, sourceItem);
                return prevFs;
            }
            
            sourceItem.name = destName;
            sourceItem.modified = new Date().toISOString().split('T')[0];
            destParentDir.children.push(sourceItem);

            return newFs;
        });
    }, []);

    const openApp = useCallback((appId: AppID) => {
        const existingWindow = windows.find(w => w.appId === appId);
        if (existingWindow) {
            focusWindow(existingWindow.id);
            if (existingWindow.isMinimized) {
                setWindows(prev => prev.map(win => (win.id === existingWindow.id ? { ...win, isMinimized: false } : win)));
            }
            setStartMenuOpen(false);
            return;
        }

        const appMeta = APP_METADATA[appId];
        let size = appMeta.defaultSize, position = { x: 50, y: 50 };

        if (desktopAreaRef.current) {
            const { clientWidth: dw, clientHeight: dh } = desktopAreaRef.current;
            if (appId === AppID.BROWSER) {
                const tw = Math.round(dw * 0.8), th = Math.round(dh * 0.8);
                const fw = Math.min(dw - 40, Math.max(appMeta.defaultSize.width, tw));
                const fh = Math.min(dh - 40, Math.max(appMeta.defaultSize.height, th));
                size = { width: fw, height: fh };
                position = { x: Math.max(20, (dw - fw) / 2), y: Math.max(20, (dh - fh) / 2) };
            } else {
                const { width: ww, height: wh } = size;
                size = { width: Math.min(ww, dw - 40), height: Math.min(wh, dh - 40) };
                const offset = (windows.filter(w => !w.isMinimized).length % 10) * 30;
                position = { x: Math.min(50 + offset, Math.max(20, dw - size.width - 20)), y: Math.min(50 + offset, Math.max(20, dh - size.height - 20)) };
            }
        }

        const newWindow: WindowInstance = { id: `win-${nextWindowId.current++}`, appId, ...appMeta, position, size, isMinimized: false, isMaximized: false, zIndex: nextZIndex };
        setWindows(prev => [...prev, newWindow]);
        setNextZIndex(prev => prev + 1);
        setStartMenuOpen(false);
    }, [windows, nextZIndex, focusWindow]);

    const closeWindow = (id: string) => setWindows(prev => prev.filter(win => win.id !== id));
    const minimizeWindow = (id: string) => setWindows(prev => prev.map(win => (win.id === id ? { ...win, isMinimized: true } : win)));
    const maximizeWindow = (id: string) => setWindows(prev => prev.map(win => (win.id === id ? { ...win, isMaximized: !win.isMaximized } : win)));
    const handleDrag = (id: string, pos: { x: number; y: number }) => setWindows(prev => prev.map(win => (win.id === id ? { ...win, position: pos } : win)));
    const handleResize = (id: string, data: { size: { width: number; height: number }, position: { x: number; y: number } }) => setWindows(prev => prev.map(win => (win.id === id ? { ...win, size: data.size, position: data.position } : win)));

    const renderAppComponent = useCallback((appId: AppID) => {
        switch (appId) {
            case AppID.BROWSER: return <ChromeBrowser />;
            case AppID.NOTEPAD: return <Notepad />;
            case AppID.EXPLORER: return <Explorer fileSystem={fileSystem} renamingInfo={renamingInfo} onNewFolder={handleNewFolder} onRenameItem={handleRenameItem} clearRenaming={() => setRenamingInfo(null)} onStartRename={(path, id) => setRenamingInfo({ path, id })} onDeleteItem={handleDeleteItem} onCopyItem={handleCopyItem} onMoveItem={handleMoveItem} />;
            case AppID.GEMINI_ASSISTANT: return <GeminiAssistant />;
            case AppID.RECYCLE_BIN: return <RecycleBin />;
            case AppID.SETTINGS: return <Settings setWallpaper={changeWallpaper} />;
            case AppID.TERMINAL: return <Terminal fileSystem={fileSystem} onCreateFile={handleCreateFile} onCreateFolder={handleCreateFolder} onUpdateFileContent={handleUpdateFileContent} onDeleteItem={handleDeleteItem} onCopyItem={handleCopyItem} onMoveItem={handleMoveItem} />;
            default: return null;
        }
    }, [changeWallpaper, fileSystem, renamingInfo, handleNewFolder, handleRenameItem, handleCreateFile, handleCreateFolder, handleUpdateFileContent, handleDeleteItem, handleCopyItem, handleMoveItem]);
    
    const handleDesktopContextMenu = (e: React.MouseEvent) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY }); setStartMenuOpen(false); };
    const closeContextMenu = useCallback(() => setContextMenu(null), []);
    const handleStartClick = (e: React.MouseEvent) => { e.stopPropagation(); setStartMenuOpen(prev => !prev); setContextMenu(null); if (isActionCenterOpen) setIsActionCenterOpen(false); };
    const handleGlobalClick = useCallback(() => { if (contextMenu) closeContextMenu(); if (isStartMenuOpen) setStartMenuOpen(false); if (isActionCenterOpen) setIsActionCenterOpen(false); }, [contextMenu, isStartMenuOpen, isActionCenterOpen, closeContextMenu]);
    const handleRefresh = useCallback(() => { calculateIconLayout(); closeContextMenu(); }, [calculateIconLayout, closeContextMenu]);

    useLayoutEffect(() => { document.addEventListener('click', handleGlobalClick); return () => document.removeEventListener('click', handleGlobalClick); }, [handleGlobalClick]);
    const handleIconDrag = useCallback((id: string, pos: { x: number; y: number }) => setIcons(prev => prev.map(icon => (icon.id === id ? { ...icon, position: pos } : icon))), []);

    const handleDoubleClickIcon = useCallback((id: string) => {
        if (id.startsWith('fs-')) {
            openApp(AppID.EXPLORER);
        } else {
            openApp(id as AppID);
        }
    }, [openApp]);

    const clearPreviewTimer = useCallback(() => { if (previewTimerRef.current) { clearTimeout(previewTimerRef.current); previewTimerRef.current = null; } }, []);
    const hidePreview = useCallback(() => { clearPreviewTimer(); previewTimerRef.current = window.setTimeout(() => setPreview(null), 100); }, [clearPreviewTimer]);
    const showPreview = useCallback((windowId: string, target: HTMLElement) => { clearPreviewTimer(); previewTimerRef.current = window.setTimeout(() => setPreview({ windowId, targetRect: target.getBoundingClientRect() }), 300); }, [clearPreviewTimer]);
    const previewWindow = preview ? windows.find(w => w.id === preview.windowId) : null;

    return (
        <div className="h-screen w-screen bg-black overflow-hidden font-sans" onClick={handleGlobalClick}>
            <Desktop icons={icons} onIconDrag={handleIconDrag} onOpenApp={handleDoubleClickIcon} wallpaperUrl={wallpaper} onContextMenu={handleDesktopContextMenu} desktopAreaRef={desktopAreaRef} />
            <div className="absolute top-0 left-0 w-full h-[calc(100%-2.5rem)] pointer-events-none" ref={desktopAreaRef}>
                {windows.sort((a, b) => a.zIndex - b.zIndex).map(win => (
                    <Window key={win.id} {...win} onClose={closeWindow} onMinimize={minimizeWindow} onMaximize={maximizeWindow} onFocus={focusWindow} onDrag={handleDrag} onResize={handleResize} desktopRef={desktopAreaRef} taskbarIconRect={taskbarIconRects[win.id]}>
                        {renderAppComponent(win.appId)}
                    </Window>
                ))}
            </div>
            {contextMenu && <ContextMenu x={contextMenu.x} y={contextMenu.y} openApp={openApp} onRefresh={handleRefresh} onNewFolder={() => handleNewFolder(['Desktop'])} onClose={closeContextMenu} />}
            {previewWindow && preview && <TaskbarPreview window={previewWindow} targetRect={preview.targetRect} onClose={closeWindow} onMouseEnter={clearPreviewTimer} onMouseLeave={hidePreview}>{renderAppComponent(previewWindow.appId)}</TaskbarPreview>}
            <ActionCenter isOpen={isActionCenterOpen} notifications={notifications} onDismiss={dismissNotification} onClearAll={clearAllNotifications} onClose={() => setIsActionCenterOpen(false)} />
            <Taskbar openWindows={windows} onAppClick={focusWindow} isStartMenuOpen={isStartMenuOpen} onStartClick={handleStartClick} onOpenApp={openApp} onIconMouseEnter={showPreview} onIconMouseLeave={hidePreview} iconRefs={taskbarIconRefs} onToggleActionCenter={toggleActionCenter} notificationCount={notifications.length} />
        </div>
    );
};

const AppContentWrapper: React.FC = () => {
    // This is a workaround for a hydration issue with cloneDeep in StrictMode
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    return isMounted ? <AppContent /> : null;
}


const App: React.FC = () => {
    const [appState, setAppState] = useState<BootState>('booting');
    if (appState !== 'desktop') return <BootScreen appState={appState} setAppState={setAppState} />;
    return <AppContentWrapper />;
};

export default App;