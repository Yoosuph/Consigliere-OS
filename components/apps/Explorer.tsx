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
    onStartRename: (path: string[], id: string) => void;
    onDeleteItem: (path: string[], itemName: string) => void;
    onCopyItem: (sourceAbsPath: string[], destAbsPath: string[]) => void;
    onMoveItem: (sourceAbsPath: string[], destAbsPath: string[]) => void;
}

const Explorer: React.FC<ExplorerProps> = ({ fileSystem, renamingInfo, onNewFolder, onRenameItem, clearRenaming, onStartRename, onDeleteItem, onCopyItem, onMoveItem }) => {
    const [history, setHistory] = useState<string[][]>([['This PC']]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, item?: FileSystemItem } | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showPreviewPane, setShowPreviewPane] = useState(false);

    const currentPath = history[historyIndex];
    const currentRelativePath = currentPath.slice(1);

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
        setSelectedIds(new Set());
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

    const handleItemDoubleClick = useCallback((item: FileSystemItem) => {
        if (item.type === 'folder') {
            navigate([...currentPath, item.name]);
        }
    }, [currentPath, navigate]);
    
    const handleItemClick = (e: React.MouseEvent, item: FileSystemItem) => {
        if (e.ctrlKey) {
            setSelectedIds(prev => {
                const newIds = new Set(prev);
                if (newIds.has(item.id)) newIds.delete(item.id);
                else newIds.add(item.id);
                return newIds;
            });
        } else {
            setSelectedIds(new Set([item.id]));
        }
    };

    const handleBreadcrumbClick = (index: number) => navigate(currentPath.slice(0, index + 1));
    const handleSidebarClick = (itemName: string) => navigate(['This PC', itemName]);
    
    const handleContextMenu = (e: React.MouseEvent, item?: FileSystemItem) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (item && !selectedIds.has(item.id)) {
            setSelectedIds(new Set([item.id]));
        }
        
        setContextMenu({ x: e.clientX, y: e.clientY, item });
    };
    
    const closeContextMenu = useCallback(() => setContextMenu(null), []);

    const handleDelete = useCallback(() => {
        const itemsToDelete = items.filter(item => selectedIds.has(item.id));
        itemsToDelete.forEach(item => {
            onDeleteItem(currentRelativePath, item.name);
        });
        setSelectedIds(new Set());
    }, [selectedIds, items, currentRelativePath, onDeleteItem]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Delete') {
            handleDelete();
        }
    };

    const contextMenuItems = useMemo((): MenuItem[] => {
        if (contextMenu?.item) {
            return [
                { label: 'Open', action: () => handleItemDoubleClick(contextMenu.item!) },
                { label: 'Rename', action: () => onStartRename(currentRelativePath, contextMenu.item!.id) },
                { label: 'Delete', action: handleDelete }
            ];
        } else {
            return [
                { label: 'View', submenu: [
                    { label: showPreviewPane ? 'Hide Preview Pane' : 'Show Preview Pane', action: () => setShowPreviewPane(prev => !prev) }
                ]},
                { label: 'New', submenu: [
                    { label: 'Folder', icon: ICONS.FOLDER, action: () => onNewFolder(currentRelativePath) }
                ]}
            ];
        }
    }, [contextMenu, handleItemDoubleClick, onStartRename, currentRelativePath, handleDelete, onNewFolder, showPreviewPane]);

    const handleDragStart = (e: React.DragEvent, item: FileSystemItem) => {
        e.dataTransfer.setData('application/json', JSON.stringify({ path: currentRelativePath, item }));
        e.dataTransfer.effectAllowed = 'copyMove';
    };

    const handleDragOver = (e: React.DragEvent, targetItem?: FileSystemItem) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = e.ctrlKey ? 'copy' : 'move';
    };

    const handleDrop = (e: React.DragEvent, targetItem?: FileSystemItem) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const dataStr = e.dataTransfer.getData('application/json');
            if (!dataStr) return;
            const data = JSON.parse(dataStr);
            const sourcePath = [...data.path, data.item.name];
            
            let destPath: string[];
            if (targetItem && targetItem.type === 'folder') {
                destPath = [...currentRelativePath, targetItem.name, data.item.name];
            } else {
                destPath = [...currentRelativePath, data.item.name];
            }
            
            if (sourcePath.join('/') === destPath.join('/')) return;
            if (destPath.join('/').startsWith(sourcePath.join('/') + '/')) return;

            if (e.ctrlKey) {
                onCopyItem(sourcePath, destPath);
            } else {
                onMoveItem(sourcePath, destPath);
            }
        } catch (err) {
            console.error('Drop failed', err);
        }
    };

    const activeItem = items.find(i => selectedIds.has(i.id));

    return (
        <div className="h-full flex flex-col bg-[#191919] text-gray-200 font-sans focus:outline-none" onClick={closeContextMenu} onKeyDown={handleKeyDown} tabIndex={0}>
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
                <main 
                    className="flex-1 overflow-y-auto flex flex-col" 
                    onContextMenu={(e) => handleContextMenu(e)} 
                    onDragOver={e => handleDragOver(e)} 
                    onDrop={e => handleDrop(e)}
                    onClick={() => setSelectedIds(new Set())}
                >
                    {items.length === 0 && !renamingInfo ? (
                        <div className="flex items-center justify-center h-full text-gray-500" onDrop={e => handleDrop(e)}><p>{searchQuery ? 'No results found.' : 'This folder is empty.'}</p></div>
                    ) : (
                        <table className="w-full text-sm text-left border-collapse select-none">
                            <thead className="sticky top-0 bg-[#1A1A1A] z-10 shadow-[0_1px_0_#303030]"><tr><th className="p-2 pl-4 font-normal text-gray-400 hover:bg-white/5 cursor-pointer">Name</th><th className="p-2 font-normal text-gray-400 hover:bg-white/5 cursor-pointer">Date modified</th><th className="p-2 font-normal text-gray-400 hover:bg-white/5 cursor-pointer">Type</th><th className="p-2 pr-4 font-normal text-gray-400 hover:bg-white/5 cursor-pointer text-right">Size</th></tr></thead>
                            <tbody>
                                {items.map(item => {
                                    const isRenaming = renamingInfo?.path.join('/') === currentRelativePath.join('/') && renamingInfo?.id === item.id;
                                    const isSelected = selectedIds.has(item.id);
                                    return (
                                        <tr 
                                            key={item.id} 
                                            className={`border-b border-[#303030] cursor-pointer group ${isSelected ? 'bg-blue-600/30' : 'hover:bg-[#2D2D2D]'}`}
                                            onDoubleClick={(e) => { e.stopPropagation(); handleItemDoubleClick(item); }}
                                            onClick={(e) => { e.stopPropagation(); handleItemClick(e, item); }}
                                            onContextMenu={(e) => handleContextMenu(e, item)}
                                            draggable={true}
                                            onDragStart={e => handleDragStart(e, item)}
                                            onDragOver={e => handleDragOver(e, item)}
                                            onDrop={e => handleDrop(e, item)}
                                        >
                                            <td className="p-2 pl-4 flex items-center gap-3">
                                                <div className="w-5 h-5 flex-shrink-0">{item.type === 'folder' ? <span className="text-yellow-500">{ICONS.FOLDER}</span> : <span className="text-gray-300">{ICONS.FILE}</span>}</div>
                                                {isRenaming ? (
                                                    <RenameInput initialValue={item.name} onRename={(newName) => onRenameItem(currentRelativePath, item.id, newName)} onCancel={clearRenaming} />
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
                {showPreviewPane && (
                    <aside className="w-64 h-full bg-[#1A1A1A] border-l border-[#303030] p-4 flex flex-col pt-8">
                        {activeItem ? (
                            <div className="flex flex-col items-center gap-4 text-center">
                                <div className="w-24 h-24 text-gray-500 flex justify-center items-center">
                                    {activeItem.type === 'folder' ? <div className="w-full h-full text-yellow-500">{ICONS.FOLDER}</div> : <div className="w-full h-full text-gray-300">{ICONS.FILE}</div>}
                                </div>
                                <h3 className="text-lg font-medium break-all">{activeItem.name}</h3>
                                <div className="text-sm text-gray-400 space-y-2 mt-4 text-left w-full">
                                    <p><strong>Type:</strong> {activeItem.type === 'folder' ? 'Folder' : 'File'}</p>
                                    <p><strong>Modified:</strong> {activeItem.modified}</p>
                                    {activeItem.size && <p><strong>Size:</strong> {activeItem.size}</p>}
                                    {activeItem.content && <div className="mt-4 break-words bg-[#202020] border border-[#303030] p-2 rounded max-h-48 overflow-auto"><pre className="text-xs font-mono">{activeItem.content}</pre></div>}
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-500 text-sm">
                                Select an item to preview.
                            </div>
                        )}
                    </aside>
                )}
            </div>
            {contextMenu && <ContextMenu x={contextMenu.x} y={contextMenu.y} openApp={() => {}} onRefresh={() => {}} items={contextMenuItems} onClose={closeContextMenu} />}
        </div>
    );
};

export default Explorer;
