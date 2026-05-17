'use client';

import React, { useState } from 'react';
import GlassCard from '../GlassCard';
import GlowButton from '../GlowButton';
import { Star, RotateCcw, Award } from 'lucide-react';

interface ChessTacticsProps {
  onGameComplete: (score: number, xp: number) => void;
}

type SquareId = 'A4' | 'B4' | 'C4' | 'D4' | 
                 'A3' | 'B3' | 'C3' | 'D3' | 
                 'A2' | 'B2' | 'C2' | 'D2' | 
                 'A1' | 'B1' | 'C1' | 'D1';

type PieceType = 'K' | 'Q' | 'R' | 'k' | ''; // k = black king, Capital = White

export default function ChessTactics({ onGameComplete }: ChessTacticsProps) {
  // Mini board state mapping square IDs to pieces
  const initialPieces: Record<SquareId, PieceType> = {
    'A4': '',  'B4': 'k', 'C4': '',  'D4': 'K',
    'A3': '',  'B3': '',  'C3': 'Q', 'D3': '',
    'A2': '',  'B2': '',  'C2': '',  'D2': '',
    'A1': 'R', 'B1': '',  'C1': '',  'D1': ''
  };

  const [pieces, setPieces] = useState<Record<SquareId, PieceType>>(initialPieces);
  const [selectedSquare, setSelectedSquare] = useState<SquareId | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'completed'>('playing');
  const [feedback, setFeedback] = useState('White to Move: Deliver Checkmate in 1!');

  const handleSquareClick = (square: SquareId) => {
    if (gameState !== 'playing') return;

    // 1. Select the White Queen at C3
    if (selectedSquare === null) {
      if (pieces[square] === 'Q') {
        setSelectedSquare(square);
        setFeedback('Queen selected! Tap the destination checkmate square.');
      } else {
        setFeedback('❌ Select the active White Queen (Q) to deliver mate!');
      }
      return;
    }

    // 2. Try to move Queen to destination B3 (Checkmate)
    if (selectedSquare === 'C3') {
      if (square === 'B3') {
        // Move Queen to B3
        setPieces(prev => ({
          ...prev,
          'C3': '',
          'B3': 'Q'
        }));
        setSelectedSquare(null);
        setGameState('completed');
        setFeedback('👑 CHECKMATE! King is fully pinned. Puzzle Solved!');
        onGameComplete(350, 500); // Massive XP for chess masters!
      } else {
        setSelectedSquare(null);
        setFeedback('❌ Escape path open! The Black King can flee. Try again.');
      }
    }
  };

  const resetPuzzle = () => {
    setPieces(initialPieces);
    setSelectedSquare(null);
    setGameState('playing');
    setFeedback('White to Move: Deliver Checkmate in 1!');
  };

  // Render the board coordinates rows 4 down to 1
  const rows: ('4' | '3' | '2' | '1')[] = ['4', '3', '2', '1'];
  const cols: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

  return (
    <GlassCard glowColor="purple" className="flex flex-col items-center max-w-md mx-auto py-8">
      <div className="flex justify-between w-full mb-6 text-sm px-4">
        <div className="flex items-center gap-1.5 text-purple-400 font-bold uppercase tracking-wider font-mono">
          <Award className="w-4 h-4" />
          <span>Chess Arena</span>
        </div>
        <div className="flex items-center gap-1 text-yellow-400 font-bold">
          <Star className="w-4 h-4 fill-yellow-400" />
          <span>350 pts potential</span>
        </div>
      </div>

      <div className="text-center mb-6 h-10 px-4">
        <p className={`text-xs font-semibold tracking-wide uppercase ${
          feedback.includes('❌') ? 'text-red-400 animate-shake' :
          feedback.includes('👑') ? 'text-emerald-400 animate-pulse' : 'text-gray-300'
        }`}>
          {feedback}
        </p>
      </div>

      {/* Board Rendering */}
      <div className="bg-slate-950 p-4 rounded-3xl border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.15)] mb-8">
        <div className="grid grid-cols-4 gap-1.5 w-64 h-64 relative z-10 select-none">
          {rows.map((r, rIdx) => 
            cols.map((c, cIdx) => {
              const sqId = `${c}${r}` as SquareId;
              const isDark = (rIdx + cIdx) % 2 === 1;
              const piece = pieces[sqId];
              const isSelected = selectedSquare === sqId;

              let cellStyle = isDark ? 'bg-purple-950/40 border-purple-900/30' : 'bg-slate-900 border-slate-800';
              if (isSelected) {
                cellStyle = 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_12px_#10b981]';
              }

              // Label Unicode symbols for pieces
              let pieceSymbol = '';
              if (piece === 'K') pieceSymbol = '♔';
              if (piece === 'Q') pieceSymbol = '♕';
              if (piece === 'R') pieceSymbol = '♖';
              if (piece === 'k') pieceSymbol = '♚';

              return (
                <button
                  key={sqId}
                  onClick={() => handleSquareClick(sqId)}
                  className={`w-full h-full rounded-xl border font-bold text-3xl transition-all cursor-pointer relative flex items-center justify-center active:scale-95 ${cellStyle}`}
                >
                  <span className={piece === 'k' ? 'text-red-400' : 'text-purple-300'}>
                    {pieceSymbol}
                  </span>
                  
                  {/* Coordinates indicator overlay */}
                  <span className="absolute bottom-0.5 right-1 text-[8px] text-white/20 uppercase font-mono font-light pointer-events-none">
                    {sqId}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {gameState === 'completed' && (
        <GlowButton variant="outline" className="flex items-center gap-1.5" onClick={resetPuzzle}>
          <RotateCcw className="w-4 h-4" />
          Replay Puzzle
        </GlowButton>
      )}
    </GlassCard>
  );
}
