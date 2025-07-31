import React, { useCallback, useRef, useState } from 'react';
import { useWindowStore } from '../stores/windowStore';
import { useSound } from '../utils/hooks';
import type { WindowState } from '../types/index.js';
import { getAppComponent } from '../apps/registry';

interface WindowProps {
  window: WindowState;
}

export const Window: React.FC<WindowProps> = ({ window }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  
  const focusWindow = useWindowStore((state) => state.focusWindow);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
  const updateWindowPosition = useWindowStore((state) => state.updateWindowPosition);
  const updateWindowSize = useWindowStore((state) => state.updateWindowSize);
  
  const { playSound } = useSound();
  const windowRef = useRef<HTMLDivElement>(null);
  
  const AppComponent = getAppComponent(window.appKey);

  const handleFocus = useCallback(() => {
    if (!window.isFocused) {
      focusWindow(window.id);
      playSound('click');
    }
  }, [window.isFocused, window.id, focusWindow, playSound]);

  const handleClose = useCallback(() => {
    closeWindow(window.id);
    playSound('close');
  }, [window.id, closeWindow, playSound]);

  const handleMinimize = useCallback(() => {
    minimizeWindow(window.id);
    playSound('minimize');
  }, [window.id, minimizeWindow, playSound]);

  const handleTitleBarMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only handle left clicks
    
    e.preventDefault();
    e.stopPropagation();
    
    handleFocus();
    
    const rect = windowRef.current!.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (dragStart) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        
        // Keep window on screen
        const maxX = window.innerWidth - window.size.width;
        const maxY = window.innerHeight - window.size.height;
        
        updateWindowPosition(window.id, {
          x: Math.max(0, Math.min(maxX, newX)),
          y: Math.max(0, Math.min(maxY, newY)),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragStart(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      playSound('drop');
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [window, dragStart, handleFocus, updateWindowPosition, playSound]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    handleFocus();
    setIsResizing(direction);
    
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

      if (direction.includes('right')) {
        newWidth = Math.max(300, startSize.width + deltaX);
      }
      if (direction.includes('left')) {
        newWidth = Math.max(300, startSize.width - deltaX);
        newX = startPosition.x + (startSize.width - newWidth);
      }
      if (direction.includes('bottom')) {
        newHeight = Math.max(200, startSize.height + deltaY);
      }
      if (direction.includes('top')) {
        newHeight = Math.max(200, startSize.height - deltaY);
        newY = startPosition.y + (startSize.height - newHeight);
      }

      updateWindowSize(window.id, { width: newWidth, height: newHeight });
      if (newX !== startPosition.x || newY !== startPosition.y) {
        updateWindowPosition(window.id, { x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [window, handleFocus, updateWindowSize, updateWindowPosition]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!window.isFocused) return;
      
      if (e.key === 'Escape' || (e.key === 'w' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [window.isFocused, handleClose]);

  const getCursorStyle = (direction: string) => {
    const cursorMap: Record<string, string> = {
      'top': 'n-resize',
      'bottom': 's-resize',
      'left': 'w-resize',
      'right': 'e-resize',
      'top-left': 'nw-resize',
      'top-right': 'ne-resize',
      'bottom-left': 'sw-resize',
      'bottom-right': 'se-resize',
    };
    return cursorMap[direction] || 'default';
  };

  return (
    <div
      ref={windowRef}
      className={`
        absolute window-chrome transition-shadow duration-200
        ${window.isFocused ? 'shadow-aqua-lg' : 'shadow-aqua'}
        ${isDragging ? 'cursor-move' : ''}
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
        className="window-titlebar flex items-center justify-between px-4 py-2 h-8 cursor-move"
        onMouseDown={handleTitleBarMouseDown}
      >
        {/* Traffic lights */}
        <div className="flex items-center gap-2">
          <button
            className="traffic-light close"
            onClick={handleClose}
            onMouseDown={(e) => e.stopPropagation()}
          />
          <button
            className="traffic-light minimize"
            onClick={handleMinimize}
            onMouseDown={(e) => e.stopPropagation()}
          />
          <button className="traffic-light maximize" />
        </div>

        {/* Window title */}
        <div className="flex-1 text-center">
          <span className="text-sm font-medium text-aqua-text select-none">
            {window.title}
          </span>
        </div>

        {/* Spacer for symmetry */}
        <div className="w-16" />
      </div>

      {/* Window content */}
      <div className="flex-1 overflow-hidden" style={{ height: window.size.height - 32 }}>
        {AppComponent ? <AppComponent /> : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-2">🖥️</div>
              <div className="text-aqua-text">App not found</div>
            </div>
          </div>
        )}
      </div>

      {/* Resize handles */}
      {window.isFocused && (
        <>
          {/* Edges */}
          <div
            className="absolute top-0 left-2 right-2 h-1 hover:bg-aqua-blue/20 cursor-n-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'top')}
          />
          <div
            className="absolute bottom-0 left-2 right-2 h-1 hover:bg-aqua-blue/20 cursor-s-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'bottom')}
          />
          <div
            className="absolute left-0 top-2 bottom-2 w-1 hover:bg-aqua-blue/20 cursor-w-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'left')}
          />
          <div
            className="absolute right-0 top-2 bottom-2 w-1 hover:bg-aqua-blue/20 cursor-e-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'right')}
          />
          
          {/* Corners */}
          <div
            className="absolute top-0 left-0 w-2 h-2 hover:bg-aqua-blue/20 cursor-nw-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'top-left')}
          />
          <div
            className="absolute top-0 right-0 w-2 h-2 hover:bg-aqua-blue/20 cursor-ne-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'top-right')}
          />
          <div
            className="absolute bottom-0 left-0 w-2 h-2 hover:bg-aqua-blue/20 cursor-sw-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-left')}
          />
          <div
            className="absolute bottom-0 right-0 w-2 h-2 hover:bg-aqua-blue/20 cursor-se-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-right')}
          />
        </>
      )}
    </div>
  );
};