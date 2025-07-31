import React from 'react';
import type { AppMetadata } from '../types/index.js';

// Lazy load all apps
const PlaceholderApp = React.lazy(() => import('./PlaceholderApp'));
const SettingsApp = React.lazy(() => import('./SettingsApp'));
const FinderApp = React.lazy(() => import('./FinderApp'));
const TextEditApp = React.lazy(() => import('./TextEditApp'));
const MacPaintApp = React.lazy(() => import('./MacPaintApp'));
const VideosApp = React.lazy(() => import('./VideosApp'));
const iPodApp = React.lazy(() => import('./iPodApp'));
const SoundboardApp = React.lazy(() => import('./SoundboardApp'));
const SynthApp = React.lazy(() => import('./SynthApp'));
const PhotoBoothApp = React.lazy(() => import('./PhotoBoothApp'));
const TerminalApp = React.lazy(() => import('./TerminalApp'));
const MinesweeperApp = React.lazy(() => import('./MinesweeperApp'));
const VirtualPCApp = React.lazy(() => import('./VirtualPCApp'));

export const appRegistry: Record<string, AppMetadata> = {
  placeholder: {
    key: 'placeholder',
    name: 'miOS App',
    icon: '🖥️',
    defaultSize: { width: 400, height: 300 },
    component: PlaceholderApp,
    category: 'system',
  },
  settings: {
    key: 'settings',
    name: 'Settings',
    icon: '⚙️',
    defaultSize: { width: 600, height: 500 },
    component: SettingsApp,
    category: 'system',
  },
  finder: {
    key: 'finder',
    name: 'Finder',
    icon: '📁',
    defaultSize: { width: 700, height: 500 },
    component: FinderApp,
    category: 'system',
  },
  textedit: {
    key: 'textedit',
    name: 'TextEdit',
    icon: '📝',
    defaultSize: { width: 600, height: 400 },
    component: TextEditApp,
    category: 'utility',
  },
  macpaint: {
    key: 'macpaint',
    name: 'MacPaint',
    icon: '🎨',
    defaultSize: { width: 800, height: 600 },
    component: MacPaintApp,
    category: 'creative',
  },
  videos: {
    key: 'videos',
    name: 'Videos',
    icon: '📺',
    defaultSize: { width: 800, height: 500 },
    component: VideosApp,
    category: 'entertainment',
  },
  ipod: {
    key: 'ipod',
    name: 'iPod',
    icon: '🎵',
    defaultSize: { width: 400, height: 600 },
    component: iPodApp,
    category: 'entertainment',
  },
  soundboard: {
    key: 'soundboard',
    name: 'Soundboard',
    icon: '🔊',
    defaultSize: { width: 500, height: 400 },
    component: SoundboardApp,
    category: 'entertainment',
  },
  synth: {
    key: 'synth',
    name: 'Synth',
    icon: '🎹',
    defaultSize: { width: 700, height: 500 },
    component: SynthApp,
    category: 'creative',
  },
  photobooth: {
    key: 'photobooth',
    name: 'Photo Booth',
    icon: '📸',
    defaultSize: { width: 640, height: 480 },
    component: PhotoBoothApp,
    category: 'creative',
  },
  terminal: {
    key: 'terminal',
    name: 'Terminal',
    icon: '⚡',
    defaultSize: { width: 700, height: 400 },
    component: TerminalApp,
    category: 'development',
  },
  minesweeper: {
    key: 'minesweeper',
    name: 'Minesweeper',
    icon: '💣',
    defaultSize: { width: 400, height: 500 },
    component: MinesweeperApp,
    category: 'entertainment',
  },
  virtualpc: {
    key: 'virtualpc',
    name: 'Virtual PC',
    icon: '💻',
    defaultSize: { width: 800, height: 600 },
    component: VirtualPCApp,
    category: 'development',
  },
};

export const getAppComponent = (appKey: string): React.ComponentType<any> | null => {
  const app = appRegistry[appKey];
  return app ? app.component : null;
};

export const getAppMetadata = (appKey: string): AppMetadata | null => {
  return appRegistry[appKey] || null;
};

export const getAllApps = (): AppMetadata[] => {
  return Object.values(appRegistry);
};

export const getAppsByCategory = (category: string): AppMetadata[] => {
  return Object.values(appRegistry).filter(app => app.category === category);
};