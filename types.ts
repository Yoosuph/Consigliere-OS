import React from 'react';

export enum AppID {
  BROWSER = 'BROWSER',
  NOTEPAD = 'NOTEPAD',
  EXPLORER = 'EXPLORER',
  GEMINI_ASSISTANT = 'GEMINI_ASSISTANT',
  RECYCLE_BIN = 'RECYCLE_BIN',
  SETTINGS = 'SETTINGS',
  TERMINAL = 'TERMINAL',
}

export interface FileSystemItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  modified: string;
  children?: FileSystemItem[];
  content?: string; // Added for `cat` command
}

export interface DesktopIconProps {
  id: AppID;
  title: string;
  icon: React.ReactNode;
  onDoubleClick: (id: AppID) => void;
}

export interface Project {
  id: string;
  name: string;
  type: 'Folder' | 'File';
  description: string;
  technologies: string[];
  url?: string;
}

export interface Skill {
  name: string;
  icon: React.ReactNode;
}

export interface Notification {
  id: string;
  appId: AppID;
  title: string;
  message: string;
  timestamp: Date;
}

export interface WindowInstance {
  id: string;
  appId: AppID;
  title: string;
  icon: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}