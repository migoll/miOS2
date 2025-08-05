import React from "react";
import type { AppMetadata } from "../types/index.js";

// Direct imports for instant loading
import PlaceholderApp from "./PlaceholderApp";
import SettingsApp from "./SettingsApp";
import FinderApp from "./FinderApp";
import TextEditApp from "./TextEditApp";
import MacPaintApp from "./MacPaintApp";
import VideosApp from "./VideosApp";
import iPodApp from "./iPodApp";
import SoundboardApp from "./SoundboardApp";
import SynthApp from "./SynthApp";
import PhotoBoothApp from "./PhotoBoothApp";
import TerminalApp from "./TerminalApp";
import MinesweeperApp from "./MinesweeperApp";
import VirtualPCApp from "./VirtualPCApp";
import AboutMeApp from "./AboutMeApp";
import BrowserApp from "./BrowserApp";
import ProjectsApp from "./ProjectsApp";
import ResumeApp from "./ResumeApp";
import CryptoApp from "./CryptoApp";

export const appRegistry: Record<string, AppMetadata> = {
  placeholder: {
    key: "placeholder",
    name: "miOS App",
    icon: "🖥️",
    defaultSize: { width: 400, height: 300 },
    component: PlaceholderApp,
    category: "system",
  },
  settings: {
    key: "settings",
    name: "Settings",
    icon: "⚙️",
    defaultSize: { width: 800, height: 600 },
    component: SettingsApp,
    category: "system",
  },
  finder: {
    key: "finder",
    name: "Finder",
    icon: "📁",
    defaultSize: { width: 700, height: 500 },
    component: FinderApp,
    category: "system",
  },
  textedit: {
    key: "textedit",
    name: "TextEdit",
    icon: "📝",
    defaultSize: { width: 600, height: 400 },
    component: TextEditApp,
    category: "utility",
  },
  macpaint: {
    key: "macpaint",
    name: "MacPaint",
    icon: "🎨",
    defaultSize: { width: 800, height: 600 },
    component: MacPaintApp,
    category: "creative",
  },
  videos: {
    key: "videos",
    name: "Videos",
    icon: "📺",
    defaultSize: { width: 800, height: 500 },
    component: VideosApp,
    category: "entertainment",
  },
  ipod: {
    key: "ipod",
    name: "iPod",
    icon: "🎵",
    defaultSize: { width: 400, height: 600 },
    component: iPodApp,
    category: "entertainment",
  },
  soundboard: {
    key: "soundboard",
    name: "Soundboard",
    icon: "🔊",
    defaultSize: { width: 500, height: 400 },
    component: SoundboardApp,
    category: "entertainment",
  },
  synth: {
    key: "synth",
    name: "Synth",
    icon: "🎹",
    defaultSize: { width: 700, height: 500 },
    component: SynthApp,
    category: "creative",
  },
  photobooth: {
    key: "photobooth",
    name: "Photo Booth",
    icon: "📸",
    defaultSize: { width: 640, height: 480 },
    component: PhotoBoothApp,
    category: "creative",
  },
  terminal: {
    key: "terminal",
    name: "Terminal",
    icon: "⚡",
    defaultSize: { width: 700, height: 400 },
    component: TerminalApp,
    category: "development",
  },
  minesweeper: {
    key: "minesweeper",
    name: "Minesweeper",
    icon: "💣",
    defaultSize: { width: 400, height: 500 },
    component: MinesweeperApp,
    category: "entertainment",
  },
  virtualpc: {
    key: "virtualpc",
    name: "Virtual PC",
    icon: "💻",
    defaultSize: { width: 800, height: 600 },
    component: VirtualPCApp,
    category: "development",
  },
  aboutme: {
    key: "aboutme",
    name: "About Me",
    icon: "👤",
    defaultSize: { width: 700, height: 600 },
    component: AboutMeApp,
    category: "utility",
  },
  browser: {
    key: "browser",
    name: "Browser",
    icon: "🌐",
    defaultSize: { width: 900, height: 700 },
    component: BrowserApp,
    category: "utility",
  },
  projects: {
    key: "projects",
    name: "Projects",
    icon: "🚀",
    defaultSize: { width: 800, height: 600 },
    component: ProjectsApp,
    category: "utility",
  },
  resume: {
    key: "resume",
    name: "Resume",
    icon: "📄",
    defaultSize: { width: 700, height: 600 },
    component: ResumeApp,
    category: "utility",
  },
  crypto: {
    key: "crypto",
    name: "Crypto",
    icon: "blockchain_10439415.png",
    defaultSize: { width: 1000, height: 700 },
    component: CryptoApp,
    category: "utility",
  },
};

export const getAppComponent = (appKey: string): React.ComponentType | null => {
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
  return Object.values(appRegistry).filter((app) => app.category === category);
};
