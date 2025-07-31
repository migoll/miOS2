import React, { useState, useEffect } from 'react';
import { useSound } from '../utils/hooks';

const VirtualPCApp: React.FC = () => {
  const [bootState, setBootState] = useState<'off' | 'booting' | 'ready' | 'running'>('off');
  const [bootText, setBootText] = useState<string[]>([]);
  const [currentApp, setCurrentApp] = useState<string | null>(null);
  const { playSound } = useSound();

  const bootSequence = [
    'miOS Virtual PC v1.0',
    'Copyright (c) 2024 miOS Systems',
    '',
    'Initializing virtual hardware...',
    'CPU: Intel 8086 Compatible (Emulated)',
    'Memory: 640KB Base + 384KB Extended',
    'Graphics: CGA/EGA/VGA Compatible',
    'Sound: AdLib/SoundBlaster Compatible',
    '',
    'Loading DOS kernel...',
    'MS-DOS Starting...',
    '',
    'A:\\>',
  ];

  const dosApps = [
    { name: 'EDIT.COM', description: 'Text Editor' },
    { name: 'DIR.EXE', description: 'Directory Listing' },
    { name: 'QBASIC.EXE', description: 'QuickBASIC Interpreter' },
    { name: 'GAMES\\', description: 'Retro Games Collection' },
    { name: 'UTILS\\', description: 'System Utilities' },
    { name: 'DEMOS\\', description: 'Demo Programs' },
  ];

  useEffect(() => {
    if (bootState === 'booting') {
      let index = 0;
      const interval = setInterval(() => {
        if (index < bootSequence.length) {
          setBootText(prev => [...prev, bootSequence[index]]);
          index++;
          playSound('hover');
        } else {
          clearInterval(interval);
          setBootState('ready');
          playSound('open');
        }
      }, 300);

      return () => clearInterval(interval);
    }
  }, [bootState, playSound]);

  const handlePowerOn = () => {
    setBootState('booting');
    setBootText([]);
    setCurrentApp(null);
    playSound('open');
  };

  const handlePowerOff = () => {
    setBootState('off');
    setBootText([]);
    setCurrentApp(null);
    playSound('close');
  };

  const handleRunApp = (appName: string) => {
    setCurrentApp(appName);
    setBootState('running');
    playSound('click');
  };

  const handleExitApp = () => {
    setCurrentApp(null);
    setBootState('ready');
    playSound('close');
  };

  const renderApp = () => {
    switch (currentApp) {
      case 'EDIT.COM':
        return (
          <div className="h-full bg-blue-900 text-white p-4">
            <div className="bg-blue-700 p-2 mb-4 text-center font-bold">
              MS-DOS Editor
            </div>
            <textarea
              className="w-full h-5/6 bg-blue-900 text-white border border-gray-400 p-2 font-mono text-sm resize-none"
              placeholder="Type your text here..."
              style={{ fontFamily: 'monospace' }}
            />
            <div className="mt-2 text-xs">F1=Help F2=Save F3=Open F10=Exit</div>
          </div>
        );
      
      case 'QBASIC.EXE':
        return (
          <div className="h-full bg-blue-900 text-white p-4">
            <div className="bg-blue-700 p-2 mb-4 text-center font-bold">
              Microsoft QuickBASIC
            </div>
            <div className="bg-blue-800 p-4 h-5/6 font-mono text-sm overflow-y-auto">
              <div className="text-yellow-300">10 PRINT "HELLO, miOS!"</div>
              <div className="text-yellow-300">20 FOR I = 1 TO 10</div>
              <div className="text-yellow-300">30 PRINT "LINE "; I</div>
              <div className="text-yellow-300">40 NEXT I</div>
              <div className="text-yellow-300">50 END</div>
              <div className="mt-4 text-green-300">RUN</div>
              <div className="text-white">HELLO, miOS!</div>
              <div className="text-white">LINE 1</div>
              <div className="text-white">LINE 2</div>
              <div className="text-white">...</div>
              <div className="text-white">Ok</div>
              <div className="text-green-300 animate-pulse">_</div>
            </div>
          </div>
        );

      case 'GAMES\\':
        return (
          <div className="h-full bg-black text-green-400 p-4 font-mono">
            <div className="text-center mb-4 text-yellow-300">
              ═══ RETRO GAMES COLLECTION ═══
            </div>
            <div className="space-y-2">
              <div>🎮 TETRIS.EXE - Classic falling blocks</div>
              <div>🏁 DIGGER.EXE - Underground adventure</div>
              <div>👾 INVADERS.EXE - Space shooting action</div>
              <div>🐍 SNAKE.EXE - Growing snake challenge</div>
              <div>🎯 PONG.EXE - Original arcade tennis</div>
            </div>
            <div className="mt-8 text-center text-red-400">
              [DEMO MODE - GAMES NOT PLAYABLE YET]
            </div>
          </div>
        );

      default:
        return (
          <div className="h-full bg-blue-900 text-white p-4 font-mono">
            <div className="text-center text-red-400 mb-4">
              Application not implemented yet
            </div>
            <div className="text-yellow-300">
              Coming soon in future updates!
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800">
      {/* Computer case header */}
      <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-4 border-b-2 border-gray-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl">💻</div>
            <div>
              <div className="text-white font-bold">Virtual PC Emulator</div>
              <div className="text-gray-300 text-sm">8086/DOS Compatible System</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${bootState !== 'off' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <button
              className={`px-4 py-2 rounded font-medium transition-colors ${
                bootState === 'off' 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
              onClick={bootState === 'off' ? handlePowerOn : handlePowerOff}
            >
              {bootState === 'off' ? '🔌 Power On' : '⏻ Power Off'}
            </button>
          </div>
        </div>
      </div>

      {/* Monitor */}
      <div className="flex-1 p-6 bg-gray-700">
        <div className="w-full h-full bg-black border-8 border-gray-600 rounded-lg overflow-hidden relative">
          {/* CRT-style screen effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent pointer-events-none"></div>
          
          {bootState === 'off' && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-600">
                <div className="text-6xl mb-4">💻</div>
                <div className="text-xl mb-2">Virtual PC is powered off</div>
                <div className="text-sm">Click "Power On" to boot the system</div>
              </div>
            </div>
          )}

          {bootState === 'booting' && (
            <div className="p-4 h-full overflow-y-auto">
              <div className="font-mono text-green-400 text-sm leading-relaxed">
                {bootText.map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
                <div className="animate-pulse">█</div>
              </div>
            </div>
          )}

          {bootState === 'ready' && (
            <div className="p-4 h-full bg-blue-900 text-white font-mono text-sm">
              <div className="mb-4">
                <div>Microsoft(R) MS-DOS(R) Version 6.22</div>
                <div>Copyright Microsoft Corp 1981-1994.</div>
                <div></div>
              </div>

              <div className="mb-4">
                <div>Directory of A:\</div>
                <div></div>
                {dosApps.map((app, index) => (
                  <div 
                    key={index}
                    className="hover:bg-blue-700 cursor-pointer p-1 rounded"
                    onClick={() => handleRunApp(app.name)}
                  >
                    <span className="w-16 inline-block">{app.name}</span>
                    <span className="text-gray-300">{app.description}</span>
                  </div>
                ))}
                <div></div>
                <div className="text-gray-300">
                  {dosApps.length} File(s)    1,234,567 bytes free
                </div>
              </div>

              <div className="flex items-center">
                <span>A:\&gt;</span>
                <div className="ml-2 w-2 h-4 bg-white animate-pulse"></div>
              </div>
            </div>
          )}

          {bootState === 'running' && currentApp && (
            <div className="h-full relative">
              {renderApp()}
              <button
                className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                onClick={handleExitApp}
              >
                ✕ Exit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-gray-600 px-4 py-2 text-white text-sm">
        <div className="flex justify-between">
          <span>
            Status: {bootState === 'off' ? 'Powered Off' : 
                    bootState === 'booting' ? 'Booting...' :
                    bootState === 'running' ? `Running ${currentApp}` : 'Ready'}
          </span>
          <span>Virtual Hardware: 8086 CPU, 1MB RAM, CGA/VGA</span>
        </div>
      </div>
    </div>
  );
};

export default VirtualPCApp;