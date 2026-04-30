import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { FileSystemItem } from '../../types';
import { findNodeByPath } from '../../utils';

interface TerminalProps {
    fileSystem: FileSystemItem;
    onCreateFile: (path: string[], filename: string) => void;
    onCreateFolder: (path: string[], folderName: string) => void;
    onUpdateFileContent: (path:string[], filename: string, content: string) => void;
    onDeleteItem: (path: string[], itemName: string) => void;
    onCopyItem: (sourceAbsPath: string[], destAbsPath: string[]) => void;
    onMoveItem: (sourceAbsPath: string[], destAbsPath: string[]) => void;
}

interface NanoEditorProps {
    filename: string;
    initialContent: string;
    onSave: (content: string) => void;
    onExit: () => void;
}

const commandList = ['help', 'ls', 'cd', 'cat', 'touch', 'nano', 'rm', 'mkdir', 'pwd', 'echo', 'date', 'neofetch', 'clear', 'whoami', 'uptime', 'fortune', 'sudo', 'exit', 'history', 'cp', 'mv'];

const resolvePath = (pathStr: string, currentPath: string[]): string[] => {
    if (!pathStr) return currentPath;
    const pathParts = pathStr.split('/').filter(p => p && p !== '.');
    let newPath = pathStr.startsWith('/') ? [] : [...currentPath];
    for (const part of pathParts) {
        if (part === '..') {
            if (newPath.length > 0) newPath.pop();
        } else {
            newPath.push(part);
        }
    }
    return newPath;
}

