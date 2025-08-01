import React, { useEffect, useRef } from 'react';
import { useDesktopStore } from '../stores/desktopStore';
import { useWindowStore } from '../stores/windowStore';
import { useSound } from '../utils/hooks';
import type { ContextMenuItem } from '../types/index.js';

interface ContextMenuProps {
  onNewFolder?: () => void;
  onSettings?: () => void;
  onRefresh?: () => void;
  onArrangeIcons?: () => void;
  onAbout?: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  onNewFolder,
  onSettings,
  onRefresh,
  onArrangeIcons,
  onAbout,
}) => {
  const contextMenu = useDesktopStore((state) => state.contextMenu);
  const hideContextMenu = useDesktopStore((state) => state.hideContextMenu);
  const openWindow = useWindowStore((state) => state.openWindow);
  const { playSound } = useSound();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        hideContextMenu();
        playSound('menu_close');
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        hideContextMenu();
        playSound('menu_close');
      }
    };

    if (contextMenu.isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      playSound('menu_open');
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [contextMenu.isVisible, hideContextMenu, playSound]);

  if (!contextMenu.isVisible) return null;

  const handleItemClick = (action: () => void) => {
    playSound('click');
    action();
    hideContextMenu();
  };

  const desktopMenuItems: ContextMenuItem[] = [
    {
      id: 'new-folder',
      label: 'New Folder',
      icon: '📁',
      action: () => onNewFolder?.(),
    },
    {
      id: 'separator-1',
      label: '',
      action: () => {},
      separator: true,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      action: () => openWindow('settings', 'Settings'),
    },
    {
      id: 'refresh',
      label: 'Refresh',
      icon: '🔄',
      action: () => onRefresh?.(),
    },
    {
      id: 'arrange-icons',
      label: 'Arrange Icons',
      icon: '📐',
      action: () => onArrangeIcons?.(),
    },
    {
      id: 'tidy-up',
      label: 'Tidy Up',
      icon: '🧹',
      action: () => onArrangeIcons?.(),
    },
    {
      id: 'separator-2',
      label: '',
      action: () => {},
      separator: true,
    },
    {
      id: 'about',
      label: 'About miOS',
      icon: '❓',
      action: () => onAbout?.(),
    },
  ];

  const menuItems = contextMenu.type === 'desktop' ? desktopMenuItems : [];

  return (
    <div
      ref={menuRef}
      className="fixed z-[9999] min-w-48 bg-white/95 backdrop-blur-md border border-aqua-border rounded-lg shadow-aqua-lg py-1 animate-scale-in"
      style={{
        left: contextMenu.position.x,
        top: contextMenu.position.y,
      }}
    >
      {menuItems.map((item) => {
        if (item.separator) {
          return (
            <div
              key={item.id}
              className="h-px bg-aqua-border/30 mx-2 my-1"
            />
          );
        }

        return (
          <button
            key={item.id}
            className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-aqua-text hover:bg-aqua-light/20 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleItemClick(item.action)}
            disabled={item.disabled}
          >
            {item.icon && (
              <span className="text-base" role="img" aria-hidden="true">
                {item.icon}
              </span>
            )}
            <span className="font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};