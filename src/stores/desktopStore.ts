import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { DesktopIcon, SelectionRectangle, ContextMenu } from '../types/index.js';

interface DesktopStore {
  icons: DesktopIcon[];
  selectedIconIds: string[];
  selectionRectangle: SelectionRectangle;
  contextMenu: ContextMenu;
  isDraggingIcons: boolean;
  dragOffset: { x: number; y: number };

  // Icon management
  addIcon: (icon: Omit<DesktopIcon, 'id'>) => string;
  removeIcon: (id: string) => void;
  updateIconPosition: (id: string, position: { x: number; y: number }) => void;
  updateMultipleIconPositions: (updates: { id: string; position: { x: number; y: number } }[]) => void;

  // Selection management
  selectIcon: (id: string, multiSelect?: boolean) => void;
  deselectIcon: (id: string) => void;
  clearSelection: () => void;
  selectIconsInRectangle: (rect: { x: number; y: number; width: number; height: number }) => void;

  // Selection rectangle
  startSelectionRectangle: (position: { x: number; y: number }) => void;
  updateSelectionRectangle: (position: { x: number; y: number }) => void;
  endSelectionRectangle: () => void;

  // Context menu
  showContextMenu: (position: { x: number; y: number }, type: 'desktop' | 'icon', targetId?: string) => void;
  hideContextMenu: () => void;

  // Dragging
  startIconDrag: (offset: { x: number; y: number }) => void;
  endIconDrag: () => void;
}

const defaultIcons: DesktopIcon[] = [
  { id: 'icon-finder', appKey: 'finder', position: { x: 50, y: 120 }, name: 'Finder', icon: '📁' },
  { id: 'icon-textedit', appKey: 'textedit', position: { x: 50, y: 200 }, name: 'TextEdit', icon: '📝' },
  { id: 'icon-macpaint', appKey: 'macpaint', position: { x: 50, y: 280 }, name: 'MacPaint', icon: '🎨' },
  { id: 'icon-videos', appKey: 'videos', position: { x: 150, y: 120 }, name: 'Videos', icon: '📺' },
  { id: 'icon-ipod', appKey: 'ipod', position: { x: 150, y: 200 }, name: 'iPod', icon: '🎵' },
  { id: 'icon-soundboard', appKey: 'soundboard', position: { x: 150, y: 280 }, name: 'Soundboard', icon: '🔊' },
  { id: 'icon-synth', appKey: 'synth', position: { x: 250, y: 120 }, name: 'Synth', icon: '🎹' },
  { id: 'icon-photobooth', appKey: 'photobooth', position: { x: 250, y: 200 }, name: 'Photo Booth', icon: '📸' },
  { id: 'icon-terminal', appKey: 'terminal', position: { x: 250, y: 280 }, name: 'Terminal', icon: '⚡' },
  { id: 'icon-minesweeper', appKey: 'minesweeper', position: { x: 350, y: 120 }, name: 'Minesweeper', icon: '💣' },
  { id: 'icon-virtualpc', appKey: 'virtualpc', position: { x: 350, y: 200 }, name: 'Virtual PC', icon: '💻' },
  { id: 'icon-settings', appKey: 'settings', position: { x: 350, y: 280 }, name: 'Settings', icon: '⚙️' },
];

