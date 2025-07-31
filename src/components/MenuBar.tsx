import React, { useState, useRef, useEffect } from 'react';
import { useSystemStore } from '../stores/systemStore';
import { useWindowStore } from '../stores/windowStore';
import { useSound } from '../utils/hooks';

export const MenuBar: React.FC = () => {
  const [showSystemMenu, setShowSystemMenu] = useState(false);
  const [showLauncher, setShowLauncher] = useState(false);
  const currentTime = useSystemStore((state) => state.currentTime);
  const settings = useSystemStore((state) => state.settings);
  const toggleMute = useSystemStore((state) => state.toggleMute);
  const openWindow = useWindowStore((state) => state.openWindow);
  const { playSound } = useSound();
  
  const systemMenuRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLDivElement>(null);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle clicks outside menus
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

  // Handle Cmd+Space for launcher
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowLauncher(!showLauncher);
        playSound('menu_open');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showLauncher, playSound]);

  const handleSystemMenuClick = () => {
    setShowSystemMenu(!showSystemMenu);
    playSound(showSystemMenu ? 'menu_close' : 'menu_open');
  };

  const handleVolumeClick = () => {
    toggleMute();
    playSound('click');
  };

  const openApp = (appKey: string, title: string) => {
    openWindow(appKey, title);
    setShowLauncher(false);
    playSound('open');
  };

  const apps = [
    { key: 'finder', name: 'Finder', icon: '📁' },
    { key: 'textedit', name: 'TextEdit', icon: '📝' },
    { key: 'macpaint', name: 'MacPaint', icon: '🎨' },
    { key: 'videos', name: 'Videos', icon: '📺' },
    { key: 'ipod', name: 'iPod', icon: '🎵' },
    { key: 'soundboard', name: 'Soundboard', icon: '🔊' },
    { key: 'synth', name: 'Synth', icon: '🎹' },
    { key: 'photobooth', name: 'Photo Booth', icon: '📸' },
    { key: 'terminal', name: 'Terminal', icon: '⚡' },
    { key: 'minesweeper', name: 'Minesweeper', icon: '💣' },
    { key: 'virtualpc', name: 'Virtual PC', icon: '💻' },
    { key: 'settings', name: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="menu-bar fixed top-0 left-0 right-0 h-8 flex items-center justify-between px-4 z-[1000]">
      {/* Left side - System menu */}
      <div className="flex items-center gap-4" ref={systemMenuRef}>
        <button
          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/10 transition-colors duration-150"
          onClick={handleSystemMenuClick}
        >
          <span className="text-sm font-bold">🖥️ miOS</span>
        </button>

        {showSystemMenu && (
          <div className="absolute top-8 left-4 min-w-48 bg-white/95 backdrop-blur-md border border-aqua-border rounded-lg shadow-aqua-lg py-1 animate-scale-in">
            <button
              className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-aqua-text hover:bg-aqua-light/20 transition-colors duration-150"
              onClick={() => openApp('settings', 'About miOS')}
            >
              <span>❓</span>
              <span>About miOS</span>
            </button>
            <div className="h-px bg-aqua-border/30 mx-2 my-1" />
            <button
              className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-aqua-text hover:bg-aqua-light/20 transition-colors duration-150"
              onClick={() => openApp('settings', 'Settings')}
            >
              <span>⚙️</span>
              <span>System Preferences</span>
            </button>
          </div>
        )}
      </div>

      {/* Center - Launcher */}
      <div className="relative" ref={launcherRef}>
        <button
          className="px-3 py-1 rounded hover:bg-white/10 transition-colors duration-150"
          onClick={() => {
            setShowLauncher(!showLauncher);
            playSound(showLauncher ? 'menu_close' : 'menu_open');
          }}
        >
          <span className="text-sm">🔍 Search</span>
        </button>

        {showLauncher && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-80 bg-white/95 backdrop-blur-md border border-aqua-border rounded-lg shadow-aqua-lg p-4 animate-scale-in">
            <div className="grid grid-cols-4 gap-3">
              {apps.map((app) => (
                <button
                  key={app.key}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-aqua-light/20 transition-colors duration-150"
                  onClick={() => openApp(app.key, app.name)}
                >
                  <span className="text-2xl">{app.icon}</span>
                  <span className="text-xs font-medium text-center">{app.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right side - Status indicators */}
      <div className="flex items-center gap-3">
        {/* Volume */}
        <button
          className="p-1 rounded hover:bg-white/10 transition-colors duration-150"
          onClick={handleVolumeClick}
          title={settings.isMuted ? 'Unmute' : 'Mute'}
        >
          <span className="text-sm">
            {settings.isMuted ? '🔇' : settings.volume > 0.5 ? '🔊' : '🔉'}
          </span>
        </button>

        {/* WiFi indicator */}
        <div className="p-1">
          <span className="text-sm">📶</span>
        </div>

        {/* Time and date */}
        <div className="text-right">
          <div className="text-sm font-medium leading-tight">
            {formatTime(currentTime)}
          </div>
          <div className="text-xs text-aqua-secondary leading-tight">
            {formatDate(currentTime)}
          </div>
        </div>
      </div>
    </div>
  );
};