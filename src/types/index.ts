// Core type definitions for miOS

export interface WindowState {
  id: string;
  title: string;
  appKey: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  isFocused: boolean;
}

export interface AppMetadata {
  key: string;
  name: string;
  icon: string;
  defaultSize: { width: number; height: number };
  component: React.ComponentType<any>;
  category?:
    | "system"
    | "utility"
    | "creative"
    | "entertainment"
    | "development";
}

export interface DesktopIcon {
  id: string;
  appKey: string;
  position: { x: number; y: number };
  name: string;
  icon: string;
  isSelected?: boolean;
  isFolder?: boolean;
  folderContents?: string[]; // Array of app keys contained in this folder
  parentFolder?: string; // ID of parent folder if this icon is inside a folder
}

export interface SelectionRectangle {
  isActive: boolean;
  startPosition: { x: number; y: number };
  currentPosition: { x: number; y: number };
}

export interface ContextMenu {
  isVisible: boolean;
  position: { x: number; y: number };
  type: "desktop" | "icon" | "window";
  targetId?: string;
}

export interface Wallpaper {
  id: string;
  name: string;
  style: string;
  category?: "gradient" | "basic";
}

export interface SystemSettings {
  theme: "dark" | "light"; // Updated to support dark/light mode toggle
  wallpaper: string;
  volume: number;
  isMuted: boolean;
  time: Date;
  uiPreferences: {
    animationsEnabled: boolean;
    soundsEnabled: boolean;
    textSize: "small" | "medium" | "large" | "giga";
  };
}

export interface FileSystemEntity {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: string[]; // IDs of child entities
  parentId?: string;
  path: string;
  createdAt: Date;
  updatedAt: Date;
  size?: number;
}

export interface Sound {
  name: string;
  url: string;
  audio?: HTMLAudioElement;
}

export type SoundName =
  | "click"
  | "open"
  | "close"
  | "minimize"
  | "error"
  | "hover"
  | "drop"
  | "select"
  | "menu_open"
  | "menu_close";

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string;
  action: () => void;
  separator?: boolean;
  disabled?: boolean;
  submenu?: ContextMenuItem[];
}
