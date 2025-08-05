import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  DesktopIcon,
  SelectionRectangle,
  ContextMenu,
} from "../types/index.js";

interface DesktopStore {
  icons: DesktopIcon[];
  selectedIconIds: string[];
  selectionRectangle: SelectionRectangle;
  contextMenu: ContextMenu;

  // Ghost dragging state
  isDraggingIcons: boolean;
  dragOffset: { x: number; y: number };
  draggedIconIds: string[];
  disableIconTransitions: boolean;

  // Version for cache invalidation
  version: number;

  // Icon management
  addIcon: (icon: Omit<DesktopIcon, "id">) => string;
  removeIcon: (id: string) => void;
  updateIconPosition: (id: string, position: { x: number; y: number }) => void;
  updateMultipleIconPositions: (
    updates: { id: string; position: { x: number; y: number } }[]
  ) => void;

  // Selection management
  selectIcon: (id: string, multiSelect?: boolean) => void;
  deselectIcon: (id: string) => void;
  clearSelection: () => void;
  selectIconsInRectangle: (rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void;

  // Selection rectangle
  startSelectionRectangle: (position: { x: number; y: number }) => void;
  updateSelectionRectangle: (position: { x: number; y: number }) => void;
  endSelectionRectangle: () => void;

  // Context menu
  showContextMenu: (
    position: { x: number; y: number },
    type: "desktop" | "icon",
    targetId?: string
  ) => void;
  hideContextMenu: () => void;

  // Ghost dragging actions
  startIconDrag: (iconIds: string[], offset: { x: number; y: number }) => void;
  updateIconDrag: (offset: { x: number; y: number }) => void;
  endIconDrag: (
    finalPositions: Array<{ id: string; position: { x: number; y: number } }>
  ) => void;

  tidyUpIcons: () => void;
  resetToDefaults: () => void;

  // Desktop icon management
  removeFromDesktop: (iconId: string) => void;
  addToDesktop: (appKey: string, position: { x: number; y: number }) => void;
}

const defaultIcons: DesktopIcon[] = [
  {
    id: "icon-textedit",
    appKey: "textedit",
    position: { x: 20, y: 52 },
    name: "TextEdit",
    icon: "📝",
  },
  {
    id: "icon-macpaint",
    appKey: "macpaint",
    position: { x: 20, y: 137 },
    name: "MacPaint",
    icon: "🎨",
  },
  {
    id: "icon-videos",
    appKey: "videos",
    position: { x: 120, y: 52 },
    name: "Videos",
    icon: "📺",
  },
  {
    id: "icon-ipod",
    appKey: "ipod",
    position: { x: 120, y: 137 },
    name: "iPod",
    icon: "🎵",
  },
  {
    id: "icon-soundboard",
    appKey: "soundboard",
    position: { x: 20, y: 222 },
    name: "Soundboard",
    icon: "🔊",
  },
  {
    id: "icon-synth",
    appKey: "synth",
    position: { x: 220, y: 52 },
    name: "Synth",
    icon: "🎹",
  },
  {
    id: "icon-photobooth",
    appKey: "photobooth",
    position: { x: 220, y: 137 },
    name: "Photo Booth",
    icon: "📸",
  },
  {
    id: "icon-terminal",
    appKey: "terminal",
    position: { x: 120, y: 222 },
    name: "Terminal",
    icon: "⚡",
  },
  {
    id: "icon-minesweeper",
    appKey: "minesweeper",
    position: { x: 320, y: 52 },
    name: "Minesweeper",
    icon: "💣",
  },
  {
    id: "icon-virtualpc",
    appKey: "virtualpc",
    position: { x: 350, y: 200 },
    name: "Virtual PC",
    icon: "💻",
  },
  {
    id: "icon-settings",
    appKey: "settings",
    position: { x: 350, y: 280 },
    name: "Settings",
    icon: "⚙️",
  },
  // Portfolio Apps
  {
    id: "icon-aboutme",
    appKey: "aboutme",
    position: { x: 450, y: 120 },
    name: "About Me",
    icon: "👤",
  },
  {
    id: "icon-browser",
    appKey: "browser",
    position: { x: 450, y: 200 },
    name: "Browser",
    icon: "🌐",
  },
  {
    id: "icon-projects",
    appKey: "projects",
    position: { x: 450, y: 280 },
    name: "Projects",
    icon: "🚀",
  },
  {
    id: "icon-resume",
    appKey: "resume",
    position: { x: 550, y: 120 },
    name: "Resume",
    icon: "📄",
  },
  {
    id: "icon-crypto",
    appKey: "crypto",
    position: { x: 520, y: 135 },
    name: "Crypto",
    icon: "blockchain_10439415.png",
  },
];

const CURRENT_VERSION = 13;

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
        type: "desktop",
      },

      // Ghost dragging initial state
      isDraggingIcons: false,
      dragOffset: { x: 0, y: 0 },
      draggedIconIds: [],
      disableIconTransitions: false,

      // Version for cache invalidation
      version: CURRENT_VERSION,

      addIcon: (iconData) => {
        const id = `icon-${Date.now()}`;
        const newIcon: DesktopIcon = { ...iconData, id };
        set((state) => ({ icons: [...state.icons, newIcon] }));
        return id;
      },

      removeIcon: (id) => {
        set((state) => ({
          icons: state.icons.filter((icon) => icon.id !== id),
          selectedIconIds: state.selectedIconIds.filter(
            (selectedId) => selectedId !== id
          ),
        }));
      },

      updateIconPosition: (id, position) => {
        set((state) => ({
          icons: state.icons.map((icon) =>
            icon.id === id ? { ...icon, position } : icon
          ),
        }));
      },

      updateMultipleIconPositions: (updates) => {
        set((state) => ({
          icons: state.icons.map((icon) => {
            const update = updates.find((u) => u.id === icon.id);
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
                ? state.selectedIconIds.filter(
                    (selectedId) => selectedId !== id
                  )
                : [...state.selectedIconIds, id],
            };
          } else {
            return { selectedIconIds: [id] };
          }
        });
      },

      deselectIcon: (id) => {
        set((state) => ({
          selectedIconIds: state.selectedIconIds.filter(
            (selectedId) => selectedId !== id
          ),
        }));
      },

      clearSelection: () => {
        set({ selectedIconIds: [] });
      },

      selectIconsInRectangle: (rect) => {
        const { icons } = get();
        const selectedIds = icons
          .filter((icon) => {
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
          .map((icon) => icon.id);

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
            x: Math.min(
              selectionRectangle.startPosition.x,
              selectionRectangle.currentPosition.x
            ),
            y: Math.min(
              selectionRectangle.startPosition.y,
              selectionRectangle.currentPosition.y
            ),
            width: Math.abs(
              selectionRectangle.currentPosition.x -
                selectionRectangle.startPosition.x
            ),
            height: Math.abs(
              selectionRectangle.currentPosition.y -
                selectionRectangle.startPosition.y
            ),
          };

          if (rect.width > 5 || rect.height > 5) {
            // Only select if rectangle is meaningful
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
            type: "desktop",
          },
        });
      },

      // Ghost dragging methods
      startIconDrag: (iconIds, offset) => {
        set({
          isDraggingIcons: true,
          dragOffset: offset,
          draggedIconIds: iconIds,
          disableIconTransitions: true,
        });
      },

      updateIconDrag: (offset) => {
        set({ dragOffset: offset });
      },

      endIconDrag: (finalPositions) => {
        // Update all icon positions and clear ghost state
        set((state) => ({
          icons: state.icons.map((icon) => {
            const update = finalPositions.find((pos) => pos.id === icon.id);
            return update ? { ...icon, position: update.position } : icon;
          }),
          isDraggingIcons: false,
          dragOffset: { x: 0, y: 0 },
          draggedIconIds: [],
        }));

        // Re-enable transitions after a brief delay
        setTimeout(() => {
          set({ disableIconTransitions: false });
        }, 50);
      },

      tidyUpIcons: () => {
        set((state) => {
          const iconSpacing = { x: 100, y: 85 }; // Windows-style grid spacing
          const margin = 20; // Consistent margin from all edges
          const startX = margin;
          const startY = 32 + margin; // Menu bar (32px) + margin
          const maxColumns = Math.floor(
            (window.innerWidth - margin * 2) / iconSpacing.x
          );

          const arrangedIcons = state.icons.map((icon, index) => {
            const row = Math.floor(index / maxColumns);
            const col = index % maxColumns;

            return {
              ...icon,
              position: {
                x: startX + col * iconSpacing.x,
                y: startY + row * iconSpacing.y,
              },
            };
          });

          return { icons: arrangedIcons };
        });
      },

      // Debug function to reset icons
      resetToDefaults: () => {
        set({
          icons: defaultIcons,
          version: CURRENT_VERSION,
        });
      },

      // Desktop icon management functions
      removeFromDesktop: (iconId) => {
        set((state) => ({
          icons: state.icons.filter((icon) => icon.id !== iconId),
          selectedIconIds: state.selectedIconIds.filter((id) => id !== iconId),
        }));
      },

      addToDesktop: (appKey, position) => {
        // Import app registry to get app info
        import("../apps/registry").then(({ appRegistry }) => {
          const appInfo = appRegistry[appKey];
          if (!appInfo) return;

          const newIcon: DesktopIcon = {
            id: `icon-${appKey}-${Date.now()}`,
            appKey,
            position,
            name: appInfo.name,
            icon: appInfo.icon,
          };

          set((state) => ({
            icons: [...state.icons, newIcon],
          }));
        });
      },
    }),
    {
      name: "mios-desktop",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        icons: state.icons,
        version: state.version,
      }),
      onRehydrateStorage: () => (state) => {
        // Check if version has changed and reset icons if needed
        if (state && state.version !== CURRENT_VERSION) {
          state.icons = defaultIcons;
          state.version = CURRENT_VERSION;
        }
      },
    }
  )
);
