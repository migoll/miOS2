import React, { useState, useRef, useEffect } from 'react';
import { useSound } from '../utils/hooks';

const TerminalApp: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([
    'miOS Terminal v1.0.0',
    'Type "help" for available commands.',
    '',
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { playSound } = useSound();

  useEffect(() => {
    // Auto-focus input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const commands = {
    help: () => [
      'Available commands:',
      '  help        - Show this help message',
      '  clear       - Clear the terminal',
      '  whoami      - Display current user',
      '  date        - Show current date and time',
      '  echo [text] - Echo text back',
      '  ls          - List directory contents',
      '  pwd         - Print working directory',
      '  uname       - System information',
      '  fortune     - Random quote',
      '  cowsay      - Make a cow say something',
      '  ai          - AI assistant (coming soon)',
      '',
    ],
    clear: () => {
      setHistory(['miOS Terminal v1.0.0', 'Type "help" for available commands.', '']);
      return [];
    },
    whoami: () => ['mios-user'],
    date: () => [new Date().toString()],
    ls: () => [
      'Applications/',
      'Desktop/',
      'Documents/',
      'Downloads/',
      'Music/',
      'Pictures/',
      'miOS-GUIDELINES.md',
      '',
    ],
    pwd: () => ['/Users/mios-user'],
    uname: () => ['miOS 1.0.0 (Browser-Native Operating System)'],
    fortune: () => {
      const quotes = [
        '"The best way to predict the future is to invent it." - Alan Kay',
        '"Code is poetry written in logic." - Unknown',
        '"Any sufficiently advanced technology is indistinguishable from magic." - Arthur C. Clarke',
        '"The computer was born to solve problems that did not exist before." - Bill Gates',
        '"Programs must be written for people to read, and only incidentally for machines to execute." - Harold Abelson',
      ];
      return [quotes[Math.floor(Math.random() * quotes.length)]];
    },
    cowsay: (text: string) => {
      const message = text || 'Hello from miOS!';
      const border = '_'.repeat(message.length + 2);
      return [
        ` ${border}`,
        `< ${message} >`,
        ` ${'-'.repeat(message.length + 2)}`,
        '        \\   ^__^',
        '         \\  (oo)\\_______',
        '            (__)\\       )\\/\\',
        '                ||----w |',
        '                ||     ||',
        '',
      ];
    },
    ai: () => [
      'AI Assistant is coming soon!',
      'This will provide intelligent command assistance and task automation.',
      'Stay tuned for updates.',
      '',
    ],
  };

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    playSound('click');

    // Add command to history
    setCommandHistory(prev => [...prev, trimmedCmd]);
    setHistoryIndex(-1);

    // Parse command and arguments
    const [command, ...args] = trimmedCmd.split(' ');
    const commandKey = command.toLowerCase() as keyof typeof commands;

    // Add command line to output
    const newHistory = [...history, `$ ${trimmedCmd}`];

    if (commands[commandKey]) {
      const result = commands[commandKey](args.join(' '));
      setHistory([...newHistory, ...result]);
    } else {
      setHistory([...newHistory, `Command not found: ${command}`, 'Type "help" for available commands.', '']);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Basic tab completion
      const availableCommands = Object.keys(commands);
      const matches = availableCommands.filter(cmd => cmd.startsWith(input));
      if (matches.length === 1) {
        setInput(matches[0]);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-green-400 font-mono text-sm">
      {/* Terminal header */}
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-gray-300 text-xs">miOS Terminal</span>
        <div className="w-12"></div>
      </div>

      {/* Terminal content */}
      <div 
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {/* History */}
        {history.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}

        {/* Current input line */}
        <div className="flex items-center">
          <span className="text-yellow-400">$ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 bg-transparent outline-none border-none text-green-400 ml-1"
            autoComplete="off"
            spellCheck={false}
          />
          <span className="animate-pulse bg-green-400 w-2 h-4 ml-1"></span>
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-gray-800 px-4 py-1 border-t border-gray-600 text-xs text-gray-400 flex justify-between">
        <span>Commands: {Object.keys(commands).length}</span>
        <span>History: {commandHistory.length}</span>
        <span>Ready</span>
      </div>
    </div>
  );
};

export default TerminalApp;