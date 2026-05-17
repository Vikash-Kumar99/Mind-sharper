'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import GlassCard from '../../components/GlassCard';
import GlowButton from '../../components/GlowButton';
import { useAudio, SoundType } from '../../hooks/useAudio';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Music, 
  Sparkles, 
  CheckCircle,
  CloudRain,
  Waves,
  Activity
} from 'lucide-react';

export default function FocusModePage() {
  const [sessionLength, setSessionLength] = useState(25 * 60); // 25 min default
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [sessionType, setSessionType] = useState<'study' | 'deep' | 'rest'>('study');
  const [completionState, setCompletionState] = useState(false);

  const { isPlaying, soundType, volume, setVolume, startSound, stopSound } = useAudio();
  const timerIntervalRef = useRef<any>(null);

  // Set session length preset
  const selectPreset = (type: 'study' | 'deep' | 'rest') => {
    setTimerRunning(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    
    setSessionType(type);
    let minutes = 25;
    if (type === 'deep') minutes = 50;
    if (type === 'rest') minutes = 5;

    const seconds = minutes * 60;
    setSessionLength(seconds);
    setTimeLeft(seconds);
    setCompletionState(false);
  };

  const handleStartPause = () => {
    if (timerRunning) {
      // Pause
      setTimerRunning(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    } else {
      // Start
      setTimerRunning(true);
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleSessionComplete = async () => {
    setTimerRunning(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setCompletionState(true);

    const studyMinutes = Math.round(sessionLength / 60);

    // Save session logs to database to award XP
    try {
      const token = localStorage.getItem('sb-access-token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch('http://localhost:5000/api/exercises/log', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          game_type: 'focus', // Records under focus
          score: studyMinutes // Pass duration as base metric
        })
      });
    } catch (e) {
      console.warn('Backend off, session saved locally in sandbox mode.');
    }
  };

  const handleReset = () => {
    setTimerRunning(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setTimeLeft(sessionLength);
    setCompletionState(false);
  };

  // Convert seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // SVG circular properties
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const progressPercentage = (timeLeft / sessionLength);
  const strokeDashoffset = circumference * (1 - progressPercentage);

  return (
    <main className="min-h-screen bg-[#030712] text-white pt-24 pb-16 px-4 md:px-8 cyber-grid flex flex-col items-center">
      <Navbar />

      <div className="absolute top-20 left-1/3 w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-4xl z-10 grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Side: Circular Pomodoro Clock Panel (3/5 Grid Width) */}
        <div className="lg:col-span-3 flex flex-col items-center space-y-6">
          <GlassCard glowColor={sessionType === 'rest' ? 'emerald' : 'cyan'} className="w-full max-w-md p-8 flex flex-col items-center">
            
            {/* Presets Selection */}
            <div className="flex gap-2 w-full mb-8 bg-black/30 p-1 rounded-xl border border-white/5">
              <button 
                onClick={() => selectPreset('study')}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-all ${
                  sessionType === 'study' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:text-white'
                }`}
              >
                25m study
              </button>
              <button 
                onClick={() => selectPreset('deep')}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-all ${
                  sessionType === 'deep' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]' : 'text-gray-400 hover:text-white'
                }`}
              >
                50m deep
              </button>
              <button 
                onClick={() => selectPreset('rest')}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-all ${
                  sessionType === 'rest' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-gray-400 hover:text-white'
                }`}
              >
                5m rest
              </button>
            </div>

            {/* Circular Timer Visual Representation */}
            <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle 
                  cx="128" 
                  cy="128" 
                  r={radius} 
                  className="stroke-white/5 fill-transparent"
                  strokeWidth="8"
                />
                {/* Countdown Progress Ring */}
                <circle 
                  cx="128" 
                  cy="128" 
                  r={radius} 
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: strokeDashoffset
                  }}
                  className={`fill-transparent transition-all duration-300 ${
                    sessionType === 'rest' 
                      ? 'stroke-emerald-500 shadow-[0_0_15px_#10b981]' 
                      : 'stroke-cyan-500 shadow-[0_0_15px_#06b6d4]'
                  }`}
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Central Time Indicators */}
              <div className="absolute text-center select-none">
                <span className="text-4xl md:text-5xl font-black tracking-widest block font-mono">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mt-1 block">
                  {sessionType === 'rest' ? 'Minding Rest' : 'Neuro-deep focus'}
                </span>
              </div>
            </div>

            {/* Actions button */}
            <div className="flex gap-4 w-full">
              <GlowButton 
                variant={sessionType === 'rest' ? 'emerald' : 'cyan'}
                onClick={handleStartPause}
                className="flex-1 flex items-center justify-center gap-2 py-3.5"
              >
                {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {timerRunning ? 'PAUSE SECTOR' : 'ENGAGE FOCUS'}
              </GlowButton>
              <GlowButton 
                variant="outline"
                onClick={handleReset}
                className="p-3.5"
              >
                <RotateCcw className="w-4 h-4" />
              </GlowButton>
            </div>

            {/* Completion Alert */}
            {completionState && (
              <div className="mt-6 w-full p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 flex items-center gap-3 justify-center animate-pulse">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <div className="text-left text-xs">
                  <p className="font-bold uppercase tracking-wider">Session complete!</p>
                  <p className="font-light text-emerald-300">Logged +{Math.round(sessionLength / 60) * 1.5} XP successfully.</p>
                </div>
              </div>
            )}

          </GlassCard>
        </div>

        {/* Right Side: Web Audio Noise Waves Panel (2/5 Grid Width) */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard glowColor="purple" className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
              <Music className="w-5 h-5 text-purple-400" />
              <h2 className="font-bold text-base uppercase tracking-wider">Ambient Synth</h2>
            </div>
            
            <p className="text-xs text-gray-500 leading-relaxed mb-6 font-light">
              Synthesize offline relaxation white noise directly using browser audio filters. Eliminates downloads, locks out distractions.
            </p>

            {/* Audio Presets */}
            <div className="space-y-3">
              <button
                onClick={() => startSound('rain')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                  soundType === 'rain' 
                    ? 'bg-purple-500/10 border-purple-500/30 text-purple-200' 
                    : 'bg-white/3 border-white/5 text-gray-400 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CloudRain className="w-4 h-4" />
                  <span className="text-sm font-semibold tracking-wide uppercase">Rain Tempest</span>
                </div>
                {soundType === 'rain' && <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />}
              </button>

              <button
                onClick={() => startSound('ocean')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                  soundType === 'ocean' 
                    ? 'bg-purple-500/10 border-purple-500/30 text-purple-200' 
                    : 'bg-white/3 border-white/5 text-gray-400 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Waves className="w-4 h-4" />
                  <span className="text-sm font-semibold tracking-wide uppercase">Coastal Tide</span>
                </div>
                {soundType === 'ocean' && <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />}
              </button>

              <button
                onClick={() => startSound('binaural')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                  soundType === 'binaural' 
                    ? 'bg-purple-500/10 border-purple-500/30 text-purple-200' 
                    : 'bg-white/3 border-white/5 text-gray-400 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm font-semibold tracking-wide uppercase">Alpha Binaural</span>
                </div>
                {soundType === 'binaural' && <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />}
              </button>
            </div>

            {isPlaying && (
              <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span className="flex items-center gap-1.5 uppercase font-semibold">
                    <Volume2 className="w-3.5 h-3.5" />
                    Synth Level
                  </span>
                  <span className="font-mono">{Math.round(volume * 100)}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <button 
                  onClick={stopSound}
                  className="text-xs uppercase font-bold text-center text-red-400 hover:text-red-300 w-full mt-2 cursor-pointer"
                >
                  Silence Synth Output
                </button>
              </div>
            )}

          </GlassCard>
        </div>

      </div>
    </main>
  );
}
