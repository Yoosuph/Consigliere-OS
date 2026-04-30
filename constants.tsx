import React from 'react';
import { AppID } from './types';
import type { Project } from './types';

export const ICONS = {
  BROWSER: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" fill="#fff" stroke="#ccc" strokeWidth="1"/><path d="M12 2.5A9.5 9.5 0 0 1 20.22 16.73L12 12V2.5z" fill="#34A853"/><path d="M12 12l-8.22 4.73A9.5 9.5 0 0 1 12 2.5V12z" fill="#EA4335"/><path d="M12 21.5a9.5 9.5 0 0 1-8.22-14.23L12 12v9.5z" fill="#FBBC05"/><circle cx="12" cy="12" r="4" fill="#4285F4"/></svg>,
  CHROME_BROWSER: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" fill="#fff" stroke="#ccc" strokeWidth="1"/><path d="M12 2.5A9.5 9.5 0 0 1 20.22 16.73L12 12V2.5z" fill="#34A853"/><path d="M12 12l-8.22 4.73A9.5 9.5 0 0 1 12 2.5V12z" fill="#EA4335"/><path d="M12 21.5a9.5 9.5 0 0 1-8.22-14.23L12 12v9.5z" fill="#FBBC05"/><circle cx="12" cy="12" r="4" fill="#4285F4"/></svg>,
  NOTEPAD: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5 2a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2H5z" fill="#2563EB"/><path d="M7 6h10v2H7V6zm0 4h10v2H7v-2zm0 4h7v2H7v-2z" fill="#FFFFFF"/></svg>,
  EXPLORER: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19.5 6h-7.312l-2-2H4.5A2.5 2.5 0 002 6.5v11A2.5 2.5 0 004.5 20h15a2.5 2.5 0 002.5-2.5v-9A2.5 2.5 0 0019.5 6z" fill="#FFCA28"/><path d="M22 8.5v9a2.5 2.5 0 01-2.5 2.5H4.5A2.5 2.5 0 012 17.5V11h20z" fill="#FDD835"/></svg>,
  GEMINI_ASSISTANT: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#6B21A8" d="M12 2l2.35 7.16L22 12l-7.65 2.84L12 22l-2.35-7.16L2 12l7.65-2.84z"/><path fill="#9333EA" d="M12 5.5l1.09 3.32L16.5 12l-3.41 1.18L12 16.5l-1.09-3.32L7.5 12l3.41-1.18z"/></svg>,
  RECYCLE_BIN: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z"/><path d="M15.5 4l-1-1h-5l-1 1H5v2h14V4z"/></svg>,
  SETTINGS: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-gray-500"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>,
  TERMINAL: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2 4v16h20V4H2zm18 14H4V6h16v12z" fill="#212121"/><path d="M6 8l3 3-3 3M10 14h4" stroke="#FFFFFF" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>,

  FOLDER: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#FFCA28"><path d="M2 3.5A1.5 1.5 0 013.5 2h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H16.5A1.5 1.5 0 0118 6.5v7A1.5 1.5 0 0116.5 15H3.5A1.5 1.5 0 012 13.5v-10z" /></svg>,
  FILE: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="text-gray-300"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8.414a1 1 0 00-.293-.707l-4.414-4.414A1 1 0 0011.586 2H4zm6 6a1 1 0 01-1-1V3l4 4h-3a1 1 0 01-1-1z" clipRule="evenodd" /></svg>,
  PC: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" /></svg>,

  START: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88"><path fill="#00adef" d="M0 12.402l35.687-4.86v36.19H0v-31.33zm35.687 40.063l.006 36.18L0 83.822v-31.36h35.687zM88 0v43.73H40.016V6l47.984-6zM40.016 48v37.666L88 88V48H40.016z"/></svg>,
  MINIMIZE: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>,
  MAXIMIZE: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" transform="rotate(90 12 12) scale(0.6)"/></svg>,
  RESTORE: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" transform="rotate(90 12 12) scale(0.6) translate(-6 -6)" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" transform="rotate(90 12 12) scale(0.6) translate(6 6)" /></svg>,
  CLOSE: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,

  ARROW_LEFT: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" /></svg>,
  ARROW_RIGHT: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>,
  ARROW_UP: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" /></svg>,
  PLUS: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>,
  RELOAD: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M15.312 11.342a1.25 1.25 0 01-1.651 1.898l-1.385-1.038a4.991 4.991 0 00-7.854-2.533.75.75 0 01-1.221.884 6.5 6.5 0 0110.18-3.295l1.096-1.096a.75.75 0 011.27.53v4.155a.75.75 0 01-.75.75H15.312zM4.688 8.658a1.25 1.25 0 011.651-1.898l1.385 1.038a4.991 4.991 0 007.854 2.533.75.75 0 011.221-.884 6.5 6.5 0 01-10.18 3.295l-1.096 1.096a.75.75 0 01-1.27-.53V8.188a.75.75 0 01.75-.75H4.688z" clipRule="evenodd" /></svg>,
  LOADING_SPINNER: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="animate-spin"><path d="M12 2.99982C16.9706 2.99982 21 7.02925 21 11.9998C21 16.9704 16.9706 20.9998 12 20.9998C7.02944 20.9998 3 16.9704 3 11.9998C3 9.17267 4.30367 6.64939 6.34267 4.99982" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  JAVIS_AVATAR: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.676.75.75 0 01.818.162A9 9 0 0112 21a9 9 0 01-9-9 9 9 0 018.528-8.282z" /></svg>,
  WIFI: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C19.73 5.73 8.27 5.73 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zM3 13l2 2c2.76-2.76 7.24-2.76 10 0l2-2c-3.86-3.87-10.14-3.87-14 0z"/></svg>,
  SOUND: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>,
  BATTERY: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>,
  NOTIFICATION: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.21 1.79-4 4-4s4 1.79 4 4v6z"/></svg>,
  NIGHT_LIGHT: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>,
  BLUETOOTH: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.452 42.452 0 0110.56 0m-10.56 0L6 3.372c0-1.03 1.12-1.502 1.942-.872l4.438 4.438c.54.54.54 1.414 0 1.954L9.53 13.243a42.452 42.452 0 01-2.81-.971z" /></svg>,
  VPN: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 1.5v21m-8.25-6.75h16.5" /></svg>,
  AIRPLANE_MODE: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12.75 1.5l2.036 6.108 4.714 1.635-4.714 1.635-2.036 6.108-2.036-6.108-4.714-1.635 4.714-1.635L12.75 1.5z" /></svg>,
  SUBMENU_ARROW_RIGHT: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>,
  SEARCH: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>,
  PERSONALIZATION: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.456-2.456L12.5 17.25l1.178-.398a3.375 3.375 0 002.456-2.456L16.5 13.5l.398 1.178a3.375 3.375 0 002.456 2.456L20.25 18l-1.178.398a3.375 3.375 0 00-2.456 2.456z" /></svg>,
  APPS: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>,
};

