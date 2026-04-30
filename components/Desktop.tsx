import React from 'react';
import DesktopIcon from './DesktopIcon';
import { AppID } from '../types';

interface DesktopIconState {
  id: string;
  title: string;
  icon: React.ReactNode;
  position: { x: number; y: number };
  isFileSystemItem?: boolean;
}

interface DesktopProps {
    icons: DesktopIconState[];
    onIconDrag: (id: string, pos: { x: number; y: number }) => void;
    onOpenApp: (id: string) => void;
    wallpaperUrl: string;
    onContextMenu: (e: React.MouseEvent) => void;
    desktopAreaRef: React.RefObject<HTMLDivElement>;
}

const Desktop: React.FC<DesktopProps> = ({ icons, onIconDrag, onOpenApp, wallpaperUrl, onContextMenu, desktopAreaRef }) => {
    return (
        <div
            className="absolute inset-0 bg-cover bg-center transition-background-image duration-500"
            style={{ backgroundImage: `url(${wallpaperUrl})` }}
            onContextMenu={onContextMenu}
        >
            <div className="relative w-full h-full">
                {icons.map(icon => (
                    <DesktopIcon
                        key={icon.id}
                        id={icon.id}
                        title={icon.title}
                        icon={icon.icon}
                        onDoubleClick={onOpenApp}
                        position={icon.position}
                        onDrag={(pos) => onIconDrag(icon.id, pos)}
                        desktopRef={desktopAreaRef}
                    />
                ))}
            </div>
        </div>
    );
};

export default Desktop;