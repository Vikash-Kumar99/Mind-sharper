'use client';

import React, { useState } from 'react';
import GlassCard from '../GlassCard';
import GlowButton from '../GlowButton';
import { Star, RotateCcw, AlertTriangle } from 'lucide-react';

interface CrossmathProps {
  onGameComplete: (score: number, xp: number) => void;
}

export default function Crossmath({ onGameComplete }: CrossmathProps) {
  // Solutions: A=6, B=3, C=4, D=2
  const [valA, setValA] = useState<string>('');
  const [valB, setValB] = useState<string>('');
  const [valC, setValC] = useState<string>('');
  const [valD, setValD] = useState<string>('');

  const [gameState, setGameState] = useState<'playing' | 'completed'>('playing');
  const [feedback, setFeedback] = useState('Enter digits 1-9 to solve all formulas!');

  const handleVerify = () => {
    const a = parseInt(valA);
    const b = parseInt(valB);
    const c = parseInt(valC);
    const d = parseInt(valD);

    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) {
      setFeedback('❌ Error: All fields must be filled with numbers!');
      return;
    }

    // Evaluate equations:
    const eqRow1 = a * b === 18;
    const eqRow2 = c - d === 2;
    const eqCol1 = a - c === 2;
    const eqCol2 = b + d === 5;

    if (eqRow1 && eqRow2 && eqCol1 && eqCol2) {
      setGameState('completed');
      setFeedback('✔ Congratulations! Equations resolved successfully.');
      onGameComplete(250, 375); // Award points + XP
    } else {
      setFeedback('❌ Error: Formula values do not match constraints!');
    }
  };

  const resetGame = () => {
    setValA('');
    setValB('');
    setValC('');
    setValD('');
    setGameState('playing');
    setFeedback('Enter digits 1-9 to solve all formulas!');
  };

  return (
    <GlassCard glowColor="emerald" className="flex flex-col items-center max-w-md mx-auto py-8">
      <div className="flex justify-between w-full mb-6 text-sm px-4">
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider font-mono">
          <span>Crossmath Grid</span>
        </div>
        <div className="flex items-center gap-1 text-yellow-400 font-bold">
          <Star className="w-4 h-4 fill-yellow-400" />
          <span>250 pts potential</span>
        </div>
      </div>

      <div className="text-center mb-6 h-10 px-4">
        <p className={`text-xs font-semibold tracking-wide uppercase ${
          feedback.includes('❌') ? 'text-red-400 animate-shake' :
          feedback.includes('✔') ? 'text-emerald-400 animate-pulse' : 'text-gray-300'
        }`}>
          {feedback}
        </p>
      </div>

      {/* Crossmath Grid Visual */}
      <div className="bg-slate-950/80 p-6 rounded-2xl border border-emerald-500/20 w-72 mb-8 font-mono">
        <div className="grid grid-cols-3 items-center gap-2 text-center text-sm font-bold">
          
          {/* Row 1 */}
          <input
            type="text"
            maxLength={1}
            value={valA}
            disabled={gameState !== 'playing'}
            onChange={(e) => setValA(e.target.value.replace(/[^1-9]/g, ''))}
            className="w-full text-center bg-black/50 border border-emerald-500/30 text-emerald-400 font-bold text-lg py-2.5 rounded-xl outline-none focus:border-emerald-400 focus:shadow-[0_0_8px_#10b981]"
            placeholder="A"
          />
          <span className="text-gray-400 text-lg">×</span>
          <input
            type="text"
            maxLength={1}
            value={valB}
            disabled={gameState !== 'playing'}
            onChange={(e) => setValB(e.target.value.replace(/[^1-9]/g, ''))}
            className="w-full text-center bg-black/50 border border-emerald-500/30 text-emerald-400 font-bold text-lg py-2.5 rounded-xl outline-none focus:border-emerald-400 focus:shadow-[0_0_8px_#10b981]"
            placeholder="B"
          />

          {/* Row 1 Output Sign */}
          <span className="text-gray-500">=</span>
          <span className="text-gray-500"></span>
          <span className="text-white text-lg font-black">18</span>

          {/* Col Operators */}
          <span className="text-gray-400 text-lg py-2">−</span>
          <span></span>
          <span className="text-gray-400 text-lg py-2">+</span>

          <span className="col-span-3 h-0.5 bg-emerald-500/10 my-1"></span>

          {/* Row 2 */}
          <input
            type="text"
            maxLength={1}
            value={valC}
            disabled={gameState !== 'playing'}
            onChange={(e) => setValC(e.target.value.replace(/[^1-9]/g, ''))}
            className="w-full text-center bg-black/50 border border-emerald-500/30 text-emerald-400 font-bold text-lg py-2.5 rounded-xl outline-none focus:border-emerald-400 focus:shadow-[0_0_8px_#10b981]"
            placeholder="C"
          />
          <span className="text-gray-400 text-lg">−</span>
          <input
            type="text"
            maxLength={1}
            value={valD}
            disabled={gameState !== 'playing'}
            onChange={(e) => setValD(e.target.value.replace(/[^1-9]/g, ''))}
            className="w-full text-center bg-black/50 border border-emerald-500/30 text-emerald-400 font-bold text-lg py-2.5 rounded-xl outline-none focus:border-emerald-400 focus:shadow-[0_0_8px_#10b981]"
            placeholder="D"
          />

          {/* Row 2 Output Sign */}
          <span className="text-gray-500">=</span>
          <span></span>
          <span className="text-white text-lg font-black">2</span>

          {/* Vertical Outputs */}
          <span className="col-span-3 h-0.5 bg-emerald-500/10 my-1"></span>

          <span className="text-gray-500">=</span>
          <span></span>
          <span className="text-gray-500">=</span>

          <span className="text-white text-lg font-black">2</span>
          <span></span>
          <span className="text-white text-lg font-black">5</span>

        </div>
      </div>

      <div className="flex gap-4">
        {gameState === 'playing' ? (
          <GlowButton variant="emerald" onClick={handleVerify}>
            Solve Equations
          </GlowButton>
        ) : (
          <GlowButton variant="outline" className="flex items-center gap-1.5" onClick={resetGame}>
            <RotateCcw className="w-4 h-4" />
            Restart Grid
          </GlowButton>
        )}
      </div>
    </GlassCard>
  );
}
