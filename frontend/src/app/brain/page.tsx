'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import GlassCard from '../../components/GlassCard';
import MemoryMatrix from '../../components/games/MemoryMatrix';
import FocusFocus from '../../components/games/FocusFocus';
import ReactResolve from '../../components/games/ReactResolve';
import GridNBack from '../../components/games/GridNBack';
import TangoGame from '../../components/games/TangoGame';
import ArrowPuzzle from '../../components/games/ArrowPuzzle';
import TrickyPuzzle from '../../components/games/TrickyPuzzle';
import Crossmath from '../../components/games/Crossmath';
import ChessTactics from '../../components/games/ChessTactics';
import { Brain, Gamepad2, Target, ShieldAlert, Sparkles, LayoutGrid, Grid, Shuffle, HelpCircle, Binary, Swords } from 'lucide-react';

type GameKey = 'none' | 'matrix' | 'stroop' | 'reflex' | 'nback' | 'tango' | 'arrow' | 'tricky' | 'crossmath' | 'chess';

export default function BrainTrainingPage() {
  const [selectedGame, setSelectedGame] = useState<GameKey>('none');
  const [feedback, setFeedback] = useState<{ score: number; xp: number; show: boolean } | null>(null);

  const handleGameComplete = async (score: number, xp: number) => {
    // 1. Show immediate visual feedback toast
    setFeedback({ score, xp, show: true });
    
    // Auto-hide feedback after 4 seconds
    setTimeout(() => {
      setFeedback(null);
    }, 4500);

    // 2. Upload score to the Express backend
    try {
      const token = localStorage.getItem('sb-access-token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      let gameKey = 'memory';
      if (selectedGame === 'stroop') gameKey = 'focus';
      if (selectedGame === 'reflex') gameKey = 'reflex';
      if (selectedGame === 'nback') gameKey = 'memory';
      if (selectedGame === 'tango') gameKey = 'memory';
      if (selectedGame === 'arrow') gameKey = 'focus';
      if (selectedGame === 'tricky') gameKey = 'focus';
      if (selectedGame === 'crossmath') gameKey = 'focus';
      if (selectedGame === 'chess') gameKey = 'reflex'; // chess puzzle reactions

      await fetch('http://localhost:5000/api/exercises/log', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          game_type: gameKey,
          score
        })
      });
    } catch (e) {
      console.warn('Failed to upload game score to backend, using local sandbox state:', e);
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] text-white pt-24 pb-16 px-4 md:px-8 cyber-grid flex flex-col items-center">
      <Navbar />

      {/* Decorative Glow Spheres - High Performance GPU Gradient version */}
      <div className="absolute top-10 right-1/4 w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(168,85,247,0.12)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-20 left-1/4 w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(16,185,129,0.12)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-6xl z-10 space-y-8">
        
        {/* Page Title */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Gamepad2 className="w-3.5 h-3.5" />
            Neural Gym Workstation
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase">Cognitive Gym</h1>
          <p className="text-sm text-gray-400 font-light max-w-xl mx-auto">
            Stimulate your neuroplasticity by playing targeted attention, spatial memory recall, and reaction coordination exercises.
          </p>
        </div>

        {/* Level Up Feedback Alert Popup */}
        {feedback?.show && (
          <div className="fixed bottom-6 right-6 z-50 animate-bounce">
            <GlassCard glowColor="purple" className="flex items-center gap-4 py-4 px-6 border-purple-500/40 bg-black/90">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Exercise Saved!</p>
                <p className="text-sm font-bold text-white">Score: {feedback.score} pts | <span className="text-purple-400">+{feedback.xp} XP</span></p>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Selection Area / Active Game Renderer */}
        {selectedGame === 'none' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Game 1 Card */}
            <GlassCard 
              glowColor="purple" 
              onClick={() => setSelectedGame('matrix')}
              className="flex flex-col items-center text-center p-6 hover:scale-[1.02] h-full cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <Brain className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="font-bold text-base mb-2 uppercase tracking-wide">Memory Matrix</h3>
              <p className="text-[11px] text-gray-400 font-light leading-relaxed mb-6">
                Recall expanding flashed coordinate grids. Escalates visual memory recall and retention.
              </p>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest mt-auto">Activate</span>
            </GlassCard>

            {/* Game 2 Card */}
            <GlassCard 
              glowColor="cyan" 
              onClick={() => setSelectedGame('stroop')}
              className="flex flex-col items-center text-center p-6 hover:scale-[1.02] h-full cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base mb-2 uppercase tracking-wide">Focus Focus</h3>
              <p className="text-[11px] text-gray-400 font-light leading-relaxed mb-6">
                Strengthen selective filters using ink-word matches. Maximizes verbal logic speeds.
              </p>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest mt-auto">Activate</span>
            </GlassCard>

            {/* Game 3 Card */}
            <GlassCard 
              glowColor="emerald" 
              onClick={() => setSelectedGame('reflex')}
              className="flex flex-col items-center text-center p-6 hover:scale-[1.02] h-full cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base mb-2 uppercase tracking-wide">React & Resolve</h3>
              <p className="text-[11px] text-gray-400 font-light leading-relaxed mb-6">
                Tap glowing green coordinate alerts instantly. Optimizes selective response coordination.
              </p>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest mt-auto">Activate</span>
            </GlassCard>

            {/* Game 4 Card (Grid N-Back) */}
            <GlassCard 
              glowColor="purple" 
              onClick={() => setSelectedGame('nback')}
              className="flex flex-col items-center text-center p-6 border-purple-500/30 hover:scale-[1.02] h-full cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-400/35 flex items-center justify-center text-purple-300 mb-5 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <LayoutGrid className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="font-bold text-base mb-2 uppercase tracking-wide text-purple-300">Grid N-Back</h3>
              <p className="text-[11px] text-purple-200/60 font-light leading-relaxed mb-6">
                Match flashing spatial positions to 2 or 3 steps ago. Ultimate fluid working memory builder.
              </p>
              <span className="text-xs font-bold text-purple-300 uppercase tracking-widest mt-auto">Activate</span>
            </GlassCard>

            {/* Game 5 Card (Tango Game) */}
            <GlassCard 
              glowColor="cyan" 
              onClick={() => setSelectedGame('tango')}
              className="flex flex-col items-center text-center p-6 border-cyan-500/30 hover:scale-[1.02] h-full cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-400/35 flex items-center justify-center text-cyan-300 mb-5 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Grid className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base mb-2 uppercase tracking-wide text-cyan-300">Tango Grid</h3>
              <p className="text-[11px] text-cyan-200/60 font-light leading-relaxed mb-6">
                Solve a 4x4 binary sudoku grid. Maintain equal ratio constraints and prevent double adjacent blocks.
              </p>
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest mt-auto">Activate</span>
            </GlassCard>

            {/* Game 6 Card (Arrow Puzzle) */}
            <GlassCard 
              glowColor="purple" 
              onClick={() => setSelectedGame('arrow')}
              className="flex flex-col items-center text-center p-6 border-purple-500/30 hover:scale-[1.02] h-full cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-400/35 flex items-center justify-center text-purple-300 mb-5 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <Shuffle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base mb-2 uppercase tracking-wide text-purple-300">Arrow Puzzle</h3>
              <p className="text-[11px] text-purple-200/60 font-light leading-relaxed mb-6">
                Tap the exact direction of only the central arrow, resolving conflict with conflicting flankers.
              </p>
              <span className="text-xs font-bold text-purple-300 uppercase tracking-widest mt-auto">Activate</span>
            </GlassCard>

            {/* Game 7 Card (Tricky Puzzle) */}
            <GlassCard 
              glowColor="purple" 
              onClick={() => setSelectedGame('tricky')}
              className="flex flex-col items-center text-center p-6 border-purple-500/30 hover:scale-[1.02] h-full cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-400/35 flex items-center justify-center text-purple-300 mb-5 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base mb-2 uppercase tracking-wide text-purple-300">Tricky Puzzle</h3>
              <p className="text-[11px] text-purple-200/60 font-light leading-relaxed mb-6">
                Brain test tricky lateral puzzles. Standard heuristics fail; think outside the grid to unlock paths.
              </p>
              <span className="text-xs font-bold text-purple-300 uppercase tracking-widest mt-auto">Activate</span>
            </GlassCard>

            {/* Game 8 Card (Crossmath) */}
            <GlassCard 
              glowColor="emerald" 
              onClick={() => setSelectedGame('crossmath')}
              className="flex flex-col items-center text-center p-6 border-emerald-500/30 hover:scale-[1.02] h-full cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-400/35 flex items-center justify-center text-emerald-300 mb-5 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Binary className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base mb-2 uppercase tracking-wide text-emerald-300">Crossmath</h3>
              <p className="text-[11px] text-emerald-200/60 font-light leading-relaxed mb-6">
                Fill a grid of intersecting equations with digits 1-9 to balance arithmetic equations.
              </p>
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest mt-auto">Activate</span>
            </GlassCard>

            {/* Game 9 Card (Chess Tactics) */}
            <GlassCard 
              glowColor="purple" 
              onClick={() => setSelectedGame('chess')}
              className="flex flex-col items-center text-center p-6 border-purple-500/30 hover:scale-[1.02] h-full cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-400/35 flex items-center justify-center text-purple-300 mb-5 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <Swords className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base mb-2 uppercase tracking-wide text-purple-300">Chess Arena</h3>
              <p className="text-[11px] text-purple-200/60 font-light leading-relaxed mb-6">
                White to Move: Deliver a flawless checkmate in 1 on a mini board layout. Enhances strategic projection.
              </p>
              <span className="text-xs font-bold text-purple-300 uppercase tracking-widest mt-auto">Activate</span>
            </GlassCard>

          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Back to games list controls */}
            <button
              onClick={() => setSelectedGame('none')}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-widest flex items-center gap-1.5 cursor-pointer"
            >
              ← Terminate Workout Session / Back to Locker
            </button>

            {/* Render selected active game */}
            {selectedGame === 'matrix' && <MemoryMatrix onGameComplete={handleGameComplete} />}
            {selectedGame === 'stroop' && <FocusFocus onGameComplete={handleGameComplete} />}
            {selectedGame === 'reflex' && <ReactResolve onGameComplete={handleGameComplete} />}
            {selectedGame === 'nback' && <GridNBack onGameComplete={handleGameComplete} />}
            {selectedGame === 'tango' && <TangoGame onGameComplete={handleGameComplete} />}
            {selectedGame === 'arrow' && <ArrowPuzzle onGameComplete={handleGameComplete} />}
            {selectedGame === 'tricky' && <TrickyPuzzle onGameComplete={handleGameComplete} />}
            {selectedGame === 'crossmath' && <Crossmath onGameComplete={handleGameComplete} />}
            {selectedGame === 'chess' && <ChessTactics onGameComplete={handleGameComplete} />}

          </div>
        )}

      </div>
    </main>
  );
}
