'use client';

import React, { useState, useEffect, useRef } from 'react';
import GlassCard from '../GlassCard';
import GlowButton from '../GlowButton';
import { Brain, Star, Heart, RotateCcw, AlertTriangle, HelpCircle } from 'lucide-react';

interface GridNBackProps {
  onGameComplete: (score: number, xp: number) => void;
}

export default function GridNBack({ onGameComplete }: GridNBackProps) {
  const [nValue, setNValue] = useState<number>(2); // Default N=2 (Hard)
  const [gameState, setGameState] = useState<'idle' | 'countdown' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [sequence, setSequence] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [feedback, setFeedback] = useState<string>('');
  
  // Track if user clicked match for the current flash step
  const [hasActioned, setHasActioned] = useState(false);

  const timerRef = useRef<any>(null);
  const sequenceLength = 25; // 25 step test sequence

  const startCountdown = () => {
    setGameState('countdown');
    setCountdown(3);
    setScore(0);
    setLives(3);
    setFeedback('');
    setCurrentIndex(-1);
    setActiveCell(null);

    // Generate random sequence of positions (0 to 8) for a 3x3 grid
    const seq: number[] = [];
    for (let i = 0; i < sequenceLength; i++) {
      // 35% chance to force a match with N steps ago to keep it interesting
      if (i >= nValue && Math.random() < 0.35) {
        seq.push(seq[i - nValue]);
      } else {
        seq.push(Math.floor(Math.random() * 9));
      }
    }
    setSequence(seq);

    const countInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countInterval);
          startGameLoop();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startGameLoop = () => {
    setGameState('playing');
    advanceSequence(0);
  };

  const advanceSequence = (index: number) => {
    if (index >= sequenceLength) {
      handleGameOver(true);
      return;
    }

    setCurrentIndex(index);
    setHasActioned(false);
    
    // Light up the cell
    const cellIdx = sequence[index];
    setActiveCell(cellIdx);

    // Turn off active cell highlight after 1000ms
    setTimeout(() => {
      setActiveCell(null);
    }, 1000);

    // Advance to next cell after 2000ms total interval
    timerRef.current = setTimeout(() => {
      // Evaluate if the user MISSED a match (they did not press Match but it was indeed a match)
      if (index >= nValue) {
        const isMatch = sequence[index] === sequence[index - nValue];
        // If it was a match and they did not click the match button
        if (isMatch && !hasActioned) {
          setLives((prev) => {
            const nextLives = prev - 1;
            if (nextLives <= 0) {
              handleGameOver(false);
            } else {
              setFeedback('❌ Missed a Match!');
            }
            return nextLives;
          });
        }
      }

      advanceSequence(index + 1);
    }, 2000);
  };

  const handleMatchClick = () => {
    if (gameState !== 'playing' || hasActioned || currentIndex < nValue) return;

    setHasActioned(true);
    const isMatch = sequence[currentIndex] === sequence[currentIndex - nValue];

    if (isMatch) {
      // Correct Match!
      setScore((prev) => prev + 40);
      setFeedback('✔ Match Identified!');
    } else {
      // Wrong Match choice!
      setLives((prev) => {
        const nextLives = prev - 1;
        if (nextLives <= 0) {
          handleGameOver(false);
        } else {
          setFeedback('❌ False Alert! Not a Match');
        }
        return nextLives;
      });
    }
  };

  const handleGameOver = (completedAll: boolean) => {
    setGameState('gameover');
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveCell(null);

    const bonus = completedAll ? 200 : 0;
    const finalScore = score + bonus;
    
    // N-back is extremely hard, so we multiply XP!
    const earnedXp = Math.round(finalScore * 2.0); 
    
    setFeedback(completedAll ? '⭐ Grid Cleared!' : '💔 Synaptic Overload!');
    onGameComplete(finalScore, earnedXp);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <GlassCard glowColor="purple" className="flex flex-col items-center max-w-md mx-auto py-8">
      
      {/* Game State Header */}
      <div className="flex justify-between w-full mb-6 text-sm px-4">
        <div className="flex items-center gap-1.5 text-purple-400 font-bold uppercase tracking-wider">
          <Brain className="w-4 h-4" />
          <span>Spatial {nValue}-Back</span>
        </div>
        <div className="flex items-center gap-1 text-yellow-400 font-bold font-mono">
          <Star className="w-4 h-4 fill-yellow-400" />
          <span>{score} pts</span>
        </div>
        <div className="flex items-center gap-0.5 text-red-500">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart key={i} className={`w-4 h-4 ${i < lives ? 'fill-red-500' : 'text-gray-600'}`} />
          ))}
        </div>
      </div>

      {/* Difficulty Config (Only visible in idle) */}
      {gameState === 'idle' && (
        <div className="w-full px-4 mb-6">
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 text-center font-bold">
            Select Working Memory Span (N)
          </label>
          <div className="flex gap-3 justify-center">
            {[1, 2, 3].map((val) => (
              <button
                key={val}
                onClick={() => setNValue(val)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold font-mono transition-all cursor-pointer ${
                  nValue === val
                    ? 'bg-purple-500/10 border-purple-400 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                    : 'bg-white/2 border-white/5 text-gray-500 hover:border-white/10 hover:text-gray-300'
                }`}
              >
                N = {val} {val === 1 ? '(Normal)' : val === 2 ? '(Hard)' : '(Genius)'}
              </button>
            ))}
          </div>
          
          <div className="mt-6 bg-purple-950/20 border border-purple-500/10 rounded-xl p-3.5 flex gap-2 items-start text-left">
            <HelpCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-purple-300 leading-relaxed font-light">
              <strong>Rules:</strong> Watch the cyan position lights. Press the <strong>Match Position</strong> button if the currently lit square is in the <em>exact same location</em> as the one lit <strong>{nValue} step{nValue > 1 ? 's' : ''} ago</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid Field */}
      <div className="relative w-64 h-64 bg-slate-950/80 p-3 rounded-2xl border border-purple-500/20 overflow-hidden mb-6 flex items-center justify-center">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        
        {/* Countdown overlay */}
        {gameState === 'countdown' && (
          <span className="text-5xl font-black text-purple-400 animate-ping font-mono">
            {countdown}
          </span>
        )}

        {gameState === 'playing' && (
          <div className="grid grid-cols-3 gap-3 w-full h-full relative z-10">
            {Array.from({ length: 9 }).map((_, idx) => {
              const isActive = activeCell === idx;
              return (
                <div
                  key={idx}
                  className={`w-full h-full rounded-xl border transition-all duration-150 ${
                    isActive 
                      ? 'bg-cyan-500 border-cyan-400 shadow-[0_0_18px_#06b6d4]' 
                      : 'bg-white/5 border-white/5'
                  }`}
                />
              );
            })}
          </div>
        )}

        {gameState === 'idle' && (
          <span className="text-xs text-gray-600 uppercase tracking-widest font-mono">Span Grid Offline</span>
        )}

        {gameState === 'gameover' && (
          <div className="text-center z-10 space-y-2">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto animate-bounce" />
            <span className="text-sm font-black uppercase text-red-500 block">Test Aborted</span>
          </div>
        )}
      </div>

      {/* Visual Feedback Message */}
      <div className="h-6 mb-6">
        {feedback && (
          <p className={`text-xs font-semibold uppercase tracking-wider ${
            feedback.includes('❌') ? 'text-red-400 animate-shake' : 'text-emerald-400'
          }`}>
            {feedback}
          </p>
        )}
      </div>

      {/* Play Controls & Actions */}
      {gameState === 'playing' && (
        <button
          onClick={handleMatchClick}
          disabled={currentIndex < nValue || hasActioned}
          className={`w-full max-w-xs font-bold py-4 rounded-xl cursor-pointer active:scale-95 transition-all text-sm uppercase tracking-wider text-center ${
            currentIndex < nValue 
              ? 'bg-gray-800 text-gray-500 border border-white/5 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-purple-400'
          }`}
        >
          {currentIndex < nValue ? `Waiting (${nValue - currentIndex} more)...` : 'Match Position!'}
        </button>
      )}

      {gameState === 'idle' && (
        <GlowButton variant="purple" onClick={startCountdown}>
          Launch Memory Span
        </GlowButton>
      )}

      {gameState === 'gameover' && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-[11px] text-gray-400">Final metrics logged. Earned +{Math.round(score * 2.0)} XP</p>
          <GlowButton variant="outline" className="flex items-center gap-2" onClick={startCountdown}>
            <RotateCcw className="w-4 h-4" />
            Recalibrate Span
          </GlowButton>
        </div>
      )}

    </GlassCard>
  );
}