export const PROJECTS_DATA: Project[] = [
  {
    id: 'proj-1',
    name: 'Portfolio OS',
    type: 'Folder',
    description: 'This very portfolio! An interactive desktop environment built with React, TypeScript, and Tailwind CSS. It features draggable and resizable windows, a functional taskbar, and several "apps" to showcase my work.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    url: 'https://github.com/your-username/portfolio-os',
  },
  {
    id: 'proj-2',
    name: 'AI Chat Assistant',
    type: 'File',
    description: 'A component within this portfolio that integrates with the Google Gemini API. It provides a conversational interface to learn more about my skills and projects.',
    technologies: ['React', 'Gemini API', 'TypeScript'],
  },
  {
    id: 'proj-3',
    name: 'E-commerce Platform',
    type: 'Folder',
    description: 'A full-stack e-commerce website with features like product catalog, shopping cart, user authentication, and order processing. Built with a Node.js backend and a React frontend.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    url: 'https://github.com/your-username/ecommerce-platform',
  },
];

export const WALLPAPERS = [
  { id: 1, url: 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=1920&auto=format&fit=crop' },
  { id: 2, url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1920&auto=format&fit=crop' },
  { id: 3, url: 'https://images.unsplash.com/photo-1511818963243-b3b3b3356b26?q=80&w=1920&auto=format&fit=crop' },
  { id: 4, url: 'https://images.unsplash.com/photo-1489599849927-2ee91e3b46d3?q=80&w=1920&auto=format&fit=crop' },
  { id: 5, url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1920&auto=format&fit=crop' },
  { id: 6, url: 'https://images.unsplash.com/photo-1542337809-507638d1733d?q=80&w=1920&auto=format&fit=crop' },
];

export const APP_METADATA = {
  [AppID.BROWSER]: { title: 'Browser', icon: ICONS.CHROME_BROWSER, defaultSize: { width: 1024, height: 768 } },
  [AppID.NOTEPAD]: { title: 'About Me', icon: ICONS.NOTEPAD, defaultSize: { width: 600, height: 400 } },
  [AppID.EXPLORER]: { title: 'File Explorer', icon: ICONS.EXPLORER, defaultSize: { width: 800, height: 600 } },
  [AppID.GEMINI_ASSISTANT]: { title: 'AI Assistant', icon: ICONS.GEMINI_ASSISTANT, defaultSize: { width: 450, height: 600 } },
  [AppID.RECYCLE_BIN]: { title: 'Recycle Bin', icon: ICONS.RECYCLE_BIN, defaultSize: { width: 500, height: 400 } },
  [AppID.SETTINGS]: { title: 'Settings', icon: ICONS.SETTINGS, defaultSize: { width: 700, height: 500 } },
  [AppID.TERMINAL]: { title: 'Terminal', icon: ICONS.TERMINAL, defaultSize: { width: 640, height: 480 } },
};

export const DESKTOP_ICONS = [
  { id: AppID.BROWSER, title: 'Browser', icon: APP_METADATA[AppID.BROWSER].icon },
  { id: AppID.NOTEPAD, title: 'About Me', icon: APP_METADATA[AppID.NOTEPAD].icon },
  { id: AppID.EXPLORER, title: 'File Explorer', icon: APP_METADATA[AppID.EXPLORER].icon },
  { id: AppID.GEMINI_ASSISTANT, title: 'AI Assistant', icon: APP_METADATA[AppID.GEMINI_ASSISTANT].icon },
  { id: AppID.RECYCLE_BIN, title: 'Recycle Bin', icon: APP_METADATA[AppID.RECYCLE_BIN].icon },
  { id: AppID.TERMINAL, title: 'Terminal', icon: APP_METADATA[AppID.TERMINAL].icon },
];