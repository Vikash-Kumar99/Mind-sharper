'use client';

import React from 'react';
import Link from 'next/link';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';
import { 
  Brain, 
  Gamepad2, 
  Timer, 
  CheckSquare, 
  LineChart, 
  MessageSquareCode, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-[#030712] overflow-x-hidden cyber-grid text-white flex flex-col items-center">
      
      {/* Decorative Neon Backdrop Blurs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />
      <div className="absolute top-80 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />

      {/* Header Container */}
      <header className="w-full max-w-7xl px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <Brain className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="font-bold text-lg tracking-wider text-white">MIND SHAPER</span>
        </div>
        <Link href="/auth">
          <GlowButton variant="outline" className="text-xs uppercase tracking-wider">
            Access System
          </GlowButton>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-5xl px-6 pt-20 pb-16 flex flex-col items-center text-center z-10">
        
        {/* Futuristic Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/5 text-purple-400 text-xs font-semibold uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
          <Cpu className="w-3.5 h-3.5 animate-spin" />
          Neuroscientific Cognitive Amplifier
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
          SCULPT YOUR <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent neon-text-purple">
            NEURAL PATHWAYS
          </span>
        </h1>

        <p className="text-gray-400 max-w-2xl text-base md:text-lg mb-10 tracking-wide font-light">
          Mind Shaper combines cognitive games, structural daily habits, biometric focus clocks, and an active generative AI productivity coach to unlock your ultimate focus.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link href="/auth">
            <GlowButton variant="purple" className="flex items-center gap-2 px-8 py-3 text-base">
              Activate Mind Shaper
              <ArrowRight className="w-5 h-5" />
            </GlowButton>
          </Link>
          <Link href="/dashboard">
            <GlowButton variant="outline" className="px-8 py-3 text-base">
              Explore Dashboard
            </GlowButton>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl text-left">
          
          <GlassCard glowColor="purple">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-5 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg mb-2">Cognitive Games</h3>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              Play fully-interactive training cycles to reinforce spatial memory recollection, reaction times, and cognitive attention.
            </p>
          </GlassCard>

          <GlassCard glowColor="cyan">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-5 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Timer className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg mb-2">Deep Focus Station</h3>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              Track focused blocks using our Pomodoro dashboard. Block noise out using synthesized browser rain storm ocean wave tracks.
            </p>
          </GlassCard>

          <GlassCard glowColor="emerald">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-5 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <MessageSquareCode className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg mb-2">AI Neural Coach</h3>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              Engage with Dr. Shaper—your personalized advisor. Synthesizes daily habits, focus times, and mood scores.
            </p>
          </GlassCard>

        </div>
      </section>

      {/* Trust Metrics Section */}
      <section className="w-full bg-[#070b14] border-t border-white/5 py-12 px-6 flex flex-wrap justify-around items-center gap-8 mt-12 z-10">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <span className="text-xs text-gray-400 uppercase tracking-widest">
            Level-Up Streak Engine
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span className="text-xs text-gray-400 uppercase tracking-widest">
            Secure Supabase DB Shards
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-emerald-400" />
          <span className="text-xs text-gray-400 uppercase tracking-widest">
            Neuroplasticity Focus Mapped
          </span>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-xs text-gray-600 border-t border-white/5 mt-auto">
        <p>© 2026 Mind Shaper Core Systems. Optimizing humanity, one byte at a time.</p>
      </footer>
    </main>
  );
}
