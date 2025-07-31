import React, { useState } from 'react';
import { useSound } from '../utils/hooks';

const SoundboardApp: React.FC = () => {
  const { playSound } = useSound();
  const [isRecording, setIsRecording] = useState(false);
  
  const soundPads = [
    { id: 1, label: 'Click', sound: 'click', color: 'bg-blue-500' },
    { id: 2, label: 'Open', sound: 'open', color: 'bg-green-500' },
    { id: 3, label: 'Close', sound: 'close', color: 'bg-red-500' },
    { id: 4, label: 'Error', sound: 'error', color: 'bg-orange-500' },
    { id: 5, label: 'Drop', sound: 'drop', color: 'bg-purple-500' },
    { id: 6, label: 'Select', sound: 'select', color: 'bg-pink-500' },
    { id: 7, label: 'Menu', sound: 'menu_open', color: 'bg-cyan-500' },
    { id: 8, label: 'Minimize', sound: 'minimize', color: 'bg-yellow-500' },
    { id: 9, label: 'Hover', sound: 'hover', color: 'bg-indigo-500' },
  ];

  const handlePadClick = (sound: string) => {
    playSound(sound as any);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    playSound('click');
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 to-black p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">🔊 Soundboard</h1>
        <p className="text-gray-400">Click the pads to play sounds</p>
      </div>

      {/* Control panel */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-150 ${
            isRecording 
              ? 'bg-red-600 text-white animate-pulse' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          onClick={toggleRecording}
        >
          {isRecording ? '🔴 Recording' : '⭕ Record'}
        </button>
        
        <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
          💾 Save Session
        </button>
        
        <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
          📁 Load Sounds
        </button>
      </div>

      {/* Sound pads grid */}
      <div className="flex-1">
        <div className="grid grid-cols-3 gap-4 h-full">
          {soundPads.map((pad) => (
            <button
              key={pad.id}
              className={`
                ${pad.color} hover:brightness-110 active:scale-95 
                text-white font-bold text-lg rounded-xl shadow-lg 
                transition-all duration-150 flex flex-col items-center justify-center
                border-4 border-white/20 hover:border-white/40
              `}
              onClick={() => handlePadClick(pad.sound)}
            >
              <div className="text-4xl mb-2">🔉</div>
              <div className="text-sm font-medium">{pad.label}</div>
              <div className="text-xs opacity-75 mt-1">#{pad.id}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Volume and effects */}
      <div className="mt-6 bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-white text-sm">Master Volume:</span>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="70"
              className="w-32"
            />
            <span className="text-white text-sm">70%</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
              🎛️ Effects
            </button>
            <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
              🔄 Loop Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoundboardApp;