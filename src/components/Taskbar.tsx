import React from "react";
import { useWindowStore } from "../stores/windowStore";
import { appRegistry } from "../apps/registry";
import { useSound } from "../utils/hooks";

export const Taskbar: React.FC = () => {
  const windows = useWindowStore((state) => state.windows);
  const focusWindow = useWindowStore((state) => state.focusWindow);
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow);

  const { playSound } = useSound();

  // Only show taskbar if there are open windows
  const openWindows = windows.filter((window) => window.isOpen);
  if (openWindows.length === 0) return null;

  const handleTaskbarClick = (window: any) => {
    if (window.isMinimized) {
      // If minimized, restore it
      minimizeWindow(window.id);
      focusWindow(window.id);
    } else if (window.isFocused) {
      // If focused, minimize it
      minimizeWindow(window.id);
    } else {
      // If not focused, focus it
      focusWindow(window.id);
    }
    playSound("click");
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[1001]">
      <div className="vercel-taskbar">
        {openWindows.map((window) => {
          const appMetadata = appRegistry[window.appKey];
          const icon = appMetadata?.icon || "🖥️";

          return (
            <div
              key={window.id}
              className={`vercel-taskbar-item ${
                window.isFocused ? "focused" : ""
              }`}
              onClick={() => handleTaskbarClick(window)}
            >
              {/* App Icon */}
              <div className="text-xl">
                {icon.includes(".") ? (
                  <img
                    src={new URL(`../assets/${icon}`, import.meta.url).href}
                    alt={appMetadata?.name || "App"}
                    className="w-6 h-6 object-contain"
                  />
                ) : (
                  icon
                )}
              </div>

              {/* Status Indicator */}
              {!window.isMinimized && (
                <div className="absolute -bottom-1 w-1 h-1 bg-white/60 dark:bg-white/60 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
