'use client';

import React, { useState, useEffect } from 'react';
import GlassCard from '../GlassCard';
import GlowButton from '../GlowButton';
import { Sparkles, Star, RotateCcw, AlertCircle } from 'lucide-react';

interface TangoGameProps {
  onGameComplete: (score: number, xp: number) => void;
}

type CellValue = '' | 'O' | 'X'; // O = Cyan, X = Red

export default function TangoGame({ onGameComplete }: TangoGameProps) {
  // Hardcoded target grid answer
  const targetGrid: CellValue[][] = [
    ['O', 'O', 'X', 'X'],
    ['X', 'X', 'O', 'O'],
    ['O', 'X', 'O', 'X'],
    ['X', 'O', 'X', 'O']
  ];

  // Pre-filled mask (true means locked starting cell)
  const startingMask = [
    [true, false, false, true],
    [false, true, true, false],
    [true, false, false, true],
    [false, true, false, false]
  ];

  const [grid, setGrid] = useState<CellValue[][]>([
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', '']
  ]);

  const [gameState, setGameState] = useState<'playing' | 'completed'>('playing');
  const [feedback, setFeedback] = useState<string>('Fill all grids. Equal O/X in every row/col.');

  const initGrid = () => {
    const newGrid = targetGrid.map((row, rIdx) => 
      row.map((val, cIdx) => startingMask[rIdx][cIdx] ? val : '')
    );
    setGrid(newGrid);
    setGameState('playing');
    setFeedback('Fill all grids. Equal O/X in every row/col.');
  };

  useEffect(() => {
    initGrid();
  }, []);

  const handleCellToggle = (r: number, c: number) => {
    if (gameState !== 'playing' || startingMask[r][c]) return;

    setGrid(prev => {
      const next = prev.map((row, rIdx) => 
        row.map((val, cIdx) => {
          if (rIdx === r && cIdx === c) {
            if (val === '') return 'O';
            if (val === 'O') return 'X';
            return '';
          }
          return val;
        })
      );
      return next;
    });
  };

  const handleVerify = () => {
    // Check if there are empty cells
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] === '') {
          setFeedback('❌ Warning: Empty coordinates detected!');
          return;
        }
      }
    }

    // Verify row counts and column counts (must be 2 O's and 2 X's)
    let isCorrect = true;
    for (let i = 0; i < 4; i++) {
      let rowO = 0, rowX = 0, colO = 0, colX = 0;
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 'O') rowO++;
        if (grid[i][j] === 'X') rowX++;
        if (grid[j][i] === 'O') colO++;
        if (grid[j][i] === 'X') colX++;
      }
      if (rowO !== 2 || rowX !== 2 || colO !== 2 || colX !== 2) {
        isCorrect = false;
        break;
      }
    }

    // Also check adjacency: no more than 2 same adjacent in row or col
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 2; c++) {
        if (grid[r][c] !== '' && grid[r][c] === grid[r][c+1] && grid[r][c] === grid[r][c+2]) {
          isCorrect = false;
        }
        if (grid[c][r] !== '' && grid[c][r] === grid[c+1][r] && grid[c][r] === grid[c+2][r]) {
          isCorrect = false;
        }
      }
    }

    if (isCorrect) {
      setGameState('completed');
      setFeedback('✔ Grid verified! Perfect alignment.');
      onGameComplete(300, 450); // High score for tough logic puzzle!
    } else {
      setFeedback('❌ Error: Adjacency or ratio constraints violated!');
    }
  };

  return (
    <GlassCard glowColor="cyan" className="flex flex-col items-center max-w-md mx-auto py-8">
      <div className="flex justify-between w-full mb-6 text-sm px-4">
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Tango Grid</span>
        </div>
        <div className="flex items-center gap-1 text-yellow-400 font-bold">
          <Star className="w-4 h-4 fill-yellow-400" />
          <span>300 pts potential</span>
        </div>
      </div>

      <div className="text-center mb-6 h-10 px-4">
        <p className={`text-xs font-semibold tracking-wide uppercase ${
          feedback.includes('❌') ? 'text-red-400' :
          feedback.includes('✔') ? 'text-emerald-400 animate-pulse' : 'text-gray-300'
        }`}>
          {feedback}
        </p>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-4 gap-3 w-72 h-72 mb-8 bg-black/40 p-3 rounded-2xl border border-white/5">
        {grid.map((row, rIdx) => 
          row.map((val, cIdx) => {
            const isLocked = startingMask[rIdx][cIdx];
            
            let displayColor = 'bg-white/5 border-white/5 hover:bg-white/10';
            if (val === 'O') {
              displayColor = 'bg-cyan-600 border-cyan-400 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]';
            } else if (val === 'X') {
              displayColor = 'bg-red-600 border-red-400 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]';
            }

            return (
              <button
                key={`${rIdx}-${cIdx}`}
                onClick={() => handleCellToggle(rIdx, cIdx)}
                disabled={gameState !== 'playing'}
                className={`w-full h-full rounded-xl border font-black text-lg transition-all cursor-pointer flex items-center justify-center relative active:scale-95 ${displayColor}`}
              >
                {val}
                {isLocked && (
                  <span className="absolute top-1 right-1 text-[8px] text-white/40">🔒</span>
                )}
              </button>
            );
          })
        )}
      </div>

      <div className="flex gap-4">
        {gameState === 'playing' ? (
          <GlowButton variant="cyan" onClick={handleVerify}>
            Verify Alignment
          </GlowButton>
        ) : (
          <GlowButton variant="outline" className="flex items-center gap-1.5" onClick={initGrid}>
            <RotateCcw className="w-4 h-4" />
            Recalibrate
          </GlowButton>
        )}
      </div>
    </GlassCard>
  );
}
