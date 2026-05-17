'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import GlassCard from '../../components/GlassCard';
import GlowButton from '../../components/GlowButton';
import { 
  CheckSquare, 
  Plus, 
  Flame, 
  Trash2, 
  Activity, 
  Heart, 
  Sparkles,
  BookOpen,
  Layout
} from 'lucide-react';

export default function HabitTrackerPage() {
  const [habits, setHabits] = useState<any[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('mindfulness');

  const categories = [
    { key: 'mindfulness', name: 'Mindfulness', icon: Heart, color: 'text-purple-400 bg-purple-500/10' },
    { key: 'learning', name: 'Learning', icon: BookOpen, color: 'text-cyan-400 bg-cyan-500/10' },
    { key: 'exercise', name: 'Exercise', icon: Activity, color: 'text-emerald-400 bg-emerald-500/10' },
    { key: 'work', name: 'Deep Work', icon: Layout, color: 'text-amber-400 bg-amber-500/10' }
  ];

  const fetchHabits = async () => {
    try {
      const token = localStorage.getItem('sb-access-token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('http://localhost:5000/api/habits', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.success) setHabits(data.habits);
      }
    } catch (e) {
      console.warn('API offline, generating local sandbox fallback states');
      setHabits([
        { id: 'h1', name: 'Morning Meditation', category: 'mindfulness', streak: 4, completedToday: true },
        { id: 'h2', name: 'Read 10 Pages', category: 'learning', streak: 2, completedToday: false },
        { id: 'h3', name: 'Drink 3L Water', category: 'exercise', streak: 12, completedToday: true },
        { id: 'h4', name: 'Stretching Routine', category: 'exercise', streak: 0, completedToday: false }
      ]);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const payload = {
      name: newHabitName,
      category: newHabitCategory,
      frequency: 'daily'
    };

    try {
      const token = localStorage.getItem('sb-access-token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('http://localhost:5000/api/habits', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setNewHabitName('');
        fetchHabits();
      } else {
        throw new Error();
      }
    } catch (e) {
      // Sandbox fallback append
      const fallbackHabit = {
        id: Math.random().toString(36).substr(2, 9),
        name: newHabitName,
        category: newHabitCategory,
        streak: 0,
        completedToday: false
      };
      setHabits(prev => [...prev, fallbackHabit]);
      setNewHabitName('');
    }
  };

  const handleToggleHabit = async (id: string) => {
    // Optimistic local UI toggle
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const completed = !h.completedToday;
        return {
          ...h,
          completedToday: completed,
          streak: completed ? h.streak + 1 : Math.max(0, h.streak - 1)
        };
      }
      return h;
    }));

    try {
      const token = localStorage.getItem('sb-access-token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`http://localhost:5000/api/habits/${id}/toggle`, {
        method: 'POST',
        headers
      });
    } catch (e) {
      console.warn('API error, habit toggled locally in sandbox mode');
    }
  };

  const handleDeleteHabit = async (id: string) => {
    // Optimistic local deletion
    setHabits(prev => prev.filter(h => h.id !== id));

    try {
      const token = localStorage.getItem('sb-access-token');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`http://localhost:5000/api/habits/${id}`, {
        method: 'DELETE',
        headers
      });
    } catch (e) {
      console.warn('API error, habit deleted locally in sandbox');
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] text-white pt-24 pb-16 px-4 md:px-8 cyber-grid flex flex-col items-center">
      <Navbar />

      <div className="absolute top-10 right-1/4 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-4xl z-10 space-y-8">
        
        {/* Page title */}
        <div className="flex justify-between items-center border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-2">
              <CheckSquare className="w-7 h-7 text-cyan-400 animate-pulse" />
              Habit Architect
            </h1>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Reinforce neural behaviors through consistency</p>
          </div>
        </div>

        {/* Top Segment: Habit Creation Panel & Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Creation panel */}
          <GlassCard glowColor="cyan" className="md:col-span-2">
            <h3 className="font-bold text-sm uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-1">
              <Plus className="w-4 h-4" />
              Stack New Habit
            </h3>
            
            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Behavior Name</label>
                <input
                  type="text"
                  placeholder="E.g. Study 1hr Neural Systems"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Category Stack</label>
                  <select
                    value={newHabitCategory}
                    onChange={(e) => setNewHabitCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm bg-black/60 cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat.key} value={cat.key}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <GlowButton type="submit" variant="cyan" className="w-full py-2.5 text-xs font-bold uppercase tracking-widest">
                    Launch Stack
                  </GlowButton>
                </div>
              </div>
            </form>
          </GlassCard>

          {/* Quick habits stats */}
          <GlassCard glowColor="none" className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Habit Metrics</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-none">Total Active Stack</p>
                <p className="text-3xl font-black text-white mt-1.5">{habits.length}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-none">Today's Completions</p>
                <p className="text-3xl font-black text-cyan-400 mt-1.5">
                  {habits.filter(h => h.completedToday).length} / {habits.length}
                </p>
              </div>
            </div>
          </GlassCard>

        </div>

        {/* Bottom Section: Active habits grid list */}
        <div className="space-y-4">
          <h2 className="font-bold text-sm uppercase tracking-widest text-gray-400">Active Habits Stack</h2>

          {habits.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl bg-white/2">
              <p className="text-xs text-gray-500 uppercase tracking-widest animate-pulse">Locker is Empty. Stack a habit above to begin!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {habits.map((h) => {
                const catInfo = categories.find(c => c.key === h.category) || categories[0];
                const CatIcon = catInfo.icon;

                return (
                  <GlassCard 
                    key={h.id} 
                    glowColor={h.completedToday ? 'cyan' : 'none'}
                    className={`flex items-center justify-between p-5 ${
                      h.completedToday ? 'bg-cyan-500/5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      
                      {/* Interactive toggle block */}
                      <button
                        onClick={() => handleToggleHabit(h.id)}
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center cursor-pointer transition-all active:scale-90 ${
                          h.completedToday 
                            ? 'bg-cyan-500 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                            : 'bg-white/3 border-white/5 text-gray-500 hover:border-white/15'
                        }`}
                      >
                        {h.completedToday ? '✔' : ' '}
                      </button>

                      <div>
                        <h4 className={`font-bold text-sm ${h.completedToday ? 'line-through text-gray-500' : 'text-white'}`}>
                          {h.name}
                        </h4>
                        
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${catInfo.color}`}>
                            <CatIcon className="w-2.5 h-2.5" />
                            {catInfo.name}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono flex items-center gap-0.5">
                            <Flame className="w-3 h-3 text-amber-500 fill-amber-500/10" />
                            {h.streak}d streak
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteHabit(h.id)}
                      className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
