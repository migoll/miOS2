import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { SystemSettings, DesktopIcon, Wallpaper } from "../types/index.js";

interface SystemStore {
  settings: SystemSettings;
  desktopIcons: DesktopIcon[];
  currentTime: Date;
  isOnline: boolean;

  updateSettings: (settings: Partial<SystemSettings>) => void;
  addDesktopIcon: (icon: Omit<DesktopIcon, "id">) => void;
  removeDesktopIcon: (id: string) => void;
  updateDesktopIconPosition: (
    id: string,
    position: { x: number; y: number }
  ) => void;
  updateTime: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  setOnlineStatus: (isOnline: boolean) => void;
}

const defaultSettings: SystemSettings = {
  theme: "dark", // Default to dark mode as specified
  wallpaper: "gradient-black", // Default to first gradient instead of solid color
  volume: 0.7,
  isMuted: false,
  time: new Date(),
  uiPreferences: {
    animationsEnabled: true,
    soundsEnabled: true,
    textSize: "small",
  },
};

// Dynamic wallpaper loading from miOS wallpapers folder
// Note: In a real implementation, you'd use dynamic imports or a build-time script
// For now, manually add new files here as you add them to the folder
const wallpaperFiles = [
  "gradient-black.png",
  "gradient-pink.png",
  "gradient-gray.png",
  "gradient-blue.png",
  "gradient-teal.png",
  "gradient-purple.png",
  "gradient-salmon.png",
];

// Generate wallpapers from the miOS wallpapers folder
const dynamicWallpapers: Wallpaper[] = wallpaperFiles.map((filename) => {
  const name = filename
    .replace(/\.(png|jpg|jpeg|webp)$/i, "") // Remove file extension
    .split("-") // Split by hyphen
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(" "); // Join with spaces

  return {
    id: filename.replace(/\.(png|jpg|jpeg|webp)$/i, ""), // Use filename without extension as ID
    name: name,
    style: `url('/src/assets/miOS wallpapers/${filename}') bottom/cover no-repeat`,
    category: "gradient", // Add category for organization
  };
});

// Basic/solid color wallpapers
const basicWallpapers: Wallpaper[] = [
  {
    id: "vercel-dark",
    name: "Vercel Dark",
    style: "#111111",
    category: "basic",
  },
  {
    id: "vercel-light",
    name: "Vercel Light",
    style: "#F0F0F0",
    category: "basic",
  },
  {
    id: "minimal-gradient",
    name: "Minimal Gradient",
    style: "linear-gradient(135deg, #111111 0%, #1a1a1a 100%)",
    category: "basic",
  },
  {
    id: "subtle-purple",
    name: "Subtle Purple",
    style: "linear-gradient(135deg, #111111 0%, #1a1129 100%)",
    category: "basic",
  },
  {
    id: "soft-blue",
    name: "Soft Blue",
    style: "linear-gradient(135deg, #111111 0%, #111929 100%)",
    category: "basic",
  },
];

// Organized wallpapers: gradients first, then basic
export const wallpapers: Wallpaper[] = [
  ...dynamicWallpapers, // Gradient backgrounds first
  ...basicWallpapers, // Basic backgrounds second
];

const defaultDesktopIcons: DesktopIcon[] = [
  // This is now managed by desktopStore.ts
];

export const useSystemStore = create<SystemStore>()(
  persist(
    (set) => ({
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
          desktopIcons: state.desktopIcons.filter((icon) => icon.id !== id),
        }));
      },

      updateDesktopIconPosition: (id, position) => {
        set((state) => ({
          desktopIcons: state.desktopIcons.map((icon) =>
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
            isMuted: !state.settings.isMuted,
          },
        }));
      },

      setVolume: (volume) => {
        set((state) => ({
          settings: {
            ...state.settings,
            volume: Math.max(0, Math.min(1, volume)),
            isMuted: false, // Unmute when setting volume
          },
        }));
      },

      setOnlineStatus: (isOnline) => {
        set({ isOnline });
      },
    }),
    {
      name: "mios-system",
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
window.addEventListener("online", () => {
  useSystemStore.getState().setOnlineStatus(true);
});

window.addEventListener("offline", () => {
  useSystemStore.getState().setOnlineStatus(false);
});
