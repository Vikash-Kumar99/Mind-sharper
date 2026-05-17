'use client';

import React, { useState, useEffect, useRef } from 'react';
import GlassCard from '../GlassCard';
import GlowButton from '../GlowButton';
import { Target, Zap, Clock, RotateCcw } from 'lucide-react';

interface FocusFocusProps {
  onGameComplete: (score: number, xp: number) => void;
}

const COLOR_NAMES = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE'];
const COLOR_VALUES = [
  'text-red-500', 
  'text-blue-500', 
  'text-green-500', 
  'text-yellow-500', 
  'text-purple-500'
];

export default function FocusFocus({ onGameComplete }: FocusFocusProps) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [currentWord, setCurrentWord] = useState('');
  const [currentInkColorIdx, setCurrentInkColorIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [feedback, setFeedback] = useState('');

  const timerRef = useRef<any>(null);

  const getInkColorName = (index: number) => COLOR_NAMES[index];

  const generateNextRound = () => {
    // Generate a random word name
    const wordIdx = Math.floor(Math.random() * COLOR_NAMES.length);
    // 50% chance of being congruent (matching ink color)
    const matches = Math.random() > 0.5;
    let inkIdx = wordIdx;
    
    if (!matches) {
      // Find a different index
      while (inkIdx === wordIdx) {
        inkIdx = Math.floor(Math.random() * COLOR_NAMES.length);
      }
    }

    setCurrentWord(COLOR_NAMES[wordIdx]);
    setCurrentInkColorIdx(inkIdx);
    setFeedback('');
  };

  const handleChoice = (doesMatch: boolean) => {
    if (gameState !== 'playing') return;

    const actualMatch = currentWord === getInkColorName(currentInkColorIdx);

    if (doesMatch === actualMatch) {
      // Correct!
      setScore(prev => prev + 15);
      setFeedback('✔ Quick Reflex!');
      // Give a tiny time bonus
      setTimeLeft(prev => Math.min(20, prev + 1));
    } else {
      // Wrong!
      setFeedback('❌ Distracted!');
      // Deduct 2 seconds
      setTimeLeft(prev => Math.max(0, prev - 2));
    }
    generateNextRound();
  };

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setGameState('gameover');
            
            const earnedXp = Math.round(score * 1.5);
            onGameComplete(score, earnedXp);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(15);
    setGameState('playing');
    generateNextRound();
  };

  return (
    <GlassCard glowColor="cyan" className="flex flex-col items-center max-w-md mx-auto py-8">
      <div className="flex justify-between w-full mb-6 text-sm px-4">
        <div className="flex items-center gap-1 text-cyan-400 font-bold">
          <Target className="w-4 h-4" />
          <span>Speed Match</span>
        </div>
        <div className="flex items-center gap-1.5 text-yellow-400 font-bold">
          <Zap className="w-4 h-4 fill-yellow-400" />
          <span>{score} pts</span>
        </div>
        <div className="flex items-center gap-1 text-cyan-400 font-bold">
          <Clock className="w-4 h-4" />
          <span className={timeLeft < 5 ? 'text-red-500 animate-ping' : ''}>{timeLeft}s</span>
        </div>
      </div>

      <div className="text-center h-28 flex flex-col items-center justify-center mb-6">
        {gameState === 'playing' ? (
          <div>
            <h2 className={`text-5xl font-black tracking-widest uppercase transition-all duration-150 ${COLOR_VALUES[currentInkColorIdx]}`}>
              {currentWord}
            </h2>
            <p className="text-xs text-gray-500 mt-3 uppercase tracking-wider">Ink color matches the word?</p>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">
            Does the text match its visual ink color? Speed counts.
          </p>
        )}
      </div>

      {feedback && (
        <p className={`text-xs font-semibold mb-4 uppercase ${feedback.includes('❌') ? 'text-red-400' : 'text-emerald-400'}`}>
          {feedback}
        </p>
      )}

      {/* Control Buttons */}
      {gameState === 'playing' && (
        <div className="flex gap-4 w-full px-4 mb-8">
          <button
            onClick={() => handleChoice(true)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl cursor-pointer active:scale-95 transition-all text-sm uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            Match
          </button>
          <button
            onClick={() => handleChoice(false)}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-2xl cursor-pointer active:scale-95 transition-all text-sm uppercase tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.3)]"
          >
            No Match
          </button>
        </div>
      )}

      {gameState === 'idle' && (
        <GlowButton variant="cyan" onClick={startGame}>
          Arouse Focus
        </GlowButton>
      )}

      {gameState === 'gameover' && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm font-bold text-red-400">Time Exceeded!</p>
          <p className="text-xs text-gray-400">Final score submitted! Earned +{Math.round(score * 1.5)} XP</p>
          <GlowButton variant="outline" className="flex items-center gap-2" onClick={startGame}>
            <RotateCcw className="w-4 h-4" />
            Try Again
          </GlowButton>
        </div>
      )}
    </GlassCard>
  );
}
