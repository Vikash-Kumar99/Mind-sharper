'use client';

import React, { useState, useEffect, useRef } from 'react';
import GlassCard from '../GlassCard';
import GlowButton from '../GlowButton';
import { Target, Zap, Clock, RotateCcw } from 'lucide-react';

interface ArrowPuzzleProps {
  onGameComplete: (score: number, xp: number) => void;
}

interface RoundData {
  displayString: string; // E.g., ">> < >>" or "<< < <<"
  centerDirection: 'L' | 'R';
}

export default function ArrowPuzzle({ onGameComplete }: ArrowPuzzleProps) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [currentArrows, setCurrentArrows] = useState<RoundData>({ displayString: '', centerDirection: 'L' });
  const [feedback, setFeedback] = useState('');

  const timerRef = useRef<any>(null);

  const generateArrows = () => {
    const centerDir: 'L' | 'R' = Math.random() > 0.5 ? 'L' : 'R';
    const isCongruent = Math.random() > 0.5;

    let flanks = '';
    if (isCongruent) {
      flanks = centerDir === 'L' ? '<<' : '>>';
    } else {
      flanks = centerDir === 'L' ? '>>' : '<<';
    }

    const centerSymbol = centerDir === 'L' ? '<' : '>';
    const displayString = `${flanks} ${centerSymbol} ${flanks}`;

    setCurrentArrows({
      displayString,
      centerDirection: centerDir
    });
    setFeedback('');
  };

  const handleArrowPress = (direction: 'L' | 'R') => {
    if (gameState !== 'playing') return;

    if (direction === currentArrows.centerDirection) {
      setScore(prev => prev + 20);
      setFeedback('✔ Sharp Focus!');
      setTimeLeft(prev => Math.min(20, prev + 1.2)); // Tiny time bonus
    } else {
      setFeedback('❌ Misdirected!');
      setTimeLeft(prev => Math.max(0, prev - 2.5)); // Penalty!
    }

    generateArrows();
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft === 0) {
      setGameState('gameover');
      const earnedXp = Math.round(score * 1.5);
      onGameComplete(score, earnedXp);
    }
  }, [timeLeft, gameState, score, onGameComplete]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(15);
    setGameState('playing');
    generateArrows();
  };

  return (
    <GlassCard glowColor="purple" className="flex flex-col items-center max-w-md mx-auto py-8">
      <div className="flex justify-between w-full mb-6 text-sm px-4">
        <div className="flex items-center gap-1 text-purple-400 font-bold">
          <Target className="w-4 h-4" />
          <span>Central Vector</span>
        </div>
        <div className="flex items-center gap-1.5 text-yellow-400 font-bold">
          <Zap className="w-4 h-4 fill-yellow-400" />
          <span>{score} pts</span>
        </div>
        <div className="flex items-center gap-1 text-purple-400 font-bold">
          <Clock className="w-4 h-4" />
          <span className={timeLeft < 4 ? 'text-red-500 animate-ping font-mono' : 'font-mono'}>{timeLeft}s</span>
        </div>
      </div>

      <div className="text-center h-28 flex flex-col items-center justify-center mb-6">
        {gameState === 'playing' ? (
          <div>
            <h2 className="text-5xl font-black tracking-widest text-cyan-400 animate-pulse font-mono">
              {currentArrows.displayString}
            </h2>
            <p className="text-[10px] text-gray-500 mt-4 uppercase tracking-widest font-semibold">
              Tap the direction of the MIDDLE arrow only!
            </p>
          </div>
        ) : (
          <p className="text-gray-400 text-sm leading-normal">
            Ignore flanking arrows. Focus strictly on the core center vector arrow.
          </p>
        )}
      </div>

      {feedback && (
        <p className={`text-xs font-semibold mb-4 uppercase tracking-wider ${feedback.includes('❌') ? 'text-red-400' : 'text-emerald-400'}`}>
          {feedback}
        </p>
      )}

      {/* Control Buttons */}
      {gameState === 'playing' && (
        <div className="flex gap-4 w-full px-4 mb-8">
          <button
            onClick={() => handleArrowPress('L')}
            className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-2xl cursor-pointer active:scale-95 transition-all text-2xl shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          >
            ←
          </button>
          <button
            onClick={() => handleArrowPress('R')}
            className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-2xl cursor-pointer active:scale-95 transition-all text-2xl shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          >
            →
          </button>
        </div>
      )}

      {gameState === 'idle' && (
        <GlowButton variant="purple" onClick={startGame}>
          Arouse Inhibitors
        </GlowButton>
      )}

      {gameState === 'gameover' && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm font-bold text-red-400">Target Time Exceeded!</p>
          <p className="text-xs text-gray-400">Final score submitted! Earned +{Math.round(score * 1.5)} XP</p>
          <GlowButton variant="outline" className="flex items-center gap-2" onClick={startGame}>
            <RotateCcw className="w-4 h-4" />
            Restart Vector
          </GlowButton>
        </div>
      )}
    </GlassCard>
  );
}
