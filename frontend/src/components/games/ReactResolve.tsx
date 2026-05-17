'use client';

import React, { useState, useEffect, useRef } from 'react';
import GlassCard from '../GlassCard';
import GlowButton from '../GlowButton';
import { Shield, Zap, Sparkles, RotateCcw } from 'lucide-react';

interface ReactResolveProps {
  onGameComplete: (score: number, xp: number) => void;
}

interface TargetCircle {
  id: string;
  x: number; // percentage width
  y: number; // percentage height
  isGreen: boolean;
  size: number;
}

export default function ReactResolve({ onGameComplete }: ReactResolveProps) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [targets, setTargets] = useState<TargetCircle[]>([]);
  const [score, setScore] = useState(0);
  const [roundsLogged, setRoundsLogged] = useState(0);
  const [streak, setStreak] = useState(0);
  const maxRounds = 15;

  const targetTimerRef = useRef<any>(null);

  const spawnTarget = () => {
    setRoundsLogged((prev) => {
      if (prev >= maxRounds) {
        setGameState('gameover');
        if (targetTimerRef.current) clearInterval(targetTimerRef.current);
        setTargets([]);
        
        const earnedXp = Math.round(score * 1.5);
        onGameComplete(score, earnedXp);
        return prev;
      }

      // Generate a new target
      const isGreen = Math.random() > 0.3; // 70% chance of green (good), 30% red (distraction)
      const size = 30 + Math.random() * 20; // 30px to 50px size
      
      // Random coordinates inside the bounding box (avoiding borders)
      const x = 10 + Math.random() * 80; 
      const y = 10 + Math.random() * 80;

      const newTarget: TargetCircle = {
        id: Math.random().toString(36).substr(2, 9),
        x,
        y,
        isGreen,
        size
      };

      setTargets([newTarget]);
      return prev + 1;
    });
  };

  const handleTargetClick = (target: TargetCircle) => {
    if (gameState !== 'playing') return;

    if (target.isGreen) {
      // Good tap!
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Streak multipliers
      const points = 20 + (newStreak * 5);
      setScore(prev => prev + points);
    } else {
      // Bad tap (Red distraction)!
      setStreak(0);
      setScore(prev => Math.max(0, prev - 25));
    }
    
    // Clear targets immediately and spawn next
    setTargets([]);
    spawnTarget();
  };

  // If green target is missed (not clicked within 1.5s), clear it and spawn next
  useEffect(() => {
    if (gameState === 'playing' && targets.length > 0) {
      const missedTimer = setTimeout(() => {
        if (targets[0]?.isGreen) {
          // Missed a green, break combo
          setStreak(0);
        }
        setTargets([]);
        spawnTarget();
      }, 1500); // 1.5s window to click

      return () => clearTimeout(missedTimer);
    }
  }, [targets, gameState]);

  const startGame = () => {
    setScore(0);
    setRoundsLogged(0);
    setStreak(0);
    setGameState('playing');
    // Start initial spawn
    setTimeout(() => {
      spawnTarget();
    }, 500);
  };

  return (
    <GlassCard glowColor="emerald" className="flex flex-col items-center max-w-md mx-auto py-8">
      <div className="flex justify-between w-full mb-6 text-sm px-4">
        <div className="flex items-center gap-1 text-emerald-400 font-bold">
          <Shield className="w-4 h-4" />
          <span>Reflex Scanner</span>
        </div>
        <div className="flex items-center gap-1.5 text-yellow-400 font-bold">
          <Zap className="w-4 h-4 fill-yellow-400" />
          <span>{score} pts</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 font-bold">
          <Sparkles className="w-4 h-4" />
          <span>Combo x{streak}</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="text-xs text-gray-400">
          Tap <span className="text-emerald-400 font-bold">Green Radar Elements</span> instantly. Avoid <span className="text-red-500 font-bold">Red Targets</span>!
        </p>
      </div>

      {/* Spawning Field */}
      <div className="relative w-72 h-72 bg-slate-950/80 p-2 rounded-2xl border border-emerald-500/20 overflow-hidden shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] mb-8">
        
        {/* Futuristic Grid Radar Line */}
        <div className="absolute inset-0 cyber-grid opacity-30" />
        
        {gameState === 'playing' && targets.map((target) => (
          <button
            key={target.id}
            onClick={() => handleTargetClick(target)}
            style={{
              left: `${target.x}%`,
              top: `${target.y}%`,
              width: `${target.size}px`,
              height: `${target.size}px`,
            }}
            className={`absolute rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center animate-ping duration-1000 border-2 active:scale-95 transition-all ${
              target.isGreen 
                ? 'bg-emerald-500/60 border-emerald-400 shadow-[0_0_15px_#10b981]' 
                : 'bg-red-500/60 border-red-400 shadow-[0_0_15px_#ef4444]'
            }`}
          />
        ))}

        {gameState === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-gray-500 uppercase tracking-widest animate-pulse">Radar Offline</span>
          </div>
        )}
      </div>

      {gameState === 'idle' && (
        <GlowButton variant="emerald" onClick={startGame}>
          Activate Radar
        </GlowButton>
      )}

      {gameState === 'gameover' && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm font-bold text-emerald-400">Scan Complete!</p>
          <p className="text-xs text-gray-400">Final score submitted! Earned +{Math.round(score * 1.5)} XP</p>
          <GlowButton variant="outline" className="flex items-center gap-2" onClick={startGame}>
            <RotateCcw className="w-4 h-4" />
            Recalibrate
          </GlowButton>
        </div>
      )}
    </GlassCard>
  );
}
