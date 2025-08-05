import React, { useState, useCallback, useMemo } from "react";
import { useDesktopStore } from "../stores/desktopStore";
import { useWindowStore } from "../stores/windowStore";
import type { DesktopIcon as DesktopIconType } from "../types/index.js";

interface DesktopIconProps {
  icon: DesktopIconType;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ icon }) => {
  const [isDragging, setIsDragging] = useState(false);

  const selectedIconIds = useDesktopStore((state) => state.selectedIconIds);
  const selectIcon = useDesktopStore((state) => state.selectIcon);
  const showContextMenu = useDesktopStore((state) => state.showContextMenu);
  const icons = useDesktopStore((state) => state.icons);
  const selectionRectangle = useDesktopStore(
    (state) => state.selectionRectangle
  );

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

  // Check if this icon is being previewed by selection rectangle
  const isPreviewSelected = useMemo(() => {
    if (!selectionRectangle.isActive) return false;

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

    const iconRect = {
      x: icon.position.x,
      y: icon.position.y,
      width: 90,
      height: 75,
    };

    return (
      iconRect.x < rect.x + rect.width &&
      iconRect.x + iconRect.width > rect.x &&
      iconRect.y < rect.y + rect.height &&
      iconRect.y + iconRect.height > rect.y
    );
  }, [selectionRectangle, icon.position]);

  // Smart text formatting for Windows-style layout
  const formatIconText = (text: string) => {
    // Check if it's a single long word that won't fit
    const words = text.split(" ");
    if (words.length === 1 && text.length > 12) {
      return { text, isSingleWord: true };
    }
    return { text, isSingleWord: false };
  };

  const formattedText = formatIconText(icon.name);

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
        if (icon.isFolder) {
          // Handle folder opening - for now just log
          console.log("Opening folder:", icon.name);
        } else {
          openWindow(icon.appKey, icon.name);
        }
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
          absolute vercel-desktop-icon
          ${isSelected ? "selected" : ""}
          ${isPreviewSelected ? "selection-preview" : ""}
          ${isDragging || isDraggingIcons ? "no-hover" : ""}
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
        {/* Windows-style 48x48 icon at top */}
        <div
          className="flex items-center justify-center pointer-events-none"
          style={{ width: "48px", height: "48px" }}
        >
          {icon.icon.includes(".") ? (
            <img
              src={new URL(`../assets/${icon.icon}`, import.meta.url).href}
              alt={icon.name}
              className="w-12 h-12 object-contain"
            />
          ) : (
            <span style={{ fontSize: "36px", lineHeight: "1" }}>
              {icon.icon}
            </span>
          )}
        </div>
        {/* Windows-style centered text below icon */}
        <div
          className={`icon-text font-medium pointer-events-none ${
            formattedText.isSingleWord ? "single-word" : ""
          } ${
            isSelected
              ? "text-white"
              : "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
          }`}
        >
          {formattedText.text}
        </div>
      </div>

      {/* Ghost copy - visible when being dragged */}
      {isBeingDragged && isDraggingIcons && (
        <div
          className={`
            absolute flex flex-col items-center justify-start
            select-none z-[9999] pointer-events-none
            dragging
          `}
          style={{
            width: "90px",
            height: "75px",
            padding: "4px",
            left: icon.position.x,
            top: icon.position.y,
            transform: `translate(${globalDragOffset.x}px, ${globalDragOffset.y}px)`,
          }}
        >
          {/* Windows-style 48x48 icon at top */}
          <div
            className="flex items-center justify-center pointer-events-none"
            style={{ width: "48px", height: "48px" }}
          >
            {icon.icon.includes(".") ? (
              <img
                src={new URL(`../assets/${icon.icon}`, import.meta.url).href}
                alt={icon.name}
                className="w-12 h-12 object-contain"
              />
            ) : (
              <span style={{ fontSize: "36px", lineHeight: "1" }}>
                {icon.icon}
              </span>
            )}
          </div>
          {/* Windows-style centered text below icon */}
          <div
            className={`icon-text font-medium text-white pointer-events-none ${
              formattedText.isSingleWord ? "single-word" : ""
            }`}
          >
            {formattedText.text}
          </div>
        </div>
      )}
    </>
  );
};