const NanoEditor: React.FC<NanoEditorProps> = ({ filename, initialContent, onSave, onExit }) => {
    const [content, setContent] = useState(initialContent);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [status, setStatus] = useState('');

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    useEffect(() => {
        if(status){
            const timer = setTimeout(() => setStatus(''), 2000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.ctrlKey) {
            if (e.key === 's') {
                e.preventDefault();
                onSave(content);
                setStatus(`File '${filename}' saved.`);
            } else if (e.key === 'x') {
                e.preventDefault();
                onExit();
            }
        }
    };
    
    return (
        <div className="h-full flex flex-col">
            <header className="bg-gray-600 text-center text-xs p-0.5 flex-shrink-0">
                File: {filename}
            </header>
            <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-grow bg-transparent border-none outline-none resize-none w-full text-sm"
                spellCheck={false}
            />
            <footer className="bg-gray-600 text-center text-xs p-0.5 flex-shrink-0 flex justify-between px-2">
                <span>{status || "Ctrl+S: Save | Ctrl+X: Exit"}</span>
                <span>{content.split('\n').length} Lines</span>
            </footer>
        </div>
    );
};

const Terminal: React.FC<TerminalProps> = ({ fileSystem, onCreateFile, onCreateFolder, onUpdateFileContent, onDeleteItem, onCopyItem, onMoveItem }) => {
    const [lines, setLines] = useState<React.ReactNode[]>([<div key="welcome">Welcome to Consigliere OS Terminal. Type 'help' for available commands.</div>]);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [currentPath, setCurrentPath] = useState<string[]>([]); // Relative to 'This PC'
    const [isEditing, setIsEditing] = useState<{ filename: string; content: string } | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [draftCommand, setDraftCommand] = useState('');
    const [tabPressCount, setTabPressCount] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
        containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [lines, scrollToBottom]);

    useEffect(() => {
        if (!isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    const addLine = (line: React.ReactNode) => setLines(prev => [...prev, line]);
    const addLines = (newLines: React.ReactNode[]) => setLines(prev => [...prev, ...newLines]);

    const promptPath = currentPath.length > 0 ? '/' + currentPath.join('/') : '';
    const prompt = <span className="text-green-400">[consigliere@archlinux <span className="text-blue-400">~{promptPath}</span>]$&nbsp;</span>;

    const getCurrentDir = useCallback(() => findNodeByPath(fileSystem, ['This PC', ...currentPath]), [fileSystem, currentPath]);


    const processCommand = (commandStr: string) => {
        addLine(<div key={`cmd-${Date.now()}`}>{prompt}{commandStr}</div>);
        const [command, ...args] = commandStr.trim().split(/\s+/);
        const currentDir = getCurrentDir();

        switch (command.toLowerCase()) {
            case 'help':
                addLines([
                    'Available commands:',
                    '  help                         - Show this help message',
                    '  ls [--skills|--projects|-l] - List directory contents',
                    '  cd [dir]                     - Change directory',
                    '  pwd                          - Print working directory',
                    '  mkdir [dir]                  - Create a new directory',
                    '  cp [-r] [src] [dest]         - Copy a file or directory',
                    '  mv [src] [dest]              - Move or rename a file or directory',
                    '  cat [file]                   - View file contents',
                    '  touch [file]                 - Create an empty file',
                    '  nano [file]                  - Edit a text file',
                    '  rm [-r] [file/dir]           - Remove a file or directory',
                    '  echo [text]                  - Print text',
                    '  date                         - Show current date and time',
                    '  neofetch                     - Show system information',
                    '  history                      - Show command history',
                    '  whoami                       - Print the current user',
                    '  uptime --life                - Show life summary',
                    '  fortune                      - Print a random adage',
                    '  sudo [cmd]                   - Execute a command as superuser',
                    '  exit                         - Terminate the session',
                    '  clear                        - Clear the terminal screen',
                    '',
                    'Note: Use Tab for command and file autocompletion.',
                ].map((l, i) => <div key={`help-${i}`}>{l}</div>));
                break;
            case 'ls': {
                if (args.includes('--skills')) {
                    addLines([
                        '- Cybersecurity: Red Teaming | OSINT | Threat Intelligence',
                        '- Development: React | FastAPI | SQLModel | APIs',
                        '- Linux Wizardry: Arch Linux | Hyprland | NvChad',
                        '- Research & Data Analysis',
                        '- Content Creation & Digital Strategy'
                    ].map((l, i) => <div key={`skill-${i}`}>{l}</div>));
                } else if (args.includes('--projects')) {
                     addLines([
                        '📂 Economic Analysis of Poultry Production (Kano Metropolis)',  
                        '📂 Optimum Farm Plan Analysis (Katsina State, factor analysis)',  
                        '📂 Jigawa Radio Website (green & white branding, live streaming, news/blog, dark mode)',  
                        '📂 Crypto Trading Analysis App (React + FastAPI, real-time signals)',  
                        '📂 Portfolio Website (Terminal Style)'
                    ].map((l, i) => <div key={`proj-${i}`}>{l}</div>));
                } else {
                    if (!currentDir || currentDir.type !== 'folder') {
                        addLine(<div className="text-red-400">ls: cannot access '.': No such file or directory</div>);
                        break;
                    }
                    const items = currentDir.children || [];
                    if (items.length === 0) {
                        addLine(<div key="ls-empty">Directory is empty.</div>);
                        break;
                    }
                    if (args.includes('-l')) {
                        const output = items.map(item => {
                            const perms = item.type === 'folder' ? 'drwxr-xr-x' : '-rw-r--r--';
                            const owner = 'user'.padEnd(8);
                            const group = 'user'.padEnd(8);
                            const size = (item.size || '-').padEnd(10);
                            const name = item.type === 'folder' ? <span className="text-blue-400">{item.name}</span> : <span>{item.name}</span>;
                            const date = new Date(item.modified);
                            const modified = `${date.toLocaleString('default', { month: 'short' })} ${String(date.getDate()).padStart(2, ' ')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                            return <div key={item.id} className="flex gap-2"><span>{perms}</span><span>1</span><span>{owner}</span><span>{group}</span><span>{size}</span><span>{modified}</span><span>{name}</span></div>;
                        });
                        addLines(output);
                    } else {
                        const output = items.map(item => (
                            <span key={item.id} className={item.type === 'folder' ? 'text-blue-400' : 'text-white'}>
                                {item.name}
                            </span>
                        ));
                        addLine(<div className="flex flex-wrap gap-x-4 gap-y-1">{output}</div>);
                    }
                }
                break;
            }
             case 'cd': {
                const targetPath = args[0] || '';
                if (targetPath === '' || targetPath === '~' || targetPath === '/') {
                    setCurrentPath([]);
                    break;
                }
                const newPath = resolvePath(targetPath, currentPath);

                const node = findNodeByPath(fileSystem, ['This PC', ...newPath]);
                if (node && node.type === 'folder') {
                    setCurrentPath(newPath);
                } else {
                    addLine(<div className="text-red-400">cd: no such file or directory: {targetPath}</div>);
                }
                break;
            }
            case 'pwd':
                addLine(<div>~/{currentPath.join('/')}</div>);
                break;
            case 'mkdir': {
                const dirName = args[0];
                if (!dirName) {
                    addLine(<div className="text-red-400">mkdir: missing operand</div>);
                    break;
                }
                if (currentDir?.children?.some(c => c.name === dirName)) {
                    addLine(<div className="text-red-400">mkdir: cannot create directory ‘{dirName}’: File exists</div>);
                    break;
                }
                onCreateFolder(currentPath, dirName);
                break;
            }
            case 'cat': {
                const targetPath = args[0] || '';
                if (!targetPath) {
                    addLine(<div className="text-red-400">cat: missing file operand</div>);
                    break;
                }
                
                const absPath = resolvePath(targetPath, currentPath);
                const fileNode = findNodeByPath(fileSystem, ['This PC', ...absPath]);

                if (fileNode) {
                    if (fileNode.type === 'file') {
                        addLine(<pre className="whitespace-pre-wrap">{fileNode.content || ''}</pre>);
                    } else {
                         addLine(<div className="text-red-400">cat: {targetPath}: Is a directory</div>);
                    }
                } else {
                    addLine(<div className="text-red-400">cat: {targetPath}: No such file or directory</div>);
                }
                break;
            }
            case 'touch': {
                const filename = args[0];
                if (!filename) {
                    addLine(<div className="text-red-400">touch: missing file operand</div>);
                    break;
                }
                if (filename.includes('/')) {
                    addLine(<div className="text-red-400">touch: invalid file name '{filename}'</div>);
                    break;
                }
                onCreateFile(currentPath, filename);
                break;
            }
            case 'nano': {
                const filename = args[0];
                if (!filename) {
                    addLine(<div className="text-red-400">nano: file name not specified</div>);
                    break;
                }
                const file = currentDir?.children?.find(c => c.name === filename && c.type === 'file');
                setIsEditing({ filename, content: file?.content || '' });
                break;
            }
            case 'rm': {
                const recursive = args[0] === '-r';
                const itemName = recursive ? args[1] : args[0];

                if (!itemName) {
                    addLine(<div className="text-red-400">rm: missing operand</div>);
                    break;
                }
                
                const item = currentDir?.children?.find(c => c.name === itemName);

                if (!item) {
                    addLine(<div className="text-red-400">rm: cannot remove '{itemName}': No such file or directory</div>);
                    break;
                }
                
                if (item.type === 'folder' && (item.children?.length || 0) > 0 && !recursive) {
                    addLine(<div className="text-red-400">rm: cannot remove '{itemName}': Directory not empty</div>);
                    break;
                }

                onDeleteItem(currentPath, itemName);
                break;
            }
            case 'history': {
                addLines(commandHistory.map((cmd, i) => <div key={`hist-${i}`}>{`${String(i + 1).padStart(3, ' ')}  ${cmd}`}</div>));
                break;
            }
            case 'cp': {
                const recursive = args.includes('-r');
                const filteredArgs = args.filter(a => a !== '-r');
                const [source, dest] = filteredArgs;

                if (!source || !dest) {
                    addLine(<div className="text-red-400">cp: missing source or destination operand</div>);
                    break;
                }

                const sourceAbsPath = resolvePath(source, currentPath);
                const destAbsPath = resolvePath(dest, currentPath);

                const sourceNode = findNodeByPath(fileSystem, ['This PC', ...sourceAbsPath]);
                if (!sourceNode) {
                    addLine(<div className="text-red-400">cp: cannot stat '{source}': No such file or directory</div>);
                    break;
                }
                if (sourceNode.type === 'folder' && !recursive) {
                    addLine(<div className="text-red-400">cp: -r not specified; omitting directory '{source}'</div>);
                    break;
                }
                
                let finalDestPath = [...destAbsPath];
                const destNode = findNodeByPath(fileSystem, ['This PC', ...finalDestPath]);
                if (destNode && destNode.type === 'folder') {
                    finalDestPath.push(sourceNode.name);
                }
                if (findNodeByPath(fileSystem, ['This PC', ...finalDestPath])) {
                    addLine(<div className="text-red-400">cp: '{dest}': File exists</div>);
                    break;
                }

                onCopyItem(sourceAbsPath, destAbsPath);
                break;
            }
             case 'mv': {
                const [source, dest] = args;
                if (!source || !dest) {
                    addLine(<div className="text-red-400">mv: missing source or destination operand</div>);
                    break;
                }

                const sourceAbsPath = resolvePath(source, currentPath);
                const destAbsPath = resolvePath(dest, currentPath);

                const sourceNode = findNodeByPath(fileSystem, ['This PC', ...sourceAbsPath]);
                if (!sourceNode) {
                    addLine(<div className="text-red-400">mv: cannot stat '{source}': No such file or directory</div>);
                    break;
                }
                
                let finalDestPath = [...destAbsPath];
                const destNode = findNodeByPath(fileSystem, ['This PC', ...finalDestPath]);
                if (destNode && destNode.type === 'folder') {
                    finalDestPath.push(sourceNode.name);
                }
                if (findNodeByPath(fileSystem, ['This PC', ...finalDestPath])) {
                    addLine(<div className="text-red-400">mv: '{dest}': File exists</div>);
                    break;
                }

                onMoveItem(sourceAbsPath, destAbsPath);
                break;
            }
            case 'echo': {
                const echoStr = args.join(' ');
                if (echoStr.toLowerCase() === '"fun facts"') {
                    addLines([
                        '- Loves food 🍲',
                        '- Professional social media creator (cybersecurity awareness + politics)',
                        '- Built Sarah Investment (family biz: food & student materials at university)',
                        '- Mixes humour + creativity in campaigns',
                        '- Dreams in terminal commands sometimes'
                    ].map((l, i) => <div key={`fact-${i}`}>{l}</div>));
                } else {
                    addLine(<div>{echoStr.replace(/"/g, '')}</div>);
                }
                break;
            }
            case 'date':
                addLine(<div>{new Date().toString()}</div>);
                break;
            case 'clear':
                setLines([]);
                break;
            case 'neofetch':
                addLines([
                    <div key="neofetch" className="flex gap-4">
                        <pre className="text-blue-400">{`
    .---.
   /  ,  \\
  |  / \\  |
  |  | |  |
  |  \\ /  |
   \\  '  /
    '---'
`}</pre>
                        <div>
                            <p><span className="text-green-400 font-bold">consigliere@archlinux</span></p>
                            <p>---------------</p>
                            <p><span className="font-bold">OS:</span> Consigliere OS x86_64</p>
                            <p><span className="font-bold">Host:</span> Web Browser</p>
                            <p><span className="font-bold">Kernel:</span> React 19</p>
                            <p><span className="font-bold">Shell:</span> bash 5.1</p>
                            <p><span className="font-bold">Theme:</span> Dark</p>
                        </div>
                    </div>
                ]);
                break;
            case 'whoami':
                addLine(<div>Yusuf Lawan Nuhu</div>);
                break;
            case 'uptime':
                if (args[0] === '--life') {
                    addLines([
                        'Active in Tech: 5+ years',
                        'Graduated: December 2024',
                        'Roles: Cybersecurity | Developer | Researcher | Content Creator'
                    ].map((l, i) => <div key={`life-${i}`}>{l}</div>));
                } else {
                     addLine(<div>uptime: usage: uptime [--life]</div>);
                }
                break;
            case 'fortune':
                addLine(<div>"Polymath loading… please wait."</div>);
                break;
            case 'sudo':
                if (args[0] === 'access' && args[1] === '--granted') {
                    addLines([
                        '>>> SECRET MODE ACTIVATED <<<',
                        '- Future Goal: Blend philosophy, physics, and technology into practical impact',
                        '- Hidden Talent: Turning complex ideas into simple stories',
                        '- Easter Egg: Try `sudo make me_coffee`'
                    ].map((l, i) => <div key={`sudo-${i}`}>{l}</div>));
                } else if (args[0] === 'make' && args[1] === 'me_coffee') {
                    addLine(<div className="text-red-400">Error: Yusuf loves food, not barista life. 🍵</div>);
                } else {
                    addLine(<div>sudo: command not found</div>);
                }
                break;
            case 'exit':
                addLine(<div>Session terminated. Thanks for visiting!</div>);
                break;
            case '':
                break;
            default:
                addLine(<div className="text-red-400">{command}: command not found</div>);
                break;
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const command = inputValue.trim();
        if (command) {
            setCommandHistory(prev => [...prev.filter(c => c !== command), command]);
            processCommand(command);
        } else {
            addLine(<div key={`empty-${Date.now()}`}>{prompt}</div>);
        }
        setHistoryIndex(-1);
        setInputValue('');
        setDraftCommand('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const parts = inputValue.split(' ');
            const currentWord = parts.pop() || '';
            const baseInput = parts.join(' ');
            
            const currentDir = getCurrentDir();
            const filesAndDirs = currentDir?.children?.map(c => c.name) || [];
            const candidates = [...commandList, ...filesAndDirs].filter(c => c.toLowerCase().startsWith(currentWord.toLowerCase()));

            if (candidates.length === 1) {
                const completion = candidates[0];
                const isDir = currentDir?.children?.find(c => c.name === completion)?.type === 'folder';
                setInputValue((baseInput ? baseInput + ' ' : '') + completion + (isDir ? '/' : ' '));
                setTabPressCount(0);
            } else if (candidates.length > 1) {
                if (tabPressCount > 0) {
                     addLine(<div className="flex flex-wrap gap-x-4 gap-y-1">{candidates.map(c => <span key={c}>{c}</span>)}</div>);
                } else {
                    let commonPrefix = '';
                    if (candidates.length > 0) {
                        const first = candidates[0];
                        for (let i = 0; i < first.length; i++) {
                            if (candidates.every(c => c[i] && c[i].toLowerCase() === first[i].toLowerCase())) {
                                commonPrefix += first[i];
                            } else {
                                break;
                            }
                        }
                    }
                    if (commonPrefix.length > currentWord.length) {
                        setInputValue((baseInput ? baseInput + ' ' : '') + commonPrefix);
                    }
                }
                setTabPressCount(prev => prev + 1);
            }
            return;
        }

        if (e.key !== 'Tab') {
            setTabPressCount(0);
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                if (historyIndex === -1) {
                    setDraftCommand(inputValue);
                    const newIndex = commandHistory.length - 1;
                    setHistoryIndex(newIndex);
                    setInputValue(commandHistory[newIndex]);
                } else if (historyIndex > 0) {
                    const newIndex = historyIndex - 1;
                    setHistoryIndex(newIndex);
                    setInputValue(commandHistory[newIndex]);
                }
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex !== -1) {
                if (historyIndex < commandHistory.length - 1) {
                    const newIndex = historyIndex + 1;
                    setHistoryIndex(newIndex);
                    setInputValue(commandHistory[newIndex]);
                } else {
                    setHistoryIndex(-1);
                    setInputValue(draftCommand);
                }
            }
        }
    };

    return (
        <div 
            ref={containerRef}
            className="h-full w-full bg-[#0c0c0c] text-[#cccccc] font-mono text-[14px] p-2 overflow-y-auto"
            onClick={() => !isEditing && inputRef.current?.focus()}
        >
            {isEditing ? (
                <NanoEditor 
                    filename={isEditing.filename}
                    initialContent={isEditing.content}
                    onSave={(content) => {
                        onUpdateFileContent(currentPath, isEditing.filename, content);
                    }}
                    onExit={() => setIsEditing(null)}
                />
            ) : (
                <>
                    {lines.map((line, i) => (
                        <div key={i} className="leading-tight break-words">{line}</div>
                    ))}
                    <form onSubmit={handleSubmit} className="flex">
                        <label htmlFor="terminal-input" className="flex-shrink-0">{prompt}</label>
                        <input
                            id="terminal-input"
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="flex-grow bg-transparent border-none outline-none text-white w-full"
                            autoComplete="off"
                            autoFocus
                            onKeyDown={handleKeyDown}
                        />
                    </form>
                </>
            )}
        </div>
    );
};

export default Terminal;