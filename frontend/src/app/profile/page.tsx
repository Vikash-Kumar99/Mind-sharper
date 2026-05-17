'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import GlassCard from '../../components/GlassCard';
import GlowButton from '../../components/GlowButton';
import { 
  User, 
  Sparkles, 
  Flame, 
  Brain, 
  Award, 
  Zap, 
  Heart,
  Star,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>({
    username: 'neon_shaper_404',
    full_name: 'Neural Wanderer (Sandbox)',
    xp: 1450,
    level: 2,
    streak_count: 5,
    xpInCurrentLevel: 450,
    xpNeededForNextLevel: 1000,
    levelProgressPercentage: 45
  });

  const [achievements, setAchievements] = useState<any[]>([
    { id: 'a1', title: 'First Light', description: 'Log your first brain training score', icon_key: 'sparkles', xp_reward: 100, unlocked: true },
    { id: 'a2', title: 'Focus Master', description: 'Complete a deep work focus session of 25 minutes or more', icon_key: 'zap', xp_reward: 200, unlocked: true },
    { id: 'a3', title: 'Iron Will', description: 'Maintain a brain training streak of 5 active daily logs', icon_key: 'flame', xp_reward: 300, unlocked: false },
    { id: 'a4', title: 'Mind Architect', description: 'Accumulate 2,000 Total XP across games and habits', icon_key: 'brain', xp_reward: 500, unlocked: false },
    { id: 'a5', title: 'Inner Zen', description: 'Log your mood 3 days in a row to establish mindful awareness', icon_key: 'heart', xp_reward: 150, unlocked: false }
  ]);

  const fetchProfileAndAchievements = async () => {
    try {
      const token = localStorage.getItem('sb-access-token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // 1. Profile stats
      const profileRes = await fetch('http://localhost:5000/api/gamification/profile', { headers }).catch(() => null);
      if (profileRes && profileRes.ok) {
        const res = await profileRes.json();
        if (res.success) setProfile(res.profile);
      }

      // 2. Achievements stats
      const achievementsRes = await fetch('http://localhost:5000/api/gamification/achievements', { headers }).catch(() => null);
      if (achievementsRes && achievementsRes.ok) {
        const res = await achievementsRes.json();
        if (res.success) setAchievements(res.achievements);
      }
    } catch (e) {
      console.warn('API offline, generating local sandbox fallbacks');
    }
  };

  useEffect(() => {
    fetchProfileAndAchievements();
  }, []);

  // Icon selector helper
  const getBadgeIcon = (key: string, isUnlocked: boolean) => {
    const size = "w-6 h-6";
    const color = isUnlocked ? "text-yellow-400" : "text-gray-600";
    
    if (key === 'sparkles') return <Sparkles className={`${size} ${color}`} />;
    if (key === 'zap') return <Zap className={`${size} ${color}`} />;
    if (key === 'flame') return <Flame className={`${size} ${color}`} />;
    if (key === 'brain') return <Brain className={`${size} ${color}`} />;
    if (key === 'heart') return <Heart className={`${size} ${color}`} />;
    return <Award className={`${size} ${color}`} />;
  };

  return (
    <main className="min-h-screen bg-[#030712] text-white pt-24 pb-16 px-4 md:px-8 cyber-grid flex flex-col items-center">
      <Navbar />

      <div className="absolute top-20 right-1/4 w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-4xl z-10 space-y-8">
        
        {/* Profile Card Header */}
        <GlassCard glowColor="purple" className="flex flex-col md:flex-row items-center gap-6 p-8 relative overflow-hidden">
          
          {/* Cybernetic avatar block */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 border border-white/10 flex items-center justify-center text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] animate-pulse-slow">
              <User className="w-10 h-10" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs border-2 border-[#030712]">
              {profile.level}
            </div>
          </div>

          {/* User descriptions */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight text-white uppercase">{profile.full_name}</h2>
              <span className="text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded uppercase tracking-widest font-bold">
                @{profile.username}
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-normal font-light">AUTHORIZED OPERATOR UNIT // MIND ARCHITECT SHARDS ACTIVE</p>
            
            {/* Quick mini metrics */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-3 text-xs">
              <span className="flex items-center gap-1 font-mono text-yellow-400 font-bold bg-yellow-500/5 border border-yellow-500/10 px-2.5 py-1 rounded-xl">
                <Star className="w-3.5 h-3.5 fill-yellow-400/10" />
                {profile.xp} Total XP
              </span>
              <span className="flex items-center gap-1 font-mono text-amber-500 font-bold bg-amber-500/5 border border-amber-500/10 px-2.5 py-1 rounded-xl">
                <Flame className="w-3.5 h-3.5 fill-amber-500/10" />
                {profile.streak_count} Streak
              </span>
              <span className="flex items-center gap-1 font-mono text-emerald-400 font-bold bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-1 rounded-xl">
                <CheckCircle className="w-3.5 h-3.5" />
                Level {profile.level} Operator
              </span>
            </div>
          </div>

        </GlassCard>

        {/* Unlocked Badges list */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Award className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-300">Neural Badges / Achievements</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((ach) => (
              <GlassCard 
                key={ach.id} 
                glowColor={ach.unlocked ? 'purple' : 'none'}
                className={`flex items-start gap-4 p-5 transition-all duration-300 ${
                  ach.unlocked 
                    ? 'bg-purple-500/5 border-purple-500/25 shadow-[0_0_20px_rgba(168,85,247,0.05)]' 
                    : 'bg-white/2 border-white/5 opacity-55 saturate-50'
                }`}
              >
                {/* Badge Icon circle */}
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${
                  ach.unlocked 
                    ? 'bg-yellow-500/10 border-yellow-500/30' 
                    : 'bg-white/5 border-white/5'
                }`}>
                  {getBadgeIcon(ach.icon_key, ach.unlocked)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-bold text-sm ${ach.unlocked ? 'text-white' : 'text-gray-400'}`}>
                      {ach.title}
                    </h4>
                    {ach.unlocked && (
                      <span className="inline-flex text-[9px] px-1.5 py-0.5 rounded uppercase font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 tracking-wider">
                        Unlocked
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-500 leading-normal font-light">
                    {ach.description}
                  </p>

                  <span className="text-[10px] text-purple-400 font-semibold block pt-1.5">
                    Reward: +{ach.xp_reward} XP
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
