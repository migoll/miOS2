import React, { useState } from 'react';
import { useSound } from '../utils/hooks';

const iPodApp: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState(0);
  const [currentScreen, setCurrentScreen] = useState('main');
  const [isPlaying, setIsPlaying] = useState(false);
  const { playSound } = useSound();

  const mainMenu = [
    { id: 'music', label: 'Music', icon: '🎵' },
    { id: 'videos', label: 'Videos', icon: '📺' },
    { id: 'photos', label: 'Photos', icon: '📷' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const musicMenu = [
    { id: 'all', label: 'All Songs', count: '42' },
    { id: 'artists', label: 'Artists', count: '12' },
    { id: 'albums', label: 'Albums', count: '8' },
    { id: 'playlists', label: 'Playlists', count: '3' },
  ];

  const handleWheelScroll = (direction: 'up' | 'down') => {
    const currentMenu = currentScreen === 'main' ? mainMenu : musicMenu;
    if (direction === 'up') {
      setSelectedItem(Math.max(0, selectedItem - 1));
    } else {
      setSelectedItem(Math.min(currentMenu.length - 1, selectedItem + 1));
    }
    playSound('hover');
  };

  const handleCenterClick = () => {
    if (currentScreen === 'main') {
      const selected = mainMenu[selectedItem];
      if (selected.id === 'music') {
        setCurrentScreen('music');
        setSelectedItem(0);
      }
    }
    playSound('click');
  };

  const handleMenuClick = () => {
    if (currentScreen !== 'main') {
      setCurrentScreen('main');
      setSelectedItem(0);
    }
    playSound('click');
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    playSound(isPlaying ? 'close' : 'open');
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-100 to-gray-300 rounded-3xl p-6">
      {/* iPod body */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Screen */}
        <div className="w-64 h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg border-4 border-gray-400 shadow-inner p-4 mb-8">
          <div className="w-full h-full bg-white rounded border shadow-inner p-3 text-black">
            {currentScreen === 'main' && (
              <div>
                <div className="text-center font-bold mb-3">🎵 miOS iPod</div>
                <div className="space-y-1">
                  {mainMenu.map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-2 p-1 rounded ${
                        index === selectedItem ? 'bg-blue-500 text-white' : ''
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span className="text-sm">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {currentScreen === 'music' && (
              <div>
                <div className="text-center font-bold mb-3">🎵 Music</div>
                <div className="space-y-1">
                  {musicMenu.map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-1 rounded ${
                        index === selectedItem ? 'bg-blue-500 text-white' : ''
                      }`}
                    >
                      <span className="text-sm">{item.label}</span>
                      <span className="text-xs">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Click wheel */}
        <div className="relative w-48 h-48 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full shadow-lg">
          {/* Outer ring for scrolling */}
          <div className="absolute inset-2 border-4 border-gray-300 rounded-full">
            {/* Menu button */}
            <button
              className="absolute top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-6 bg-gray-100 hover:bg-gray-200 rounded text-xs font-bold shadow transition-colors"
              onClick={handleMenuClick}
            >
              MENU
            </button>
            
            {/* Previous button */}
            <button
              className="absolute left-2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-8 bg-gray-100 hover:bg-gray-200 rounded shadow transition-colors flex items-center justify-center"
              onClick={() => handleWheelScroll('up')}
            >
              ⏮
            </button>
            
            {/* Next button */}
            <button
              className="absolute right-2 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-6 h-8 bg-gray-100 hover:bg-gray-200 rounded shadow transition-colors flex items-center justify-center"
              onClick={() => handleWheelScroll('down')}
            >
              ⏭
            </button>
            
            {/* Play/Pause button */}
            <button
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-8 h-6 bg-gray-100 hover:bg-gray-200 rounded text-xs font-bold shadow transition-colors"
              onClick={togglePlayPause}
            >
              {isPlaying ? '⏸' : '▶️'}
            </button>
          </div>
          
          {/* Center button */}
          <button
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-200 hover:from-gray-100 hover:to-gray-300 rounded-full shadow-inner border-2 border-gray-300 transition-all duration-150 active:scale-95"
            onClick={handleCenterClick}
          >
            <div className="text-xl">✓</div>
          </button>
        </div>

        {/* Status */}
        {isPlaying && (
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-600">♪ Now Playing ♪</div>
            <div className="text-xs text-gray-500 mt-1">Retro Synthwave Mix</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default iPodApp;