import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { WindowState } from '../types/index.js';
import { appRegistry } from '../apps/registry';

interface WindowStore {
  windows: WindowState[];
  focusedWindowId: string | null;
  nextZIndex: number;
  
  openWindow: (appKey: string, title: string, size?: { width: number; height: number }) => string;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
  getWindow: (id: string) => WindowState | undefined;
}

export const useWindowStore = create<WindowStore>()(
  persist(
    (set, get) => ({
      windows: [],
      focusedWindowId: null,
      nextZIndex: 1000,

      openWindow: (appKey, title, size) => {
        const id = `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const { nextZIndex } = get();
        
        // Use app's default size if not provided
        const appMetadata = appRegistry[appKey];
        const windowSize = size || appMetadata?.defaultSize || { width: 600, height: 400 };
        
        // Center the window on screen with some offset for multiple windows
        const windowOffset = get().windows.length * 30;
        const centerX = (globalThis.window.innerWidth - windowSize.width) / 2 + windowOffset;
        const centerY = (globalThis.window.innerHeight - windowSize.height) / 2 + windowOffset;
        
        const newWindow: WindowState = {
          id,
          title,
          appKey,
          position: { 
            x: Math.max(0, centerX), 
            y: Math.max(32, centerY) // 32px for menu bar
          },
          size: windowSize,
          isOpen: true,
          isMinimized: false,
          zIndex: nextZIndex,
          isFocused: true,
        };

        set((state) => ({
          windows: [...state.windows.map(w => ({ ...w, isFocused: false })), newWindow],
          focusedWindowId: id,
          nextZIndex: nextZIndex + 1,
        }));

        return id;
      },

      closeWindow: (id) => {
        set((state) => {
          const remainingWindows = state.windows.filter(w => w.id !== id);
          const newFocusedId = remainingWindows.length > 0 ? remainingWindows[remainingWindows.length - 1].id : null;
          
          return {
            windows: remainingWindows.map(w => ({ 
              ...w, 
              isFocused: w.id === newFocusedId 
            })),
            focusedWindowId: newFocusedId,
          };
        });
      },

      focusWindow: (id) => {
        const { nextZIndex } = get();
        
        set((state) => ({
          windows: state.windows.map(w => ({ 
            ...w, 
            isFocused: w.id === id,
            zIndex: w.id === id ? nextZIndex : w.zIndex,
          })),
          focusedWindowId: id,
          nextZIndex: nextZIndex + 1,
        }));
      },

      minimizeWindow: (id) => {
        set((state) => ({
          windows: state.windows.map(w => 
            w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
          ),
        }));
      },

      updateWindowPosition: (id, position) => {
        set((state) => ({
          windows: state.windows.map(w => 
            w.id === id ? { ...w, position } : w
          ),
        }));
      },

      updateWindowSize: (id, size) => {
        set((state) => ({
          windows: state.windows.map(w => 
            w.id === id ? { ...w, size } : w
          ),
        }));
      },

      getWindow: (id) => {
        return get().windows.find(w => w.id === id);
      },
    }),
    {
      name: 'mios-windows',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        // Only persist zIndex, not window positions or states
        nextZIndex: state.nextZIndex,
      }),
    }
  )
);