export const useDesktopStore = create<DesktopStore>()(
  persist(
    (set, get) => ({
      icons: defaultIcons,
      selectedIconIds: [],
      selectionRectangle: {
        isActive: false,
        startPosition: { x: 0, y: 0 },
        currentPosition: { x: 0, y: 0 },
      },
      contextMenu: {
        isVisible: false,
        position: { x: 0, y: 0 },
        type: 'desktop',
      },
      isDraggingIcons: false,
      dragOffset: { x: 0, y: 0 },

      addIcon: (iconData) => {
        const id = `icon-${Date.now()}`;
        const newIcon: DesktopIcon = { ...iconData, id };
        set((state) => ({ icons: [...state.icons, newIcon] }));
        return id;
      },

      removeIcon: (id) => {
        set((state) => ({
          icons: state.icons.filter(icon => icon.id !== id),
          selectedIconIds: state.selectedIconIds.filter(selectedId => selectedId !== id),
        }));
      },

      updateIconPosition: (id, position) => {
        set((state) => ({
          icons: state.icons.map(icon =>
            icon.id === id ? { ...icon, position } : icon
          ),
        }));
      },

      updateMultipleIconPositions: (updates) => {
        set((state) => ({
          icons: state.icons.map(icon => {
            const update = updates.find(u => u.id === icon.id);
            return update ? { ...icon, position: update.position } : icon;
          }),
        }));
      },

      selectIcon: (id, multiSelect = false) => {
        set((state) => {
          if (multiSelect) {
            const isSelected = state.selectedIconIds.includes(id);
            return {
              selectedIconIds: isSelected
                ? state.selectedIconIds.filter(selectedId => selectedId !== id)
                : [...state.selectedIconIds, id],
            };
          } else {
            return { selectedIconIds: [id] };
          }
        });
      },

      deselectIcon: (id) => {
        set((state) => ({
          selectedIconIds: state.selectedIconIds.filter(selectedId => selectedId !== id),
        }));
      },

      clearSelection: () => {
        set({ selectedIconIds: [] });
      },

      selectIconsInRectangle: (rect) => {
        const { icons } = get();
        const selectedIds = icons
          .filter(icon => {
            const iconRect = {
              x: icon.position.x,
              y: icon.position.y,
              width: 64, // Assume icon width
              height: 80, // Assume icon height including label
            };
            
            return (
              iconRect.x < rect.x + rect.width &&
              iconRect.x + iconRect.width > rect.x &&
              iconRect.y < rect.y + rect.height &&
              iconRect.y + iconRect.height > rect.y
            );
          })
          .map(icon => icon.id);

        set({ selectedIconIds: selectedIds });
      },

      startSelectionRectangle: (position) => {
        set({
          selectionRectangle: {
            isActive: true,
            startPosition: position,
            currentPosition: position,
          },
        });
      },

      updateSelectionRectangle: (position) => {
        set((state) => ({
          selectionRectangle: {
            ...state.selectionRectangle,
            currentPosition: position,
          },
        }));
      },

      endSelectionRectangle: () => {
        const { selectionRectangle } = get();
        if (selectionRectangle.isActive) {
          const rect = {
            x: Math.min(selectionRectangle.startPosition.x, selectionRectangle.currentPosition.x),
            y: Math.min(selectionRectangle.startPosition.y, selectionRectangle.currentPosition.y),
            width: Math.abs(selectionRectangle.currentPosition.x - selectionRectangle.startPosition.x),
            height: Math.abs(selectionRectangle.currentPosition.y - selectionRectangle.startPosition.y),
          };
          
          if (rect.width > 5 || rect.height > 5) { // Only select if rectangle is meaningful
            get().selectIconsInRectangle(rect);
          }
        }
        
        set({
          selectionRectangle: {
            isActive: false,
            startPosition: { x: 0, y: 0 },
            currentPosition: { x: 0, y: 0 },
          },
        });
      },

      showContextMenu: (position, type, targetId) => {
        set({
          contextMenu: {
            isVisible: true,
            position,
            type,
            targetId,
          },
        });
      },

      hideContextMenu: () => {
        set({
          contextMenu: {
            isVisible: false,
            position: { x: 0, y: 0 },
            type: 'desktop',
          },
        });
      },

      startIconDrag: (offset) => {
        set({ isDraggingIcons: true, dragOffset: offset });
      },

      endIconDrag: () => {
        set({ isDraggingIcons: false, dragOffset: { x: 0, y: 0 } });
      },
    }),
    {
      name: 'mios-desktop',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        icons: state.icons,
      }),
    }
  )
);