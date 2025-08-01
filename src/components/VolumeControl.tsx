import React, { useState, useRef, useEffect } from 'react';
import { useSystemStore } from '../stores/systemStore';
import { useSound } from '../utils/hooks';
import { useTextSize } from '../utils/textSize';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';

export const VolumeControl: React.FC = () => {
  const [showSlider, setShowSlider] = useState(false);
  const settings = useSystemStore((state) => state.settings);
  const toggleMute = useSystemStore((state) => state.toggleMute);
  const setVolume = useSystemStore((state) => state.setVolume);
  const { playSound } = useSound();
  const { getTextSizeClass } = useTextSize();
  const controlRef = useRef<HTMLDivElement>(null);
  const isDarkMode = settings.theme === 'dark';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (controlRef.current && !controlRef.current.contains(event.target as Node)) {
        setShowSlider(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleVolumeClick = () => {
    if (showSlider) {
      toggleMute();
      playSound('click');
    } else {
      setShowSlider(true);
      playSound('menu_open');
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const getVolumeIcon = () => {
    if (settings.isMuted || settings.volume === 0) {
      return <span className={getTextSizeClass()}>🔇</span>;
    } else if (settings.volume < 0.5) {
      return <HiVolumeOff className="w-4 h-4" />;
    } else {
      return <HiVolumeUp className="w-4 h-4" />;
    }
  };

  return (
    <div ref={controlRef} className="relative flex items-center">
      <div className="flex items-center">
        {/* Volume Icon */}
        <button
          className={`p-1 rounded transition-all duration-300 ease-in-out ${
            isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-white/10'
          } ${showSlider ? 'mr-2' : ''}`}
          onClick={handleVolumeClick}
          title={settings.isMuted ? 'Unmute' : showSlider ? 'Mute' : 'Volume'}
        >
          {getVolumeIcon()}
        </button>

        {/* Volume Slider - slides in from the right */}
        <div 
          className={`flex items-center transition-all duration-300 ease-in-out ${
            showSlider ? 'w-20 opacity-100' : 'w-0 opacity-0'
          }`}
          style={{ 
            overflow: showSlider ? 'visible' : 'hidden',
            height: '20px' // Ensure enough height for the knob
          }}
        >
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={settings.isMuted ? 0 : settings.volume}
            onChange={handleSliderChange}
            className={`w-20 slider transition-opacity duration-300 ${
              settings.isMuted ? 'opacity-50' : 'opacity-100'
            }`}
            style={{
              height: '4px',
              background: settings.isMuted 
                ? 'rgba(255, 255, 255, 0.3)' 
                : `linear-gradient(to right, #007AFF 0%, #007AFF ${settings.volume * 100}%, rgba(255, 255, 255, 0.3) ${settings.volume * 100}%, rgba(255, 255, 255, 0.3) 100%)`
            }}
          />
        </div>
      </div>
    </div>
  );
};