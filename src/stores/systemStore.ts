import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SystemSettings, DesktopIcon } from '../types/index.js';

interface SystemStore {
  settings: SystemSettings;
  desktopIcons: DesktopIcon[];
  currentTime: Date;
  
  updateSettings: (settings: Partial<SystemSettings>) => void;
  addDesktopIcon: (icon: Omit<DesktopIcon, 'id'>) => void;
  removeDesktopIcon: (id: string) => void;
  updateDesktopIconPosition: (id: string, position: { x: number; y: number }) => void;
  updateTime: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
}

const defaultSettings: SystemSettings = {
  theme: 'aqua',
  wallpaper: 'nagrand',
  volume: 0.7,
  isMuted: false,
  time: new Date(),
  uiPreferences: {
    animationsEnabled: true,
    soundsEnabled: true,
  },
};

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
            volume: Math.max(0, Math.min(1, volume)) 
          },
        }));
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