import React, { useState, useCallback } from "react";
import { useDesktopStore } from "../stores/desktopStore";
import { useWindowStore } from "../stores/windowStore";
import { useSystemStore } from "../stores/systemStore";
import { useTextSize } from "../utils/textSize";
import type { DesktopIcon as DesktopIconType } from "../types/index.js";

interface DesktopIconProps {
  icon: DesktopIconType;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ icon }) => {
  const [isDragging, setIsDragging] = useState(false);

  const settings = useSystemStore((state) => state.settings);
  const { getIconTextSizeClass } = useTextSize();
  const isDarkMode = settings.theme === "dark";

  const selectedIconIds = useDesktopStore((state) => state.selectedIconIds);
  const selectIcon = useDesktopStore((state) => state.selectIcon);
  const showContextMenu = useDesktopStore((state) => state.showContextMenu);
  const icons = useDesktopStore((state) => state.icons);

  // Ghost dragging state
  const isDraggingIcons = useDesktopStore((state) => state.isDraggingIcons);
  const globalDragOffset = useDesktopStore((state) => state.dragOffset);
  const draggedIconIds = useDesktopStore((state) => state.draggedIconIds);
  const disableIconTransitions = useDesktopStore(
    (state) => state.disableIconTransitions
  );
  const startIconDrag = useDesktopStore((state) => state.startIconDrag);
  const updateIconDrag = useDesktopStore((state) => state.updateIconDrag);
  const endIconDrag = useDesktopStore((state) => state.endIconDrag);

  const openWindow = useWindowStore((state) => state.openWindow);

  const isSelected = selectedIconIds.includes(icon.id);
  const isBeingDragged = draggedIconIds.includes(icon.id);
  const selectedIcons = icons.filter((i) => selectedIconIds.includes(i.id));

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 2) return; // Ignore right-click for dragging

      e.preventDefault();
      e.stopPropagation();

      const startMouseX = e.clientX;
      const startMouseY = e.clientY;

      // If this icon isn't selected, select it first
      if (!isSelected) {
        selectIcon(icon.id, e.metaKey || e.ctrlKey);
      }

      // Determine which icons will be dragged (use current selection)
      const iconsToDrag = isSelected ? selectedIcons : [icon];
      const iconIds = iconsToDrag.map((i) => i.id);

      // Capture initial positions
      const initialPositions = iconsToDrag.map((icon) => ({
        id: icon.id,
        x: icon.position.x,
        y: icon.position.y,
      }));

      let hasDragged = false;

      let currentDeltaX = 0;
      let currentDeltaY = 0;

      const handleMouseMove = (e: MouseEvent) => {
        currentDeltaX = e.clientX - startMouseX;
        currentDeltaY = e.clientY - startMouseY;

        // Start ghost dragging with minimal threshold
        if (
          !hasDragged &&
          (Math.abs(currentDeltaX) > 2 || Math.abs(currentDeltaY) > 2)
        ) {
          setIsDragging(true);
          hasDragged = true;

          // Start ghost dragging - this shows ghost copies and disables transitions globally
          startIconDrag(iconIds, { x: 0, y: 0 });
        }

        if (hasDragged) {
          // Update ghost positions instantly with CSS transforms
          updateIconDrag({ x: currentDeltaX, y: currentDeltaY });
        }
      };

      const handleMouseUp = () => {
        if (hasDragged) {
          // Calculate final positions using current mouse delta
          const finalPositions = initialPositions.map((pos) => ({
            id: pos.id,
            position: {
              x: Math.max(0, pos.x + currentDeltaX),
              y: Math.max(24, pos.y + currentDeltaY),
            },
          }));

          // End ghost dragging - updates real positions and shows originals again
          endIconDrag(finalPositions);
        }

        setIsDragging(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [
      icon,
      isSelected,
      selectedIcons,
      selectIcon,
      startIconDrag,
      updateIconDrag,
      endIconDrag,
    ]
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isDragging) {
        openWindow(icon.appKey, icon.name);
      }
    },
    [icon, isDragging, openWindow]
  );

  const handleRightClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isSelected) {
        selectIcon(icon.id);
      }

      showContextMenu({ x: e.clientX, y: e.clientY }, "icon", icon.id);
    },
    [icon, isSelected, selectIcon, showContextMenu]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.detail === 1 && !isDragging) {
        // Single click - select icon
        selectIcon(icon.id, e.metaKey || e.ctrlKey);
      }
    },
    [icon, isDragging, selectIcon]
  );

  return (
    <>
      {/* Original icon - hidden completely when being dragged */}
      <div
        className={`
          absolute flex flex-col items-center justify-center min-w-16 h-20 px-1 py-2 rounded-lg 
          cursor-pointer select-none max-w-20
          ${
            isSelected
              ? "bg-aqua-blue/20 ring-2 ring-aqua-blue/50"
              : "hover:bg-white/10"
          }
          ${isDragging && !isBeingDragged ? "opacity-75 z-50" : ""}
          ${
            isBeingDragged && isDraggingIcons
              ? "opacity-0 pointer-events-none"
              : ""
          }
          ${
            !isDraggingIcons && !disableIconTransitions
              ? "transition-all duration-150"
              : ""
          }
        `}
        style={{
          left: icon.position.x,
          top: icon.position.y,
        }}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleRightClick}
      >
        <div className="text-2xl mb-1 pointer-events-none">
          {icon.icon.includes(".") ? (
            <img
              src={new URL(`../assets/${icon.icon}`, import.meta.url).href}
              alt={icon.name}
              className="w-8 h-8 object-contain"
            />
          ) : (
            icon.icon
          )}
        </div>
        <div
          className={`${getIconTextSizeClass()} text-center ${
            isDarkMode ? "text-gray-200" : "text-white"
          } font-medium leading-tight break-words pointer-events-none px-1`}
        >
          {icon.name}
        </div>
      </div>

      {/* Ghost copy - visible when being dragged */}
      {isBeingDragged && isDraggingIcons && (
        <div
          className={`
            absolute flex flex-col items-center justify-center min-w-16 h-20 px-1 py-2 rounded-lg 
            select-none max-w-20 z-[9999] pointer-events-none
            bg-aqua-blue/40 ring-2 ring-aqua-blue/80 shadow-lg
          `}
          style={{
            left: icon.position.x,
            top: icon.position.y,
            transform: `translate(${globalDragOffset.x}px, ${globalDragOffset.y}px)`,
          }}
        >
          <div className="text-2xl mb-1">
            {icon.icon.includes(".") ? (
              <img
                src={new URL(`../assets/${icon.icon}`, import.meta.url).href}
                alt={icon.name}
                className="w-8 h-8 object-contain"
              />
            ) : (
              icon.icon
            )}
          </div>
          <div
            className={`${getIconTextSizeClass()} text-center ${
              isDarkMode ? "text-gray-200" : "text-white"
            } font-medium leading-tight break-words px-1`}
          >
            {icon.name}
          </div>
        </div>
      )}
    </>
  );
};
