import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SystemSettings, DesktopIcon } from '../types/index.js';

interface SystemStore {
  settings: SystemSettings;
  desktopIcons: DesktopIcon[];
  currentTime: Date;
  isOnline: boolean;
  
  updateSettings: (settings: Partial<SystemSettings>) => void;
  addDesktopIcon: (icon: Omit<DesktopIcon, 'id'>) => void;
  removeDesktopIcon: (id: string) => void;
  updateDesktopIconPosition: (id: string, position: { x: number; y: number }) => void;
  updateTime: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  setOnlineStatus: (isOnline: boolean) => void;
}

const defaultSettings: SystemSettings = {
  theme: 'aqua',
  wallpaper: 'aqua-blue',
  volume: 0.7,
  isMuted: false,
  time: new Date(),
  uiPreferences: {
    animationsEnabled: true,
    soundsEnabled: true,
    textSize: 'small',
  },
};

export const wallpapers = [
  {
    id: 'aqua-blue',
    name: 'Aqua Blue',
    style: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    style: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    style: 'linear-gradient(135deg, #FF8A80 0%, #FF5722 100%)',
  },
  {
    id: 'forest-mist',
    name: 'Forest Mist',
    style: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
  },
  {
    id: 'purple-rain',
    name: 'Purple Rain',
    style: 'linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)',
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    style: 'linear-gradient(135deg, #FFC107 0%, #FF9800 100%)',
  },
  {
    id: 'arctic-aurora',
    name: 'Arctic Aurora',
    style: 'linear-gradient(135deg, #00BCD4 0%, #009688 100%)',
  },
  {
    id: 'cosmic-dust',
    name: 'Cosmic Dust',
    style: 'linear-gradient(135deg, #3F51B5 0%, #1A237E 100%)',
  },
];

const defaultDesktopIcons: DesktopIcon[] = [
  {
    id: 'icon-1',
    appKey: 'placeholder',
    position: { x: 50, y: 120 },
    name: 'miOS App',
    icon: '🖥️',
  },
];

export const useSystemStore = create<SystemStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      desktopIcons: defaultDesktopIcons,
      currentTime: new Date(),
      isOnline: navigator.onLine,

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      addDesktopIcon: (iconData) => {
        const id = `icon-${Date.now()}`;
        const newIcon: DesktopIcon = { ...iconData, id };
        
        set((state) => ({
          desktopIcons: [...state.desktopIcons, newIcon],
        }));
      },

      removeDesktopIcon: (id) => {
        set((state) => ({
          desktopIcons: state.desktopIcons.filter(icon => icon.id !== id),
        }));
      },

      updateDesktopIconPosition: (id, position) => {
        set((state) => ({
          desktopIcons: state.desktopIcons.map(icon =>
            icon.id === id ? { ...icon, position } : icon
          ),
        }));
      },

      updateTime: () => {
        set({ currentTime: new Date() });
      },

      toggleMute: () => {
        set((state) => ({
          settings: { 
            ...state.settings, 
            isMuted: !state.settings.isMuted 
          },
        }));
      },

      setVolume: (volume) => {
        set((state) => ({
          settings: { 
            ...state.settings, 
            volume: Math.max(0, Math.min(1, volume)),
            isMuted: false // Unmute when setting volume
          },
        }));
      },

      setOnlineStatus: (isOnline) => {
        set({ isOnline });
      },
    }),
    {
      name: 'mios-system',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: state.settings,
        desktopIcons: state.desktopIcons,
      }),
    }
  )
);

// Update time every second
setInterval(() => {
  useSystemStore.getState().updateTime();
}, 1000);

// Monitor online status
window.addEventListener('online', () => {
  useSystemStore.getState().setOnlineStatus(true);
});

window.addEventListener('offline', () => {
  useSystemStore.getState().setOnlineStatus(false);
});