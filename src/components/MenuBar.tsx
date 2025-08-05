import React, { useState, useRef, useEffect } from "react";
import { useSystemStore } from "../stores/systemStore";
import { useWindowStore } from "../stores/windowStore";
import { useDesktopStore } from "../stores/desktopStore";
import { useSound } from "../utils/hooks";
import { VolumeControl } from "./VolumeControl";
import { appRegistry } from "../apps/registry";
import { ConnectionIndicator } from "./ConnectionIndicator";

export const MenuBar: React.FC = () => {
  const [showSystemMenu, setShowSystemMenu] = useState(false);
  const [showLauncher, setShowLauncher] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const currentTime = useSystemStore((state) => state.currentTime);

  const openWindow = useWindowStore((state) => state.openWindow);
  const { playSound } = useSound();

  const systemMenuRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        systemMenuRef.current &&
        !systemMenuRef.current.contains(event.target as Node)
      ) {
        setShowSystemMenu(false);
      }
      if (
        launcherRef.current &&
        !launcherRef.current.contains(event.target as Node)
      ) {
        setShowLauncher(false);
      }
      if (
        clockRef.current &&
        !clockRef.current.contains(event.target as Node)
      ) {
        setShowDate(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSystemMenuClick = () => {
    setShowSystemMenu(!showSystemMenu);
    setShowLauncher(false);
    setShowDate(false);
    playSound("menu_open");
  };

  const handleLauncherClick = () => {
    setShowLauncher(!showLauncher);
    setShowSystemMenu(false);
    setShowDate(false);
    playSound("menu_open");
  };

  const handleClockClick = () => {
    setShowDate(!showDate);
    setShowSystemMenu(false);
    setShowLauncher(false);
    playSound("menu_open");
  };

  const openApp = (appKey: string, title?: string) => {
    openWindow(appKey, title || appKey);
    setShowSystemMenu(false);
    setShowLauncher(false);
    setShowDate(false);
    playSound("open");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const icons = useDesktopStore((state) => state.icons);

  // Get all apps from registry, excluding finder and placeholder, and filter out apps already on desktop
  const launcherApps = Object.values(appRegistry)
    .filter((app) => app.key !== "finder" && app.key !== "placeholder")
    .map((app) => ({
      key: app.key,
      name: app.name,
      icon: app.icon,
      isOnDesktop: icons.some((icon) => icon.appKey === app.key),
    }));

  const handleDragStart = (e: React.DragEvent, appKey: string) => {
    e.dataTransfer.setData("application/app-key", appKey);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="vercel-menu-bar fixed top-0 left-0 right-0 z-[1000]">
      {/* Left section - System menu */}
      <div className="flex-1 flex items-center" ref={systemMenuRef}>
        <button
          className="vercel-button px-2 py-1 font-bold"
          onClick={handleSystemMenuClick}
        >
          🖥️ miOS
        </button>

        {showSystemMenu && (
          <div className="absolute top-10 left-4 vercel-context-menu">
            <button
              className="vercel-context-item"
              onClick={() => openApp("settings", "About miOS")}
            >
              <span className="mr-3">❓</span>
              <span>About miOS</span>
            </button>
            <div className="h-px bg-vercel-light-border dark:bg-vercel-dark-border mx-2 my-1" />
            <button
              className="vercel-context-item"
              onClick={() => openApp("settings", "Settings")}
            >
              <span className="mr-3">⚙️</span>
              <span>System Preferences</span>
            </button>
          </div>
        )}
      </div>

      {/* Center section - Launcher (always centered) */}
      <div className="flex-1 flex justify-center relative" ref={launcherRef}>
        <button
          className="vercel-button px-3 py-1"
          onClick={handleLauncherClick}
        >
          🔍 Search
        </button>

        {showLauncher && (
          <div
            className="absolute top-10 left-1/2 transform -translate-x-1/2 vercel-panel p-4 animate-slide-in-from-top"
            style={{
              width: "min(90vw, 480px)",
              maxHeight: "calc(100vh - 120px)", // Account for menu bar and some padding
            }}
          >
            <div
              className="grid grid-cols-3 sm:grid-cols-4 gap-3 overflow-y-auto vercel-scrollbar"
              style={{ maxHeight: "calc(100vh - 160px)" }}
            >
              {launcherApps.map((app) => (
                <button
                  key={app.key}
                  className="vercel-button flex flex-col items-center gap-2 p-3"
                  onClick={() => openApp(app.key, app.name)}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, app.key)}
                  title="Click to open or drag to desktop"
                >
                  <div className="text-3xl flex items-center justify-center w-12 h-12">
                    {app.icon.includes(".") ? (
                      <img
                        src={
                          new URL(`../assets/${app.icon}`, import.meta.url).href
                        }
                        alt={app.name}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      app.icon
                    )}
                  </div>
                  <span className="text-xs font-medium text-center leading-tight">
                    {app.name}
                  </span>
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
        <div className="relative text-right font-mono" ref={clockRef}>
          <button
            className="text-sm font-medium leading-tight cursor-pointer vercel-button px-2 py-1"
            onClick={handleClockClick}
            title="Click to see date"
          >
            {formatTime(currentTime)}
          </button>

          {/* Date appears on click beneath the clock */}
          {showDate && (
            <div className="absolute top-10 right-0 vercel-panel p-2 rounded shadow-lg whitespace-nowrap">
              <div className="text-xs font-medium">
                {formatDate(currentTime)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
