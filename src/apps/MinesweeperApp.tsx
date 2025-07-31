import React, { useState, useEffect } from 'react';
import { useSound } from '../utils/hooks';

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborCount: number;
}

const MinesweeperApp: React.FC = () => {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'won' | 'lost'>('ready');
  const [mineCount, setMineCount] = useState(10);
  const [flagCount, setFlagCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const { playSound } = useSound();

  const difficulties = {
    easy: { rows: 9, cols: 9, mines: 10 },
    medium: { rows: 16, cols: 16, mines: 40 },
    hard: { rows: 16, cols: 30, mines: 99 },
  };

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState]);

  const initializeGame = () => {
    const { rows, cols, mines } = difficulties[difficulty];
    const newBoard: Cell[][] = Array(rows).fill(null).map(() =>
      Array(cols).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborCount: 0,
      }))
    );

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor counts
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const newRow = row + dr;
              const newCol = col + dc;
              if (
                newRow >= 0 && newRow < rows &&
                newCol >= 0 && newCol < cols &&
                newBoard[newRow][newCol].isMine
              ) {
                count++;
              }
            }
          }
          newBoard[row][col].neighborCount = count;
        }
      }
    }

    setBoard(newBoard);
    setGameState('ready');
    setMineCount(mines);
    setFlagCount(0);
    setTimeElapsed(0);
  };

  const revealCell = (row: number, col: number) => {
    if (gameState === 'won' || gameState === 'lost') return;
    
    const cell = board[row][col];
    if (cell.isRevealed || cell.isFlagged) return;

    if (gameState === 'ready') {
      setGameState('playing');
    }

    const newBoard = [...board];
    
    if (cell.isMine) {
      // Game over
      newBoard.forEach(row => row.forEach(cell => {
        if (cell.isMine) cell.isRevealed = true;
      }));
      setBoard(newBoard);
      setGameState('lost');
      playSound('error');
      return;
    }

    // Reveal cell and potentially cascade
    const toReveal: [number, number][] = [[row, col]];
    const revealed = new Set<string>();

    while (toReveal.length > 0) {
      const [currentRow, currentCol] = toReveal.pop()!;
      const key = `${currentRow},${currentCol}`;
      
      if (revealed.has(key)) continue;
      revealed.add(key);

      const currentCell = newBoard[currentRow][currentCol];
      if (currentCell.isRevealed || currentCell.isFlagged || currentCell.isMine) continue;

      currentCell.isRevealed = true;

      // If cell has no neighboring mines, reveal all neighbors
      if (currentCell.neighborCount === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const newRow = currentRow + dr;
            const newCol = currentCol + dc;
            if (
              newRow >= 0 && newRow < newBoard.length &&
              newCol >= 0 && newCol < newBoard[0].length
            ) {
              toReveal.push([newRow, newCol]);
            }
          }
        }
      }
    }

    setBoard(newBoard);
    playSound('click');

    // Check for win condition
    const { mines } = difficulties[difficulty];
    const revealedCount = newBoard.flat().filter(cell => cell.isRevealed).length;
    const totalCells = newBoard.length * newBoard[0].length;
    
    if (revealedCount === totalCells - mines) {
      setGameState('won');
      playSound('open');
    }
  };

  const toggleFlag = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    
    if (gameState === 'won' || gameState === 'lost') return;
    
    const cell = board[row][col];
    if (cell.isRevealed) return;

    const newBoard = [...board];
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    
    setBoard(newBoard);
    setFlagCount(prev => newBoard[row][col].isFlagged ? prev + 1 : prev - 1);
    playSound('select');
  };

  const getCellDisplay = (cell: Cell) => {
    if (cell.isFlagged) return '🚩';
    if (!cell.isRevealed) return '';
    if (cell.isMine) return '💣';
    if (cell.neighborCount === 0) return '';
    return cell.neighborCount.toString();
  };

  const getCellClass = (cell: Cell) => {
    let baseClass = 'w-8 h-8 border border-gray-400 flex items-center justify-center text-sm font-bold transition-all duration-150 ';
    
    if (!cell.isRevealed) {
      baseClass += 'bg-gray-300 hover:bg-gray-200 active:bg-gray-100 cursor-pointer shadow-sm ';
    } else {
      baseClass += 'bg-gray-100 ';
      if (cell.isMine) {
        baseClass += 'bg-red-200 ';
      }
    }

    // Number colors
    if (cell.isRevealed && !cell.isMine && cell.neighborCount > 0) {
      const colors = [
        '', 'text-blue-600', 'text-green-600', 'text-red-600',
        'text-purple-600', 'text-yellow-600', 'text-pink-600',
        'text-gray-600', 'text-black'
      ];
      baseClass += colors[cell.neighborCount] || 'text-black';
    }

    return baseClass;
  };

  return (
    <div className="flex flex-col h-full bg-gray-200">
      {/* Header */}
      <div className="bg-gray-300 p-4 border-b-2 border-gray-400">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-black text-green-400 px-3 py-1 font-mono">
              💣 {mineCount - flagCount}
            </div>
            <div className="bg-black text-green-400 px-3 py-1 font-mono">
              ⏱️ {timeElapsed.toString().padStart(3, '0')}
            </div>
          </div>
          
          <button
            className={`text-4xl transition-transform active:scale-90 ${
              gameState === 'won' ? '😎' : gameState === 'lost' ? '😵' : '🙂'
            }`}
            onClick={() => {
              initializeGame();
              playSound('click');
            }}
          >
            {gameState === 'won' ? '😎' : gameState === 'lost' ? '😵' : '🙂'}
          </button>

          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  difficulty === diff
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => {
                  setDifficulty(diff);
                  playSound('click');
                }}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Game board */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <div className="inline-block bg-gray-400 p-2 border-2 border-gray-500">
          <div 
            className="grid gap-0 border-2 border-gray-600"
            style={{ 
              gridTemplateColumns: `repeat(${board[0]?.length || 0}, 1fr)`,
            }}
          >
            {board.flat().map((cell, index) => {
              const row = Math.floor(index / board[0].length);
              const col = index % board[0].length;
              
              return (
                <button
                  key={index}
                  className={getCellClass(cell)}
                  onClick={() => revealCell(row, col)}
                  onContextMenu={(e) => toggleFlag(e, row, col)}
                  disabled={gameState === 'won' || gameState === 'lost'}
                >
                  {getCellDisplay(cell)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-gray-300 p-2 border-t border-gray-400 text-center text-sm text-gray-700">
        {gameState === 'ready' && 'Click a cell to start'}
        {gameState === 'playing' && 'Left click to reveal, right click to flag'}
        {gameState === 'won' && '🎉 Congratulations! You won!'}
        {gameState === 'lost' && '💥 Game Over! Try again'}
      </div>
    </div>
  );
};

export default MinesweeperApp;