import React, { useState } from "react";
import { useSystemStore, wallpapers } from "../stores/systemStore";
import { useSound } from "../utils/hooks";

const SettingsApp: React.FC = () => {
  const settings = useSystemStore((state) => state.settings);
  const updateSettings = useSystemStore((state) => state.updateSettings);
  const toggleMute = useSystemStore((state) => state.toggleMute);
  const setVolume = useSystemStore((state) => state.setVolume);
  const { playSound } = useSound();

  const [activeTab, setActiveTab] = useState("general");

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    playSound("click");
  };

  const handleThemeChange = (theme: "dark" | "light") => {
    // Only update theme, keep current wallpaper
    updateSettings({
      theme,
    });
    playSound("click");
  };

  const handleToggleAnimations = () => {
    updateSettings({
      uiPreferences: {
        ...settings.uiPreferences,
        animationsEnabled: !settings.uiPreferences.animationsEnabled,
      },
    });
    playSound("click");
  };

  const handleToggleSounds = () => {
    updateSettings({
      uiPreferences: {
        ...settings.uiPreferences,
        soundsEnabled: !settings.uiPreferences.soundsEnabled,
      },
    });
    playSound("click");
  };

  const handleWallpaperChange = (wallpaperId: string) => {
    updateSettings({ wallpaper: wallpaperId });
    playSound("click");
  };

  const tabs = [
    { id: "general", name: "General", icon: "⚙️" },
    { id: "appearance", name: "Appearance", icon: "🎨" },
    { id: "sound", name: "Sound", icon: "🔊" },
    { id: "about", name: "About", icon: "❓" },
  ];

  return (
    <div className="flex h-full bg-vercel-light-panel dark:bg-vercel-dark-panel font-mono">
      {/* Sidebar */}
      <div className="w-48 bg-vercel-light-panel dark:bg-vercel-dark-panel border-r border-vercel-light-border dark:border-vercel-dark-border p-4">
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`
                 w-full flex items-center gap-3 px-3 py-2 rounded text-left transition-colors duration-150 font-mono text-sm
                 ${
                   activeTab === tab.id
                     ? "bg-gray-200 dark:bg-white/10 text-vercel-light-text dark:text-white"
                     : "text-vercel-light-text dark:text-vercel-dark-text hover:bg-gray-100 dark:hover:bg-white/5"
                 }
               `}
              onClick={() => {
                setActiveTab(tab.id);
                playSound("click");
              }}
            >
              <span>{tab.icon}</span>
              <span className="font-medium">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto vercel-scrollbar max-w-container mx-auto">
        {activeTab === "general" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-vercel-light-text dark:text-vercel-dark-text mb-4">
              General Settings
            </h2>

            <div className="vercel-panel p-4">
              <h3 className="font-semibold text-vercel-light-text dark:text-vercel-dark-text mb-3">
                User Interface
              </h3>

              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.uiPreferences.animationsEnabled}
                    onChange={handleToggleAnimations}
                    className="vercel-input"
                  />
                  <span className="text-sm text-vercel-light-text dark:text-vercel-dark-text">
                    Enable animations
                  </span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.uiPreferences.soundsEnabled}
                    onChange={handleToggleSounds}
                    className="vercel-input"
                  />
                  <span className="text-sm text-vercel-light-text dark:text-vercel-dark-text">
                    Enable sound effects
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === "appearance" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-vercel-light-text dark:text-vercel-dark-text mb-4">
              Appearance
            </h2>

            {/* Theme Selection - Priority */}
            <div className="vercel-panel p-4">
              <h3 className="font-semibold text-vercel-light-text dark:text-vercel-dark-text mb-3">
                Theme
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <button
                  className={`
                     vercel-button p-4 transition-all duration-150
                     ${
                       settings.theme === "dark"
                         ? "bg-white/10 border border-white/20 shadow-inner"
                         : ""
                     }
                   `}
                  onClick={() => handleThemeChange("dark")}
                >
                  <div className="w-full h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded mb-2"></div>
                  <span className="text-sm font-medium">Dark Mode</span>
                </button>

                <button
                  className={`
                     vercel-button p-4 transition-all duration-150
                     ${
                       settings.theme === "light"
                         ? "bg-white/10 border border-white/20 shadow-inner"
                         : ""
                     }
                   `}
                  onClick={() => handleThemeChange("light")}
                >
                  <div className="w-full h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-2"></div>
                  <span className="text-sm font-medium">Light Mode</span>
                </button>
              </div>
            </div>

            {/* Wallpaper Selection */}
            <div className="vercel-panel p-4">
              <h3 className="font-semibold text-vercel-light-text dark:text-vercel-dark-text mb-3">
                Background
              </h3>

              {/* Gradient Backgrounds Section */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-vercel-light-text dark:text-vercel-dark-text mb-3 opacity-75">
                  Gradient Backgrounds
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {wallpapers
                    .filter((wallpaper) => wallpaper.category === "gradient")
                    .map((wallpaper) => (
                      <button
                        key={wallpaper.id}
                        className={`
                           relative h-36 rounded border-2 transition-all duration-150 overflow-hidden
                           ${
                             settings.wallpaper === wallpaper.id
                               ? "bg-white/10 border border-white/20 shadow-inner"
                               : "border-gray-300 dark:border-gray-600 hover:border-white/50 dark:hover:border-white/50"
                           }
                         `}
                        style={{ background: wallpaper.style }}
                        onClick={() => handleWallpaperChange(wallpaper.id)}
                      >
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <span className="text-white text-xs font-medium text-center px-2 font-mono">
                            {wallpaper.name}
                          </span>
                        </div>
                        {settings.wallpaper === wallpaper.id && (
                          <div className="absolute top-1 right-1 w-3 h-3 bg-white/20 border border-white/40 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </button>
                    ))}
                </div>
              </div>

              {/* Basic Backgrounds Section */}
              <div>
                <h4 className="text-sm font-medium text-vercel-light-text dark:text-vercel-dark-text mb-3 opacity-75">
                  Basic Backgrounds
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {wallpapers
                    .filter((wallpaper) => wallpaper.category === "basic")
                    .map((wallpaper) => (
                      <button
                        key={wallpaper.id}
                        className={`
                           relative h-36 rounded border-2 transition-all duration-150 overflow-hidden
                           ${
                             settings.wallpaper === wallpaper.id
                               ? "bg-white/10 border border-white/20 shadow-inner"
                               : "border-gray-300 dark:border-gray-600 hover:border-white/50 dark:hover:border-white/50"
                           }
                         `}
                        style={{ background: wallpaper.style }}
                        onClick={() => handleWallpaperChange(wallpaper.id)}
                      >
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <span className="text-white text-xs font-medium text-center px-2 font-mono">
                            {wallpaper.name}
                          </span>
                        </div>
                        {settings.wallpaper === wallpaper.id && (
                          <div className="absolute top-1 right-1 w-3 h-3 bg-white/20 border border-white/40 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "sound" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-vercel-light-text dark:text-vercel-dark-text mb-4">
              Sound Settings
            </h2>

            <div className="vercel-panel p-4">
              <h3 className="font-semibold text-vercel-light-text dark:text-vercel-dark-text mb-3">
                Volume
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-vercel-light-text dark:text-vercel-dark-text w-16 font-mono">
                    Master:
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={settings.volume}
                    onChange={handleVolumeChange}
                    className="flex-1"
                    style={{
                      height: "4px",
                      background: settings.isMuted
                        ? "rgba(153, 153, 153, 0.3)"
                        : `linear-gradient(to right, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.8) ${
                            settings.volume * 100
                          }%, rgba(153, 153, 153, 0.3) ${
                            settings.volume * 100
                          }%, rgba(153, 153, 153, 0.3) 100%)`,
                      WebkitAppearance: "none",
                      appearance: "none",
                      outline: "none",
                      borderRadius: "2px",
                      cursor: "pointer",
                    }}
                  />
                  <span className="text-sm text-vercel-light-text dark:text-vercel-dark-text w-12 font-mono">
                    {Math.round(settings.volume * 100)}%
                  </span>
                </div>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.isMuted}
                    onChange={toggleMute}
                    className="vercel-input"
                  />
                  <span className="text-sm text-vercel-light-text dark:text-vercel-dark-text">
                    Mute all sounds
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-vercel-light-text dark:text-vercel-dark-text mb-4">
              About miOS
            </h2>

            <div className="vercel-panel p-6 text-center">
              <div className="text-6xl mb-4">🖥️</div>
              <h3 className="text-2xl font-bold text-vercel-light-text dark:text-vercel-dark-text mb-2 font-mono">
                miOS
              </h3>
              <p className="text-vercel-light-text-secondary dark:text-vercel-dark-text-secondary mb-4 font-mono">
                Version 2.0.0 - Vercel Edition
              </p>
              <p className="text-sm text-vercel-light-text dark:text-vercel-dark-text leading-relaxed max-w-md mx-auto">
                A minimal, engineer-first browser operating system built with
                Vercel's design principles. Ultra-clean, monospace typography,
                and perfectly spaced.
              </p>

              <div className="mt-6 pt-4 border-t border-vercel-light-border dark:border-vercel-dark-border">
                <p className="text-xs text-vercel-light-text-secondary dark:text-vercel-dark-text-secondary font-mono">
                  Built with React, TypeScript, Tailwind CSS, and Geist Mono
                </p>
                <p className="text-xs text-vercel-light-text-secondary dark:text-vercel-dark-text-secondary mt-1 font-mono">
                  Current time: {settings.time.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsApp;
