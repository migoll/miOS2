import React from "react";
import { useWindowStore } from "../stores/windowStore";
import { useSystemStore } from "../stores/systemStore";
import { appRegistry } from "../apps/registry";
import { useSound } from "../utils/hooks";

export const Taskbar: React.FC = () => {
  const windows = useWindowStore((state) => state.windows);
  const focusWindow = useWindowStore((state) => state.focusWindow);
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
  const settings = useSystemStore((state) => state.settings);
  const { playSound } = useSound();
  const isDarkMode = settings.theme === "dark";

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
      <div
        className={`flex items-center gap-2 px-4 py-2 backdrop-blur-md border rounded-xl shadow-lg ${
          isDarkMode
            ? "bg-gray-800/80 border-gray-600/50"
            : "bg-white/20 border-white/30"
        }`}
      >
        {openWindows.map((window) => {
          const appMetadata = appRegistry[window.appKey];
          const icon = appMetadata?.icon || "🖥️";

          return (
            <div
              key={window.id}
              className="relative flex flex-col items-center cursor-pointer"
              onClick={() => handleTaskbarClick(window)}
            >
              {/* App Icon */}
              <div
                className={`
                w-12 h-12 flex items-center justify-center text-2xl rounded-lg
                transition-all duration-150 hover:bg-white/20
                ${window.isFocused ? "bg-white/30" : "bg-white/10"}
              `}
              >
                {icon.includes(".") ? (
                  <img
                    src={new URL(`../assets/${icon}`, import.meta.url).href}
                    alt={appMetadata?.name || "App"}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  icon
                )}
              </div>

              {/* Status Dot */}
              {!window.isMinimized && (
                <div className="absolute -bottom-1 w-1 h-1 bg-black rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
