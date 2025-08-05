import React, { useCallback, useRef } from "react";
import { useDesktopStore } from "../stores/desktopStore";
import { useSystemStore, wallpapers } from "../stores/systemStore";
import { useSound } from "../utils/hooks";
import { DesktopIcon } from "./DesktopIcon";
import { SelectionRectangle } from "./SelectionRectangle";
import { ContextMenu } from "./ContextMenu";
import { WindowManager } from "./WindowManager";
import { MenuBar } from "./MenuBar";
import { Taskbar } from "./Taskbar";

export const Desktop: React.FC = () => {
  const icons = useDesktopStore((state) => state.icons);
  const clearSelection = useDesktopStore((state) => state.clearSelection);
  const hideContextMenu = useDesktopStore((state) => state.hideContextMenu);
  const settings = useSystemStore((state) => state.settings);
  const startSelectionRectangle = useDesktopStore(
    (state) => state.startSelectionRectangle
  );
  const updateSelectionRectangle = useDesktopStore(
    (state) => state.updateSelectionRectangle
  );
  const endSelectionRectangle = useDesktopStore(
    (state) => state.endSelectionRectangle
  );
  const showContextMenu = useDesktopStore((state) => state.showContextMenu);
  const selectionRectangle = useDesktopStore(
    (state) => state.selectionRectangle
  );

  const { playSound } = useSound();
  const isSelecting = useRef(false);
  const desktopRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 2) return; // Don't start selection on right-click

      const target = e.target as HTMLElement;
      if (
        target === desktopRef.current ||
        target.classList.contains("desktop-surface")
      ) {
        e.preventDefault();
        clearSelection();
        hideContextMenu();

        const rect = desktopRef.current!.getBoundingClientRect();
        const startPos = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };

        startSelectionRectangle(startPos);
        isSelecting.current = true;
        playSound("select");

        const handleMouseMove = (e: MouseEvent) => {
          if (isSelecting.current) {
            const currentPos = {
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            };
            updateSelectionRectangle(currentPos);
          }
        };

        const handleMouseUp = () => {
          if (isSelecting.current) {
            endSelectionRectangle();
            isSelecting.current = false;
          }
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }
    },
    [
      clearSelection,
      hideContextMenu,
      startSelectionRectangle,
      updateSelectionRectangle,
      endSelectionRectangle,
      playSound,
    ]
  );

  const handleRightClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const target = e.target as HTMLElement;

      if (
        target === desktopRef.current ||
        target.classList.contains("desktop-surface")
      ) {
        clearSelection();
        showContextMenu({ x: e.clientX, y: e.clientY }, "desktop");
      }
    },
    [clearSelection, showContextMenu]
  );

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const appKey = e.dataTransfer.getData("application/app-key");
    if (appKey) {
      const rect = desktopRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top - 32; // Account for menu bar
        useDesktopStore.getState().addToDesktop(appKey, { x, y });
      }
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleRefresh = useCallback(() => {
    // Refresh desktop - could trigger re-render or reload state
    window.location.reload();
  }, []);

  const tidyUpIcons = useDesktopStore((state) => state.tidyUpIcons);

  const handleArrangeIcons = useCallback(() => {
    tidyUpIcons();
    playSound("click");
  }, [tidyUpIcons, playSound]);

  const handleNewFolder = useCallback(() => {
    // TODO: Implement new folder creation
    playSound("click");
  }, [playSound]);

  const handleAbout = useCallback(() => {
    // TODO: Show about dialog
    playSound("click");
  }, [playSound]);

  const currentWallpaper =
    wallpapers.find((w) => w.id === settings.wallpaper) || wallpapers[0];
  const isDarkMode = settings.theme === "dark";

  // Apply theme to document body
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.remove("light");
      document.body.style.background = "#111111";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.add("light");
      document.body.style.background = "#F0F0F0";
    }
  }, [isDarkMode]);

  return (
    <div
      className={`relative w-full h-full overflow-hidden font-mono ${
        isDarkMode ? "dark" : ""
      }`}
    >
      {/* Clean wallpaper background - no animated elements */}
      <div
        className="absolute inset-0"
        style={{ background: currentWallpaper.style }}
      />

      {/* Menu bar */}
      <MenuBar />

      {/* Desktop surface */}
      <div
        ref={desktopRef}
        className="desktop-surface absolute inset-0 pt-8"
        onMouseDown={handleMouseDown}
        onContextMenu={handleRightClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          cursor: selectionRectangle.isActive ? "crosshair" : "default",
        }}
      >
        {/* Desktop icons - only show icons not inside folders */}
        {icons
          .filter((icon) => !icon.parentFolder)
          .map((icon) => (
            <DesktopIcon key={icon.id} icon={icon} />
          ))}

        {/* Selection rectangle */}
        <SelectionRectangle />

        {/* Context menu */}
        <ContextMenu
          onNewFolder={handleNewFolder}
          onRefresh={handleRefresh}
          onArrangeIcons={handleArrangeIcons}
          onAbout={handleAbout}
        />
      </div>

      {/* Window manager */}
      <WindowManager />

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
};
