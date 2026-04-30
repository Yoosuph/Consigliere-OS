import React, { useState, useMemo, useCallback } from 'react';
import { ICONS } from '../../constants';
import type { FileSystemItem } from '../../types';
import ContextMenu, { MenuItem } from '../ContextMenu';
import RenameInput from '../RenameInput';

interface ExplorerProps {
    fileSystem: FileSystemItem;
    renamingInfo: { path: string[], id: string } | null;
    onNewFolder: (path: string[]) => void;
    onRenameItem: (path: string[], id: string, newName: string) => void;
    clearRenaming: () => void;
}

const Explorer: React.FC<ExplorerProps> = ({ fileSystem, renamingInfo, onNewFolder, onRenameItem, clearRenaming }) => {
    const [history, setHistory] = useState<string[][]>([['This PC']]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);

    const currentPath = history[historyIndex];

    const { currentDir, items } = useMemo(() => {
        let node: FileSystemItem | undefined = fileSystem;
        for (let i = 1; i < currentPath.length; i++) {
            node = node?.children?.find(child => child.name === currentPath[i]);
        }
        
        const currentItems = node?.children || [];
        const filteredItems = searchQuery 
            ? currentItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
            : currentItems;
        
        return { currentDir: node, items: filteredItems };
    }, [currentPath, fileSystem, searchQuery]);

    const navigate = useCallback((newPath: string[]) => {
        const newHistory = history.slice(0, historyIndex + 1);
        if (JSON.stringify(newHistory[newHistory.length - 1]) === JSON.stringify(newPath)) return;
        setSearchQuery('');
        newHistory.push(newPath);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex]);

    const canGoBack = historyIndex > 0;
    const goBack = () => canGoBack && setHistoryIndex(prev => prev - 1);
    
    const canGoForward = historyIndex < history.length - 1;
    const goForward = () => canGoForward && setHistoryIndex(prev => prev + 1);

    const canGoUp = currentPath.length > 1;
    const goUp = () => canGoUp && navigate(currentPath.slice(0, -1));

    const handleItemDoubleClick = (item: FileSystemItem) => {
        if (item.type === 'folder') {
            navigate([...currentPath, item.name]);
        }
    };
    
    const handleBreadcrumbClick = (index: number) => navigate(currentPath.slice(0, index + 1));
    const handleSidebarClick = (itemName: string) => navigate(['This PC', itemName]);
    
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ x: e.clientX, y: e.clientY });
    };
    
    const closeContextMenu = useCallback(() => setContextMenu(null), []);

    const contextMenuItems: MenuItem[] = [
        {
            label: 'New',
            submenu: [{ label: 'Folder', icon: ICONS.FOLDER, action: () => onNewFolder(currentPath) }]
        }
    ];

    return (
        <div className="h-full flex flex-col bg-[#191919] text-gray-200 font-sans" onClick={closeContextMenu}>
            <div className="flex-shrink-0 p-1.5 border-b border-[#303030] bg-[#202020] flex items-center gap-2">
                <button onClick={goBack} disabled={!canGoBack} className="p-1 rounded hover:bg-white/10 disabled:opacity-30">{ICONS.ARROW_LEFT}</button>
                <button onClick={goForward} disabled={!canGoForward} className="p-1 rounded hover:bg-white/10 disabled:opacity-30">{ICONS.ARROW_RIGHT}</button>
                <button onClick={goUp} disabled={!canGoUp} className="p-1 rounded hover:bg-white/10 disabled:opacity-30">{ICONS.ARROW_UP}</button>
                <div className="flex items-center bg-[#191919]/50 border border-gray-700/50 hover:border-gray-600 rounded-md px-2 flex-grow text-sm h-8 transition-colors">
                    <div className="w-5 h-5 flex-shrink-0 text-gray-400">{ICONS.PC}</div>
                    {currentPath.map((part, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && <span className="mx-1 text-gray-500">/</span>}
                            <button onClick={() => handleBreadcrumbClick(index)} className="px-2 py-0.5 rounded hover:bg-[#303030] disabled:hover:bg-transparent" disabled={index === currentPath.length - 1}>{part}</button>
                        </React.Fragment>
                    ))}
                </div>
                <div className="relative flex items-center">
                    <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-[#191919]/50 border border-gray-700/50 hover:border-gray-600 rounded-md h-8 pl-3 pr-8 text-sm w-48 focus:outline-none focus:border-[#4da1ff] transition-colors" />
                    <div className="absolute right-2 top-0 h-full flex items-center pointer-events-none text-gray-400"><div className="w-4 h-4">{ICONS.SEARCH}</div></div>
                </div>
            </div>
            <div className="flex flex-grow overflow-hidden">
                <aside className="w-56 h-full bg-[#202020] p-2 flex-shrink-0 overflow-y-auto space-y-1 border-r border-[#303030]">
                    <ul>
                        <li><button onClick={() => navigate(['This PC'])} className={`w-full text-left flex items-center gap-2 p-2 rounded text-sm ${currentPath.length === 1 ? 'bg-blue-600' : 'hover:bg-white/10'}`}><div className="w-5 h-5 flex-shrink-0">{ICONS.PC}</div><span className="truncate">This PC</span></button></li>
                        <hr className="border-gray-700 my-2" />
                        {fileSystem.children?.map(item => (
                            <li key={item.id}><button onClick={() => handleSidebarClick(item.name)} className={`w-full text-left flex items-center gap-2 p-2 rounded text-sm ${currentPath[1] === item.name && currentPath.length === 2 ? 'bg-blue-600' : 'hover:bg-white/10'}`}><div className="w-5 h-5 text-yellow-500 flex-shrink-0">{ICONS.FOLDER}</div><span className="truncate">{item.name}</span></button></li>
                        ))}
                    </ul>
                </aside>
                <main className="flex-1 overflow-y-auto" onContextMenu={handleContextMenu}>
                    {items.length === 0 && !renamingInfo ? (
                        <div className="flex items-center justify-center h-full text-gray-500"><p>{searchQuery ? 'No results found.' : 'This folder is empty.'}</p></div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="sticky top-0 bg-[#1A1A1A] z-10 shadow-[0_1px_0_#303030]"><tr><th className="p-2 pl-4 font-normal text-gray-400 hover:bg-white/5 cursor-pointer">Name</th><th className="p-2 font-normal text-gray-400 hover:bg-white/5 cursor-pointer">Date modified</th><th className="p-2 font-normal text-gray-400 hover:bg-white/5 cursor-pointer">Type</th><th className="p-2 pr-4 font-normal text-gray-400 hover:bg-white/5 cursor-pointer text-right">Size</th></tr></thead>
                            <tbody>
                                {items.map(item => {
                                    const isRenaming = renamingInfo?.path.join('/') === currentPath.join('/') && renamingInfo?.id === item.id;
                                    return (
                                        <tr key={item.id} className="hover:bg-[#2D2D2D] border-b border-[#303030] cursor-pointer group" onDoubleClick={() => handleItemDoubleClick(item)}>
                                            <td className="p-2 pl-4 flex items-center gap-3">
                                                <div className="w-5 h-5 flex-shrink-0">{item.type === 'folder' ? <span className="text-yellow-500">{ICONS.FOLDER}</span> : <span className="text-gray-300">{ICONS.FILE}</span>}</div>
                                                {isRenaming ? (
                                                    <RenameInput initialValue={item.name} onRename={(newName) => onRenameItem(currentPath, item.id, newName)} onCancel={clearRenaming} />
                                                ) : <span className="group-hover:text-white transition-colors">{item.name}</span>}
                                            </td>
                                            <td className="p-2 text-gray-400 group-hover:text-gray-300 transition-colors">{item.modified}</td>
                                            <td className="p-2 text-gray-400 group-hover:text-gray-300 transition-colors">{item.type === 'folder' ? 'File folder' : 'File'}</td>
                                            <td className="p-2 pr-4 text-gray-400 group-hover:text-gray-300 transition-colors text-right">{item.size || ''}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </main>
            </div>
            {contextMenu && <ContextMenu x={contextMenu.x} y={contextMenu.y} openApp={() => {}} onRefresh={() => {}} onNewFolder={() => onNewFolder(currentPath)} />}
        </div>
    );
};

export default Explorer;