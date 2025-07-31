import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { WindowState } from '../types/index.js';

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

      openWindow: (appKey, title, size = { width: 600, height: 400 }) => {
        const id = `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const { nextZIndex } = get();
        
        const newWindow: WindowState = {
          id,
          title,
          appKey,
          position: { 
            x: 100 + (get().windows.length * 30), 
            y: 100 + (get().windows.length * 30) 
          },
          size,
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
        windows: state.windows.map(w => ({ ...w, isFocused: false })),
        nextZIndex: state.nextZIndex,
      }),
    }
  )
);