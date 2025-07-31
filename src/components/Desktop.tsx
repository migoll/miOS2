import React, { useCallback, useRef } from 'react';
import { useDesktopStore } from '../stores/desktopStore';
import { useSound } from '../utils/hooks';
import { DesktopIcon } from './DesktopIcon';
import { SelectionRectangle } from './SelectionRectangle';
import { ContextMenu } from './ContextMenu';
import { WindowManager } from './WindowManager';
import { MenuBar } from './MenuBar';

export const Desktop: React.FC = () => {
  const icons = useDesktopStore((state) => state.icons);
  const clearSelection = useDesktopStore((state) => state.clearSelection);
  const hideContextMenu = useDesktopStore((state) => state.hideContextMenu);
  const startSelectionRectangle = useDesktopStore((state) => state.startSelectionRectangle);
  const updateSelectionRectangle = useDesktopStore((state) => state.updateSelectionRectangle);
  const endSelectionRectangle = useDesktopStore((state) => state.endSelectionRectangle);
  const showContextMenu = useDesktopStore((state) => state.showContextMenu);
  const selectionRectangle = useDesktopStore((state) => state.selectionRectangle);
  
  const { playSound } = useSound();
  const isSelecting = useRef(false);
  const desktopRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 2) return; // Don't start selection on right-click

    const target = e.target as HTMLElement;
    if (target === desktopRef.current || target.classList.contains('desktop-surface')) {
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
      playSound('select');

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
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  }, [clearSelection, hideContextMenu, startSelectionRectangle, updateSelectionRectangle, endSelectionRectangle, playSound]);

  const handleRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    
    if (target === desktopRef.current || target.classList.contains('desktop-surface')) {
      clearSelection();
      showContextMenu({ x: e.clientX, y: e.clientY }, 'desktop');
    }
  }, [clearSelection, showContextMenu]);

  const handleRefresh = useCallback(() => {
    // Refresh desktop - could trigger re-render or reload state
    window.location.reload();
  }, []);

  const handleArrangeIcons = useCallback(() => {
    // TODO: Implement icon arrangement logic
    playSound('click');
  }, [playSound]);

  const handleNewFolder = useCallback(() => {
    // TODO: Implement new folder creation
    playSound('click');
  }, [playSound]);

  const handleAbout = useCallback(() => {
    // TODO: Show about dialog
    playSound('click');
  }, [playSound]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Animated wallpaper background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400">
        <div className="absolute inset-0 opacity-60">
          {/* Animated floating elements to simulate Nagrand-style landscape */}
          <div className="absolute w-32 h-32 bg-white/10 rounded-full animate-wallpaper" style={{ top: '20%', left: '10%' }} />
          <div className="absolute w-24 h-24 bg-white/15 rounded-full animate-wallpaper" style={{ top: '60%', left: '70%', animationDelay: '5s' }} />
          <div className="absolute w-20 h-20 bg-white/20 rounded-full animate-wallpaper" style={{ top: '40%', left: '40%', animationDelay: '10s' }} />
          <div className="absolute w-16 h-40 bg-green-300/20 rounded-lg animate-wallpaper" style={{ bottom: '10%', left: '20%', animationDelay: '3s' }} />
          <div className="absolute w-12 h-36 bg-green-400/25 rounded-lg animate-wallpaper" style={{ bottom: '15%', right: '30%', animationDelay: '8s' }} />
        </div>
      </div>

      {/* Menu bar */}
      <MenuBar />

      {/* Desktop surface */}
      <div
        ref={desktopRef}
        className="desktop-surface absolute inset-0 pt-8"
        onMouseDown={handleMouseDown}
        onContextMenu={handleRightClick}
        style={{ cursor: selectionRectangle.isActive ? 'crosshair' : 'default' }}
      >
        {/* Desktop icons */}
        {icons.map((icon) => (
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
    </div>
  );
};