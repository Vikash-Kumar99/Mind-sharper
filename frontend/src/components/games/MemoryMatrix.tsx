'use client';

import React, { useState, useEffect } from 'react';
import GlassCard from '../GlassCard';
import GlowButton from '../GlowButton';
import { Brain, Star, Heart, RotateCcw } from 'lucide-react';

interface MemoryMatrixProps {
  onGameComplete: (score: number, xp: number) => void;
}

export default function MemoryMatrix({ onGameComplete }: MemoryMatrixProps) {
  const [gridSize] = useState(16); // 4x4 grid
  const [level, setLevel] = useState(1);
  const [flashCells, setFlashCells] = useState<number[]>([]);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'flashing' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState<string>('');

  const generateFlashSequence = (currentLevel: number) => {
    setGameState('flashing');
    setSelectedCells([]);
    setFeedback('Memorize the pattern...');

    // Flash amount increases with level (Level 1: 3 cells, Level 2: 4, etc.)
    const count = 2 + currentLevel;
    const sequence: number[] = [];

    while (sequence.length < count) {
      const idx = Math.floor(Math.random() * gridSize);
      if (!sequence.includes(idx)) {
        sequence.push(idx);
      }
    }

    setFlashCells(sequence);

    // Hide sequence after delay
    setTimeout(() => {
      setGameState('playing');
      setFeedback('Select the cells!');
    }, 1200 + (currentLevel * 100)); // slightly longer for higher levels
  };

  const handleCellClick = (index: number) => {
    if (gameState !== 'playing') return;

    // Ignore if already selected
    if (selectedCells.includes(index)) return;

    if (flashCells.includes(index)) {
      // Correct click
      const newSelected = [...selectedCells, index];
      setSelectedCells(newSelected);
      setScore(prev => prev + 10);

      // Check if level is complete
      if (newSelected.length === flashCells.length) {
        setFeedback('✔ Pattern Cleared!');
        setScore(prev => prev + 100);
        setTimeout(() => {
          setLevel(prev => prev + 1);
          generateFlashSequence(level + 1);
        }, 1000);
      }
    } else {
      // Incorrect click
      const newLives = lives - 1;
      setLives(newLives);
      setFeedback('❌ Missed one!');
      
      if (newLives === 0) {
        setGameState('gameover');
        setFeedback('Game Over!');
        
        // Log final score & yield XP
        const earnedXp = Math.round(score * 1.5);
        onGameComplete(score, earnedXp);
      }
    }
  };

  const startGame = () => {
    setLevel(1);
    setScore(0);
    setLives(3);
    generateFlashSequence(1);
  };

  return (
    <GlassCard glowColor="purple" className="flex flex-col items-center max-w-md mx-auto py-8">
      <div className="flex justify-between w-full mb-6 text-sm px-4">
        <div className="flex items-center gap-1.5 text-purple-400">
          <Brain className="w-4 h-4" />
          <span className="font-bold">Level {level}</span>
        </div>
        <div className="flex items-center gap-1 text-yellow-400 font-bold">
          <Star className="w-4 h-4 fill-yellow-400" />
          <span>{score} pts</span>
        </div>
        <div className="flex items-center gap-0.5 text-red-500">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart key={i} className={`w-4 h-4 ${i < lives ? 'fill-red-500' : 'text-gray-600'}`} />
          ))}
        </div>
      </div>

      <div className="text-center mb-6 h-6">
        <p className={`text-sm font-semibold tracking-wide uppercase ${
          gameState === 'flashing' ? 'text-cyan-400 animate-pulse' :
          feedback.includes('❌') ? 'text-red-400' :
          feedback.includes('✔') ? 'text-emerald-400' : 'text-gray-300'
        }`}>
          {feedback || 'Ready to test your memory matrix?'}
        </p>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-4 gap-3 w-72 h-72 mb-8 bg-black/40 p-3 rounded-2xl border border-white/5">
        {Array.from({ length: gridSize }).map((_, idx) => {
          const isFlashed = gameState === 'flashing' && flashCells.includes(idx);
          const isSelected = selectedCells.includes(idx);
          const isIncorrect = gameState === 'playing' && selectedCells.includes(idx) === false && flashCells.includes(idx) === false;

          let cellColor = 'bg-white/5 hover:bg-white/10 border-white/5';
          if (isFlashed) {
            cellColor = 'bg-purple-500 border-purple-400 shadow-[0_0_15px_#a855f7]';
          } else if (isSelected) {
            cellColor = 'bg-purple-600/80 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.4)]';
          }

          return (
            <button
              key={idx}
              onClick={() => handleCellClick(idx)}
              disabled={gameState !== 'playing'}
              className={`w-full h-full rounded-xl border transition-all duration-200 cursor-pointer ${cellColor}`}
            />
          );
        })}
      </div>

      {gameState === 'idle' && (
        <GlowButton variant="purple" onClick={startGame}>
          Activate Matrix
        </GlowButton>
      )}

      {gameState === 'gameover' && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-xs text-gray-400">Final score submitted! Earned +{Math.round(score * 1.5)} XP</p>
          <GlowButton variant="outline" className="flex items-center gap-2" onClick={startGame}>
            <RotateCcw className="w-4 h-4" />
            Play Again
          </GlowButton>
        </div>
      )}
    </GlassCard>
  );
}
