import React, { useState, useRef, useEffect } from 'react';
import { useSound } from '../utils/hooks';

const SynthApp: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [waveform, setWaveform] = useState<OscillatorType>('sine');
  const [volume, setVolume] = useState(0.3);
  const [frequency, setFrequency] = useState(440);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const { playSound } = useSound();

  useEffect(() => {
    // Initialize audio context
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startTone = (freq: number) => {
    if (!audioContextRef.current) return;

    stopTone();

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(freq, audioContextRef.current.currentTime);
    
    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContextRef.current.currentTime + 0.01);

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.start();
    
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;
    setIsPlaying(true);
  };

  const stopTone = () => {
    if (oscillatorRef.current && gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.01);
      oscillatorRef.current.stop(audioContextRef.current.currentTime + 0.01);
    }
    
    oscillatorRef.current = null;
    gainNodeRef.current = null;
    setIsPlaying(false);
  };

  const keys = [
    { note: 'C', freq: 261.63, isBlack: false },
    { note: 'C#', freq: 277.18, isBlack: true },
    { note: 'D', freq: 293.66, isBlack: false },
    { note: 'D#', freq: 311.13, isBlack: true },
    { note: 'E', freq: 329.63, isBlack: false },
    { note: 'F', freq: 349.23, isBlack: false },
    { note: 'F#', freq: 369.99, isBlack: true },
    { note: 'G', freq: 392.00, isBlack: false },
    { note: 'G#', freq: 415.30, isBlack: true },
    { note: 'A', freq: 440.00, isBlack: false },
    { note: 'A#', freq: 466.16, isBlack: true },
    { note: 'B', freq: 493.88, isBlack: false },
  ];

  const handleKeyPress = (key: typeof keys[0]) => {
    startTone(key.freq);
    setActiveKeys(new Set([key.note]));
    playSound('click');
  };

  const handleKeyRelease = () => {
    stopTone();
    setActiveKeys(new Set());
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/30 p-4 border-b border-white/20">
        <h1 className="text-2xl font-bold text-white text-center">🎹 miOS Synth</h1>
      </div>

      {/* Controls */}
      <div className="bg-gray-800/50 p-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          {/* Waveform selector */}
          <div className="flex items-center gap-3">
            <span className="text-white text-sm">Waveform:</span>
            <select
              value={waveform}
              onChange={(e) => {
                setWaveform(e.target.value as OscillatorType);
                playSound('click');
              }}
              className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
            >
              <option value="sine">Sine</option>
              <option value="square">Square</option>
              <option value="sawtooth">Sawtooth</option>
              <option value="triangle">Triangle</option>
            </select>
          </div>

          {/* Volume control */}
          <div className="flex items-center gap-3">
            <span className="text-white text-sm">Volume:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24"
            />
            <span className="text-white text-sm w-8">{Math.round(volume * 100)}%</span>
          </div>

          {/* Frequency display */}
          <div className="flex items-center gap-3">
            <span className="text-white text-sm">Freq:</span>
            <span className="text-green-400 font-mono text-sm w-16">{frequency.toFixed(1)} Hz</span>
          </div>
        </div>
      </div>

      {/* Frequency slider */}
      <div className="bg-gray-800/30 p-4 border-b border-white/20">
        <div className="flex items-center gap-4">
          <span className="text-white text-sm">Frequency:</span>
          <input
            type="range"
            min="80"
            max="2000"
            value={frequency}
            onChange={(e) => {
              const freq = parseFloat(e.target.value);
              setFrequency(freq);
              if (isPlaying) {
                startTone(freq);
              }
            }}
            className="flex-1"
          />
          <button
            className={`px-4 py-2 rounded transition-colors ${
              isPlaying 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            onMouseDown={() => startTone(frequency)}
            onMouseUp={handleKeyRelease}
            onMouseLeave={handleKeyRelease}
          >
            {isPlaying ? 'Stop' : 'Play'}
          </button>
        </div>
      </div>

      {/* Piano keyboard */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative flex">
          {/* White keys */}
          {keys.filter(key => !key.isBlack).map((key) => (
            <button
              key={key.note}
              className={`
                w-12 h-48 bg-white border border-gray-300 transition-all duration-75
                ${activeKeys.has(key.note) ? 'bg-gray-200 shadow-inner' : 'hover:bg-gray-50 shadow-lg'}
              `}
              onMouseDown={() => handleKeyPress(key)}
              onMouseUp={handleKeyRelease}
              onMouseLeave={handleKeyRelease}
            >
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-600">
                {key.note}
              </div>
            </button>
          ))}
          
          {/* Black keys */}
          {keys.filter(key => key.isBlack).map((key, index) => {
            const blackKeyPositions = [1, 2, 4, 5, 6]; // Positions relative to white keys
            const leftOffset = blackKeyPositions[index] * 48 - 16; // 48px = white key width, 16px = half black key width
            
            return (
              <button
                key={key.note}
                className={`
                  absolute w-8 h-32 bg-gray-900 border border-gray-700 transition-all duration-75 z-10
                  ${activeKeys.has(key.note) ? 'bg-gray-700 shadow-inner' : 'hover:bg-gray-800 shadow-lg'}
                `}
                style={{ left: leftOffset }}
                onMouseDown={() => handleKeyPress(key)}
                onMouseUp={handleKeyRelease}
                onMouseLeave={handleKeyRelease}
              >
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white">
                  {key.note}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Status */}
      <div className="bg-black/30 p-2 text-center">
        <span className="text-white text-sm">
          {isPlaying ? '♪ Playing' : 'Ready'} | Click keys or drag frequency slider
        </span>
      </div>
    </div>
  );
};

export default SynthApp;