import React, { useState, useRef, useCallback } from 'react';
import { useDesktopStore } from '../stores/desktopStore';
import { useWindowStore } from '../stores/windowStore';
import { useSystemStore } from '../stores/systemStore';
import { useSound } from '../utils/hooks';
import { useTextSize } from '../utils/textSize';
import type { DesktopIcon as DesktopIconType } from '../types/index.js';

interface DesktopIconProps {
  icon: DesktopIconType;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ icon }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const settings = useSystemStore((state) => state.settings);
  const { getIconTextSizeClass } = useTextSize();
  const isDarkMode = settings.theme === 'dark';
  
  const selectedIconIds = useDesktopStore((state) => state.selectedIconIds);
  const selectIcon = useDesktopStore((state) => state.selectIcon);
  const clearSelection = useDesktopStore((state) => state.clearSelection);
  const updateIconPosition = useDesktopStore((state) => state.updateIconPosition);
  const updateMultipleIconPositions = useDesktopStore((state) => state.updateMultipleIconPositions);
  const showContextMenu = useDesktopStore((state) => state.showContextMenu);
  const icons = useDesktopStore((state) => state.icons);
  
  const openWindow = useWindowStore((state) => state.openWindow);
  const { playSound } = useSound();

  const isSelected = selectedIconIds.includes(icon.id);
  const selectedIcons = icons.filter(i => selectedIconIds.includes(i.id));

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 2) return; // Ignore right-click for dragging

    e.preventDefault();
    e.stopPropagation();

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startIconX = icon.position.x;
    const startIconY = icon.position.y;
    
    let hasDragged = false;

    // If this icon isn't selected, select it (and clear others unless Cmd/Ctrl is held)
    if (!isSelected) {
      selectIcon(icon.id, e.metaKey || e.ctrlKey);
      playSound('select');
    }

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startMouseX;
      const deltaY = e.clientY - startMouseY;
      
      // Start dragging immediately on any movement
      if (!hasDragged) {
        setIsDragging(true);
        hasDragged = true;
        playSound('click');
      }

      if (hasDragged) {
        if (selectedIcons.length > 1) {
          // Move all selected icons
          const updates = selectedIcons.map(selectedIcon => ({
            id: selectedIcon.id,
            position: {
              x: Math.max(0, selectedIcon.position.x + deltaX),
              y: Math.max(32, selectedIcon.position.y + deltaY), // 32px for menu bar
            },
          }));
          updateMultipleIconPositions(updates);
        } else {
          // Move single icon
          updateIconPosition(icon.id, {
            x: Math.max(0, startIconX + deltaX),
            y: Math.max(32, startIconY + deltaY), // 32px for menu bar
          });
        }
      }
    };

    const handleMouseUp = () => {
      if (hasDragged) {
        playSound('drop');
      }

      setIsDragging(false);
      setDragStart(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [icon, isSelected, selectedIcons, selectIcon, updateIconPosition, updateMultipleIconPositions, playSound]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isDragging) {
      playSound('open');
      openWindow(icon.appKey, icon.name);
    }
  }, [icon, isDragging, openWindow, playSound]);

  const handleRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isSelected) {
      selectIcon(icon.id);
    }
    
    showContextMenu({ x: e.clientX, y: e.clientY }, 'icon', icon.id);
  }, [icon, isSelected, selectIcon, showContextMenu]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (e.detail === 1 && !isDragging) {
      // Single click - select icon
      selectIcon(icon.id, e.metaKey || e.ctrlKey);
      playSound('click');
    }
  }, [icon, isDragging, selectIcon, playSound]);

  return (
    <div
      className={`
        absolute flex flex-col items-center justify-center min-w-16 h-20 px-1 py-2 rounded-lg 
        transition-all duration-150 cursor-pointer select-none max-w-20
        ${isSelected ? 'bg-aqua-blue/20 ring-2 ring-aqua-blue/50' : 'hover:bg-white/10'}
        ${isDragging ? 'opacity-75 z-50' : ''}
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
        {icon.icon}
      </div>
      <div className={`${getIconTextSizeClass()} text-center ${isDarkMode ? 'text-gray-200' : 'text-white'} font-medium leading-tight break-words pointer-events-none px-1`}>
        {icon.name}
      </div>
    </div>
  );
};