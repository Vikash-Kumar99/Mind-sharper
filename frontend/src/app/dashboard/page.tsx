'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import GlassCard from '../../components/GlassCard';
import GlowButton from '../../components/GlowButton';
import { 
  Brain, 
  Flame, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Smile, 
  TrendingUp, 
  Lightbulb, 
  ArrowRight,
  UserCheck
} from 'lucide-react';

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>({
    username: 'mind_voyager',
    full_name: 'Mind Voyager (Sandbox)',
    xp: 1450,
    level: 2,
    streak_count: 5,
    xpInCurrentLevel: 450,
    xpNeededForNextLevel: 1000,
    levelProgressPercentage: 45
  });
  
  const [insight, setInsight] = useState<any>({
    quote: "Neuroplasticity is a lifetime subscription to structural adaptation.",
    author: "Dr. Andrew Huberman",
    category: "Neuroscience"
  });

  const [habits, setHabits] = useState<any[]>([
    { id: 'h1', name: 'Morning Meditation', category: 'mindfulness', completedToday: true, streak: 4 },
    { id: 'h2', name: 'Read 10 Pages', category: 'learning', completedToday: false, streak: 2 },
    { id: 'h3', name: 'Drink 3L Water', category: 'health', completedToday: true, streak: 12 },
  ]);

  const [goals, setGoals] = useState<any[]>([
    { id: 'g1', title: 'Complete Memory Matrix Level 10', status: 'pending', xp_reward: 150 },
    { id: 'g2', title: 'Log 120 Deep Work Minutes', status: 'completed', xp_reward: 200 }
  ]);

  const [moodScore, setMoodScore] = useState<number | null>(null);
  const [moodSuccess, setMoodSuccess] = useState(false);

  // Fetch metrics on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('sb-access-token'); // Check Supabase token or sandbox session
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // 1. Fetch Profile Info
        const profileRes = await fetch('http://localhost:5000/api/gamification/profile', { headers }).catch(() => null);
        if (profileRes && profileRes.ok) {
          const res = await profileRes.json();
          if (res.success) setProfile(res.profile);
        }

        // 2. Fetch daily neuroscience insight
        const insightRes = await fetch('http://localhost:5000/api/ai/insights/daily').catch(() => null);
        if (insightRes && insightRes.ok) {
          const res = await insightRes.json();
          if (res.success) setInsight(res.insight);
        }

        // 3. Fetch Habits
        const habitsRes = await fetch('http://localhost:5000/api/habits', { headers }).catch(() => null);
        if (habitsRes && habitsRes.ok) {
          const res = await habitsRes.json();
          if (res.success) setHabits(res.habits);
        }

        // 4. Fetch Goals
        const goalsRes = await fetch('http://localhost:5000/api/goals', { headers }).catch(() => null);
        if (goalsRes && goalsRes.ok) {
          const res = await goalsRes.json();
          if (res.success) setGoals(res.goals);
        }
      } catch (e) {
        console.warn('Dashboard API error, running in sandboxed mock mode:', e);
      }
    };

    fetchDashboardData();
  }, []);

  const handleToggleHabit = async (id: string) => {
    // Optimistic toggle
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const nextCompleted = !h.completedToday;
        return {
          ...h,
          completedToday: nextCompleted,
          streak: nextCompleted ? h.streak + 1 : Math.max(0, h.streak - 1)
        };
      }
      return h;
    }));

    try {
      const token = localStorage.getItem('sb-access-token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`http://localhost:5000/api/habits/${id}/toggle`, {
        method: 'POST',
        headers
      });
      if (res.ok) {
        const data = await res.json();
        // Give XP boost locally
        setProfile((prev: any) => ({
          ...prev,
          xp: Math.max(0, prev.xp + data.xpEarned),
          xpInCurrentLevel: Math.max(0, (prev.xp + data.xpEarned) % 1000)
        }));
      }
    } catch (e) {
      console.warn('Failed to toggle habit in server:', e);
    }
  };

  const handleToggleGoal = async (id: string) => {
    // Optimistic toggle
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        return { ...g, status: g.status === 'pending' ? 'completed' : 'pending' };
      }
      return g;
    }));

    try {
      const token = localStorage.getItem('sb-access-token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`http://localhost:5000/api/goals/${id}/complete`, {
        method: 'POST',
        headers
      });
      if (res.ok) {
        const data = await res.json();
        setProfile((prev: any) => ({
          ...prev,
          xp: prev.xp + data.xpEarned,
          xpInCurrentLevel: (prev.xp + data.xpEarned) % 1000
        }));
      }
    } catch (e) {
      console.warn('Failed to complete goal in server:', e);
    }
  };

  const handleMoodCheckin = async (score: number) => {
    setMoodScore(score);
    setMoodSuccess(true);
    setTimeout(() => setMoodSuccess(false), 3000);

    try {
      const token = localStorage.getItem('sb-access-token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch('http://localhost:5000/api/mood', {
        method: 'POST',
        headers,
        body: JSON.stringify({ mood_score: score, note: 'Logged via quick dashboard dashboard' })
      });
    } catch (e) {
      console.warn('Failed to log mood in server:', e);
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] text-white pt-24 pb-16 px-4 md:px-8 cyber-grid flex flex-col items-center">
      <Navbar />

      {/* Grid Radial Shadows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-6xl z-10 space-y-8">
        
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase flex items-center gap-2">
              Neural Console <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded uppercase tracking-widest font-mono">OPERATIONAL</span>
            </h1>
            <p className="text-sm text-gray-400 font-light mt-1">Hello, {profile.full_name || 'Shaper Operator'}. Welcome back to your brain core.</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Streak Counter */}
            <div className="flex items-center gap-2 bg-amber-500/5 border border-amber-500/10 rounded-2xl px-4 py-2.5 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
              <Flame className="w-5 h-5 text-amber-500 animate-pulse fill-amber-500" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest leading-none">Check-in Streak</p>
                <p className="text-lg font-black text-amber-400 leading-none mt-1">{profile.streak_count} Days</p>
              </div>
            </div>
            {/* Level Counter */}
            <div className="flex items-center gap-2 bg-purple-500/5 border border-purple-500/10 rounded-2xl px-4 py-2.5 shadow-[0_0_15px_rgba(168,85,247,0.05)]">
              <Brain className="w-5 h-5 text-purple-400 animate-pulse" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest leading-none">Current Level</p>
                <p className="text-lg font-black text-purple-400 leading-none mt-1">Level {profile.level}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Level Up Progress Meter */}
        <GlassCard glowColor="purple" className="relative overflow-hidden py-5 px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="font-bold text-sm uppercase tracking-wider text-purple-300">XP Progression Grid</span>
            </div>
            <span className="text-xs text-gray-400 font-mono">{profile.xpInCurrentLevel} / {profile.xpNeededForNextLevel} XP ({profile.levelProgressPercentage}%)</span>
          </div>
          
          {/* Progress Bar container */}
          <div className="w-full bg-black/40 rounded-full h-3 border border-white/5 p-[1px]">
            <div 
              style={{ width: `${profile.levelProgressPercentage}%` }}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_#a855f7]"
            />
          </div>
        </GlassCard>

        {/* Main Grid split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Col 1 & 2: Daily Checklist & Goals */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Habits stack */}
            <GlassCard glowColor="cyan">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                  <h2 className="font-bold text-lg uppercase tracking-wider">Habit Stacking</h2>
                </div>
                <Link href="/habits" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold uppercase tracking-wider">
                  Manage Habits
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-3">
                {habits.map((h) => (
                  <div 
                    key={h.id} 
                    onClick={() => handleToggleHabit(h.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer select-none active:scale-[0.99] transition-all duration-200 ${
                      h.completedToday 
                        ? 'bg-cyan-500/5 border-cyan-500/20 text-cyan-200' 
                        : 'bg-white/3 border-white/5 text-gray-300 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        h.completedToday ? 'border-cyan-500 bg-cyan-600' : 'border-gray-500'
                      }`}>
                        {h.completedToday && <span className="text-[10px] text-white">✔</span>}
                      </div>
                      <span className={`text-sm ${h.completedToday ? 'line-through text-gray-500' : ''}`}>{h.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-cyan-400">
                      <Flame className="w-3.5 h-3.5 fill-cyan-500/10" />
                      <span>{h.streak}d streak</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Goals list */}
            <GlassCard glowColor="emerald">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-400" />
                  <h2 className="font-bold text-lg uppercase tracking-wider">Neural Targets</h2>
                </div>
                <Link href="/dashboard" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold uppercase tracking-wider">
                  Target log
                </Link>
              </div>

              <div className="space-y-3">
                {goals.map((g) => (
                  <div 
                    key={g.id}
                    onClick={() => handleToggleGoal(g.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer select-none active:scale-[0.99] transition-all duration-200 ${
                      g.status === 'completed' 
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-200' 
                        : 'bg-white/3 border-white/5 text-gray-300 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        g.status === 'completed' ? 'border-emerald-500 bg-emerald-600' : 'border-gray-500'
                      }`}>
                        {g.status === 'completed' && <span className="text-[9px] text-white">✔</span>}
                      </div>
                      <span className={`text-sm ${g.status === 'completed' ? 'line-through text-gray-500' : ''}`}>{g.title}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded">
                      +{g.xp_reward} XP
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>

          </div>

          {/* Col 3: Insights & Quick Exercises */}
          <div className="space-y-8">
            
            {/* Scientific Motivation Insight */}
            <GlassCard glowColor="purple" className="relative flex flex-col">
              <div className="flex items-center gap-1.5 text-purple-400 mb-4">
                <Lightbulb className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Cognitive Impulse</span>
              </div>
              <blockquote className="text-sm italic leading-relaxed text-purple-200 font-light mb-4">
                "{insight.quote}"
              </blockquote>
              <div className="mt-auto flex justify-between items-center text-xs">
                <span className="text-gray-400">— {insight.author}</span>
                <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-mono uppercase tracking-widest text-[9px]">
                  {insight.category}
                </span>
              </div>
            </GlassCard>

            {/* Quick Mood check-in */}
            <GlassCard glowColor="none">
              <div className="flex items-center gap-2 mb-4">
                <Smile className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm uppercase tracking-wider">Mood Baseline</h3>
              </div>
              <p className="text-xs text-gray-500 leading-normal mb-5">Identify your focus state by checking in your daily mood score.</p>
              
              <div className="flex justify-around gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleMoodCheckin(val)}
                    className={`w-9 h-9 rounded-xl border font-bold text-sm transition-all cursor-pointer flex items-center justify-center active:scale-90 ${
                      moodScore === val 
                        ? 'bg-indigo-500 border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)] text-white' 
                        : 'bg-white/3 border-white/5 text-gray-400 hover:border-white/15 hover:text-white'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>

              {moodSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl p-2.5 text-center flex items-center justify-center gap-1.5 animate-pulse">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Mood state logged successfully!</span>
                </div>
              )}
            </GlassCard>

            {/* Fast Quick Links */}
            <div className="grid grid-cols-2 gap-4">
              <Link href="/brain" className="w-full">
                <GlassCard glowColor="purple" className="p-4 text-center hover:scale-[1.02] cursor-pointer flex flex-col items-center">
                  <Brain className="w-6 h-6 text-purple-400 mb-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">Brain Gym</span>
                </GlassCard>
              </Link>
              <Link href="/focus" className="w-full">
                <GlassCard glowColor="cyan" className="p-4 text-center hover:scale-[1.02] cursor-pointer flex flex-col items-center">
                  <Clock className="w-6 h-6 text-cyan-400 mb-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">Focus Zone</span>
                </GlassCard>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
