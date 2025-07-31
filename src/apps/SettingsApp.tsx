import React, { useState } from 'react';
import { useSystemStore } from '../stores/systemStore';
import { useSound } from '../utils/hooks';

const SettingsApp: React.FC = () => {
  const settings = useSystemStore((state) => state.settings);
  const updateSettings = useSystemStore((state) => state.updateSettings);
  const toggleMute = useSystemStore((state) => state.toggleMute);
  const setVolume = useSystemStore((state) => state.setVolume);
  const { playSound } = useSound();
  
  const [activeTab, setActiveTab] = useState('general');

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    playSound('click');
  };

  const handleThemeChange = (theme: 'aqua' | 'dark') => {
    updateSettings({ theme });
    playSound('click');
  };

  const handleToggleAnimations = () => {
    updateSettings({
      uiPreferences: {
        ...settings.uiPreferences,
        animationsEnabled: !settings.uiPreferences.animationsEnabled,
      },
    });
    playSound('click');
  };

  const handleToggleSounds = () => {
    updateSettings({
      uiPreferences: {
        ...settings.uiPreferences,
        soundsEnabled: !settings.uiPreferences.soundsEnabled,
      },
    });
    playSound('click');
  };

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'appearance', name: 'Appearance', icon: '🎨' },
    { id: 'sound', name: 'Sound', icon: '🔊' },
    { id: 'about', name: 'About', icon: '❓' },
  ];

  return (
    <div className="flex h-full bg-aqua-background">
      {/* Sidebar */}
      <div className="w-48 bg-white/50 border-r border-aqua-border p-4">
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-150
                ${activeTab === tab.id 
                  ? 'bg-aqua-blue text-white' 
                  : 'text-aqua-text hover:bg-white/30'
                }
              `}
              onClick={() => {
                setActiveTab(tab.id);
                playSound('click');
              }}
            >
              <span>{tab.icon}</span>
              <span className="text-sm font-medium">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-aqua-text mb-4">General Settings</h2>
            
            <div className="bg-white/30 rounded-xl p-4">
              <h3 className="font-semibold text-aqua-text mb-3">User Interface</h3>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.uiPreferences.animationsEnabled}
                    onChange={handleToggleAnimations}
                    className="rounded"
                  />
                  <span className="text-sm text-aqua-text">Enable animations</span>
                </label>
                
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.uiPreferences.soundsEnabled}
                    onChange={handleToggleSounds}
                    className="rounded"
                  />
                  <span className="text-sm text-aqua-text">Enable sound effects</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-aqua-text mb-4">Appearance</h2>
            
            <div className="bg-white/30 rounded-xl p-4">
              <h3 className="font-semibold text-aqua-text mb-3">Theme</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-150
                    ${settings.theme === 'aqua' 
                      ? 'border-aqua-blue bg-aqua-blue/10' 
                      : 'border-aqua-border hover:border-aqua-blue/50'
                    }
                  `}
                  onClick={() => handleThemeChange('aqua')}
                >
                  <div className="w-full h-16 bg-gradient-to-br from-blue-200 to-blue-300 rounded mb-2"></div>
                  <span className="text-sm font-medium text-aqua-text">Aqua Classic</span>
                </button>
                
                <button
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-150
                    ${settings.theme === 'dark' 
                      ? 'border-aqua-blue bg-aqua-blue/10' 
                      : 'border-aqua-border hover:border-aqua-blue/50'
                    }
                  `}
                  onClick={() => handleThemeChange('dark')}
                >
                  <div className="w-full h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded mb-2"></div>
                  <span className="text-sm font-medium text-aqua-text">Dark Mode</span>
                </button>
              </div>
            </div>

            <div className="bg-white/30 rounded-xl p-4">
              <h3 className="font-semibold text-aqua-text mb-3">Wallpaper</h3>
              <p className="text-sm text-aqua-secondary">
                Currently using: Nagrand animated wallpaper
              </p>
            </div>
          </div>
        )}

        {activeTab === 'sound' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-aqua-text mb-4">Sound Settings</h2>
            
            <div className="bg-white/30 rounded-xl p-4">
              <h3 className="font-semibold text-aqua-text mb-3">Volume</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-aqua-text w-16">Master:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.volume}
                    onChange={handleVolumeChange}
                    className="flex-1"
                  />
                  <span className="text-sm text-aqua-text w-12">
                    {Math.round(settings.volume * 100)}%
                  </span>
                </div>
                
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.isMuted}
                    onChange={toggleMute}
                    className="rounded"
                  />
                  <span className="text-sm text-aqua-text">Mute all sounds</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-aqua-text mb-4">About miOS</h2>
            
            <div className="bg-white/30 rounded-xl p-6 text-center">
              <div className="text-6xl mb-4">🖥️</div>
              <h3 className="text-2xl font-bold text-aqua-text mb-2">miOS</h3>
              <p className="text-aqua-secondary mb-4">Version 1.0.0</p>
              <p className="text-sm text-aqua-text leading-relaxed max-w-md mx-auto">
                A fully working browser-native personal operating system with a 
                polished, retro-futuristic macOS Aqua-inspired desktop environment.
              </p>
              
              <div className="mt-6 pt-4 border-t border-aqua-border/30">
                <p className="text-xs text-aqua-secondary">
                  Built with React, TypeScript, and Tailwind CSS
                </p>
                <p className="text-xs text-aqua-secondary mt-1">
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