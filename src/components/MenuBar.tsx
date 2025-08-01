import React, { useState, useRef, useEffect } from 'react';
import { useSystemStore } from '../stores/systemStore';
import { useWindowStore } from '../stores/windowStore';
import { useSound } from '../utils/hooks';
import { useTextSize } from '../utils/textSize';
import { VolumeControl } from './VolumeControl';
import { ConnectionIndicator } from './ConnectionIndicator';

export const MenuBar: React.FC = () => {
  const [showSystemMenu, setShowSystemMenu] = useState(false);
  const [showLauncher, setShowLauncher] = useState(false);
  const currentTime = useSystemStore((state) => state.currentTime);
  const settings = useSystemStore((state) => state.settings);
  const openWindow = useWindowStore((state) => state.openWindow);
  const { playSound } = useSound();
  const { getTextSizeClass } = useTextSize();
  const isDarkMode = settings.theme === 'dark';
  
  const systemMenuRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (systemMenuRef.current && !systemMenuRef.current.contains(event.target as Node)) {
        setShowSystemMenu(false);
      }
      if (launcherRef.current && !launcherRef.current.contains(event.target as Node)) {
        setShowLauncher(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSystemMenuClick = () => {
    setShowSystemMenu(!showSystemMenu);
    setShowLauncher(false);
    playSound('menu_open');
  };

  const handleLauncherClick = () => {
    setShowLauncher(!showLauncher);
    setShowSystemMenu(false);
    playSound('menu_open');
  };

  const openApp = (appKey: string, title?: string) => {
    openWindow(appKey, title || appKey);
    setShowSystemMenu(false);
    setShowLauncher(false);
    playSound('open');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const launcherApps = [
    { key: 'finder', name: 'Finder', icon: '📁' },
    { key: 'textEdit', name: 'TextEdit', icon: '📝' },
    { key: 'macpaint', name: 'MacPaint', icon: '🎨' },
    { key: 'photobooth', name: 'Photo Booth', icon: '📷' },
    { key: 'videos', name: 'Videos', icon: '🎬' },
    { key: 'soundboard', name: 'Soundboard', icon: '🔊' },
    { key: 'synth', name: 'Synth', icon: '🎹' },
    { key: 'ipod', name: 'iPod', icon: '🎵' },
    { key: 'terminal', name: 'Terminal', icon: '⚡' },
    { key: 'minesweeper', name: 'Minesweeper', icon: '💣' },
    { key: 'virtualpc', name: 'Virtual PC', icon: '💻' },
    { key: 'settings', name: 'Settings', icon: '⚙️' },
  ];

  const menuBarClasses = `menu-bar fixed top-0 left-0 right-0 h-8 flex items-center justify-between px-4 z-[1000] backdrop-blur-md border-b ${
    isDarkMode ? 'bg-gray-800/90 border-gray-600/30' : 'bg-white/80 border-aqua-border/30'
  }`;

  return (
    <div className={menuBarClasses}>
      {/* Left section - System menu */}
      <div className="flex-1 flex items-center" ref={systemMenuRef}>
        <button
          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/10 transition-colors duration-150"
          onClick={handleSystemMenuClick}
        >
          <span className={`${getTextSizeClass()} font-bold ${isDarkMode ? 'text-white' : 'text-aqua-text'}`}>🖥️ miOS</span>
        </button>

        {showSystemMenu && (
          <div className={`absolute top-8 left-4 min-w-48 backdrop-blur-md border rounded-lg shadow-aqua-lg py-1 animate-scale-in ${
            isDarkMode 
              ? 'bg-gray-800/95 border-gray-600' 
              : 'bg-white/95 border-aqua-border'
          }`}>
            <button
              className={`w-full flex items-center gap-3 px-4 py-2 text-left ${getTextSizeClass()} ${
                isDarkMode ? 'text-gray-200 hover:bg-gray-700/50' : 'text-aqua-text hover:bg-aqua-light/20'
              } transition-colors duration-150`}
              onClick={() => openApp('settings', 'About miOS')}
            >
              <span>❓</span>
              <span>About miOS</span>
            </button>
            <div className="h-px bg-aqua-border/30 mx-2 my-1" />
            <button
              className={`w-full flex items-center gap-3 px-4 py-2 text-left ${getTextSizeClass()} ${
                isDarkMode ? 'text-gray-200 hover:bg-gray-700/50' : 'text-aqua-text hover:bg-aqua-light/20'
              } transition-colors duration-150`}
              onClick={() => openApp('settings', 'Settings')}
            >
              <span>⚙️</span>
              <span>System Preferences</span>
            </button>
          </div>
        )}
      </div>

      {/* Center section - Launcher (always centered) */}
      <div className="flex-1 flex justify-center relative" ref={launcherRef}>
        <button
          className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-white/10 transition-colors duration-150"
          onClick={handleLauncherClick}
        >
          <span className={`${getTextSizeClass()} ${isDarkMode ? 'text-white' : 'text-aqua-text'}`}>🔍 Search</span>
        </button>

        {showLauncher && (
          <div 
            className={`absolute top-8 w-80 backdrop-blur-md border rounded-lg shadow-aqua-lg p-4 animate-scale-in ${
              isDarkMode 
                ? 'bg-gray-800/95 border-gray-600' 
                : 'bg-white/95 border-aqua-border'
            }`}
            style={{ left: '50%', transform: 'translateX(-50%)' }}
          >
            <div className="grid grid-cols-4 gap-3">
              {launcherApps.map((app) => (
                <button
                  key={app.key}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors duration-150 ${
                    isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-aqua-light/20'
                  }`}
                  onClick={() => openApp(app.key, app.name)}
                >
                  <span className="text-2xl">{app.icon}</span>
                  <span className={`${getTextSizeClass()} font-medium text-center ${
                    isDarkMode ? 'text-gray-200' : 'text-aqua-text'
                  }`}>{app.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right section - Status and controls */}
      <div className="flex-1 flex items-center justify-end gap-3">
        <ConnectionIndicator />
        <VolumeControl />
        <div className="text-right">
          <div className={`${getTextSizeClass()} font-medium leading-tight ${
            isDarkMode ? 'text-white' : 'text-aqua-text'
          }`}>
            {formatTime(currentTime)}
          </div>
          <div className={`text-xs leading-tight ${
            isDarkMode ? 'text-gray-400' : 'text-aqua-secondary'
          }`}>
            {formatDate(currentTime)}
          </div>
        </div>
      </div>
    </div>
  );
};