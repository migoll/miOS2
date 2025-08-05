import React, { useCallback, useRef, useState } from "react";
import { useWindowStore } from "../stores/windowStore";

import { useSound } from "../utils/hooks";
import type { WindowState } from "../types/index.js";
import { getAppComponent } from "../apps/registry";

interface WindowProps {
  window: WindowState;
}

export const Window: React.FC<WindowProps> = ({ window }) => {
  const [isDragging, setIsDragging] = useState(false);

  const focusWindow = useWindowStore((state) => state.focusWindow);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
  const updateWindowPosition = useWindowStore(
    (state) => state.updateWindowPosition
  );
  const updateWindowSize = useWindowStore((state) => state.updateWindowSize);

  const { playSound } = useSound();
  const windowRef = useRef<HTMLDivElement>(null);

  const AppComponent = getAppComponent(window.appKey);

  const handleFocus = useCallback(() => {
    if (!window.isFocused) {
      focusWindow(window.id);
      playSound("click");
    }
  }, [window.isFocused, window.id, focusWindow, playSound]);

  const handleClose = useCallback(() => {
    closeWindow(window.id);
    playSound("close");
  }, [window.id, closeWindow, playSound]);

  const handleMinimize = useCallback(() => {
    minimizeWindow(window.id);
    playSound("minimize");
  }, [window.id, minimizeWindow, playSound]);

  const handleTitleBarMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return; // Only handle left clicks

      e.preventDefault();
      e.stopPropagation();

      handleFocus();

      const rect = windowRef.current!.getBoundingClientRect();
      const startPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      setIsDragging(true);

      const handleMouseMove = (e: MouseEvent) => {
        const newX = e.clientX - startPos.x;
        const newY = e.clientY - startPos.y;

        // Keep window on screen (using global window object for screen dimensions)
        const maxX = globalThis.window.innerWidth - window.size.width;
        const maxY = globalThis.window.innerHeight - window.size.height;

        updateWindowPosition(window.id, {
          x: Math.max(0, Math.min(maxX, newX)),
          y: Math.max(32, Math.min(maxY, newY)), // 32px for menu bar
        });
      };

      const handleMouseUp = () => {
        setIsDragging(false);

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        playSound("drop");
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [window, handleFocus, updateWindowPosition, playSound]
  );

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, direction: string) => {
      e.preventDefault();
      e.stopPropagation();

      handleFocus();

      const startMouseX = e.clientX;
      const startMouseY = e.clientY;
      const startSize = { ...window.size };
      const startPosition = { ...window.position };

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - startMouseX;
        const deltaY = e.clientY - startMouseY;

        let newWidth = startSize.width;
        let newHeight = startSize.height;
        let newX = startPosition.x;
        let newY = startPosition.y;

        if (direction.includes("right")) {
          newWidth = Math.max(300, startSize.width + deltaX);
        }
        if (direction.includes("left")) {
          newWidth = Math.max(300, startSize.width - deltaX);
          newX = startPosition.x + (startSize.width - newWidth);
        }
        if (direction.includes("bottom")) {
          newHeight = Math.max(200, startSize.height + deltaY);
        }
        if (direction.includes("top")) {
          newHeight = Math.max(200, startSize.height - deltaY);
          newY = startPosition.y + (startSize.height - newHeight);
        }

        updateWindowSize(window.id, { width: newWidth, height: newHeight });
        if (newX !== startPosition.x || newY !== startPosition.y) {
          updateWindowPosition(window.id, { x: newX, y: newY });
        }
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [window, handleFocus, updateWindowSize, updateWindowPosition]
  );

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!window.isFocused) return;

      if (e.key === "Escape" || (e.key === "w" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [window.isFocused, handleClose]);

  return (
    <div
      ref={windowRef}
      className={`
        absolute vercel-window transition-shadow duration-200
        ${window.isFocused ? "shadow-vercel-window" : "shadow-vercel-panel"}
        ${isDragging ? "cursor-move" : ""}
      `}
      style={{
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex,
      }}
      onMouseDown={handleFocus}
    >
      {/* Title bar */}
      <div
        className="vercel-window-titlebar cursor-move"
        onMouseDown={handleTitleBarMouseDown}
      >
        {/* Traffic lights */}
        <div className="flex items-center gap-2">
          <button
            className="vercel-traffic-light close"
            onClick={handleClose}
            onMouseDown={(e) => e.stopPropagation()}
          />
          <button
            className="vercel-traffic-light minimize"
            onClick={handleMinimize}
            onMouseDown={(e) => e.stopPropagation()}
          />
          <button className="vercel-traffic-light maximize" />
        </div>

        {/* Window title */}
        <div className="flex-1 text-center">
          <span className="select-none font-medium">{window.title}</span>
        </div>

        {/* Spacer for symmetry */}
        <div className="w-16" />
      </div>

      {/* Window content */}
      <div
        className="flex-1 overflow-hidden bg-vercel-light-panel dark:bg-vercel-dark-panel"
        style={{ height: window.size.height - 32 }}
      >
        {AppComponent ? (
          <AppComponent />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center font-mono">
              <div className="text-4xl mb-2">🖥️</div>
              <div className="text-vercel-light-text dark:text-vercel-dark-text">
                App not found
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resize handles */}
      {window.isFocused && (
        <>
          {/* Edges */}
          <div
            className="absolute top-0 left-3 right-3 h-1 hover:bg-white/20 dark:hover:bg-white/20 cursor-n-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, "top")}
          />
          <div
            className="absolute bottom-0 left-3 right-3 h-1 hover:bg-white/20 dark:hover:bg-white/20 cursor-s-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, "bottom")}
          />
          <div
            className="absolute left-0 top-3 bottom-3 w-1 hover:bg-white/20 dark:hover:bg-white/20 cursor-w-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, "left")}
          />
          <div
            className="absolute right-0 top-3 bottom-3 w-1 hover:bg-white/20 dark:hover:bg-white/20 cursor-e-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, "right")}
          />

          {/* Corners */}
          <div
            className="absolute top-0 left-0 w-3 h-3 hover:bg-white/20 dark:hover:bg-white/20 cursor-nw-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, "top-left")}
          />
          <div
            className="absolute top-0 right-0 w-3 h-3 hover:bg-white/20 dark:hover:bg-white/20 cursor-ne-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, "top-right")}
          />
          <div
            className="absolute bottom-0 left-0 w-3 h-3 hover:bg-white/20 dark:hover:bg-white/20 cursor-sw-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, "bottom-left")}
          />
          <div
            className="absolute bottom-0 right-0 w-3 h-3 hover:bg-white/20 dark:hover:bg-white/20 cursor-se-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, "bottom-right")}
          />
        </>
      )}
    </div>
  );
};
